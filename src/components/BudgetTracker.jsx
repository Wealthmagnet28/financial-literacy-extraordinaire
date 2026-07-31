import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getSession } from '../lib/auth';
import * as s from './authStyles';

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function fmt(n) {
  return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function EmptyState({ children }) {
  return <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>{children}</p>;
}

const qaFormStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  padding: '20px',
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

export default function BudgetTracker() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);

  const [openForm, setOpenForm] = useState(null); // 'transaction' | 'goal' | null
  const [txForm, setTxForm] = useState({ amount: '', type: 'expense', category: '', merchant: '', occurred_at: new Date().toISOString().slice(0, 10) });
  const [goalForm, setGoalForm] = useState({ title: '', target_amount: '', target_date: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadAll = async (uid) => {
    const [b, t, g, h, i, a, l] = await Promise.all([
      supabase.from('budgets').select('*').eq('user_id', uid),
      supabase.from('transactions').select('*').eq('user_id', uid).order('occurred_at', { ascending: false }),
      supabase.from('goals').select('*').eq('user_id', uid).order('target_date', { ascending: true }),
      supabase.from('habits').select('*').eq('user_id', uid),
      supabase.from('investments').select('*').eq('user_id', uid),
      supabase.from('alerts').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('account_access_logs').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
    ]);
    setBudgets(b.data || []);
    setTransactions(t.data || []);
    setGoals(g.data || []);
    setHabits(h.data || []);
    setInvestments(i.data || []);
    setAlerts(a.data || []);
    setAccessLogs(l.data || []);
  };

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) return;
      setUserId(session.user.id);
      await loadAll(session.user.id);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const expenseThisMonth = transactions
    .filter((t) => t.type === 'expense' && new Date(t.occurred_at) >= monthStart)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseThisWeek = transactions
    .filter((t) => t.type === 'expense' && new Date(t.occurred_at) >= weekStart)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentBalance = transactions.reduce(
    (sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
    0
  );

  const monthlyBudget = budgets.reduce((sum, b) => sum + Number(b.monthly_limit || 0), 0);
  const hasBudget = budgets.length > 0;
  const remainingBudget = Math.max(monthlyBudget - expenseThisMonth, 0);
  const daysLeftInMonth = Math.max(daysInMonth(now) - now.getDate() + 1, 1);
  const dailySafeSpend = hasBudget ? remainingBudget / daysLeftInMonth : null;
  const overBudget = hasBudget && expenseThisMonth > monthlyBudget;

  const activeGoals = goals.filter((g) => g.status === 'active');
  const primaryGoal = activeGoals[0] || null;
  const goalPct = primaryGoal ? Math.min(Math.round((Number(primaryGoal.current_amount) / Number(primaryGoal.target_amount)) * 100), 100) : null;
  const goalRemaining = primaryGoal ? Math.max(Number(primaryGoal.target_amount) - Number(primaryGoal.current_amount), 0) : null;

  let statusText = 'Add a transaction, budget, or goal to see your status here.';
  if (transactions.length > 0 || hasBudget || goals.length > 0) {
    if (overBudget) statusText = `Over budget this month by $${fmt(expenseThisMonth - monthlyBudget)}`;
    else if (hasBudget) statusText = `On track — $${fmt(remainingBudget)} left in your monthly budget`;
    else statusText = 'No budget set yet — add one to track your spending against it.';
  }

  const insights = [];
  if (hasBudget) {
    insights.push(
      overBudget
        ? { tone: 'urgent', category: 'Monthly Spending', message: `You've spent $${fmt(expenseThisMonth)} of your $${fmt(monthlyBudget)} monthly budget — you're over by $${fmt(expenseThisMonth - monthlyBudget)}.` }
        : { tone: 'success', category: 'Monthly Spending', message: `You've spent $${fmt(expenseThisMonth)} of your $${fmt(monthlyBudget)} monthly budget — $${fmt(remainingBudget)} left.` }
    );
  }
  if (primaryGoal) {
    insights.push({
      tone: 'motivational',
      category: 'Goal Progress',
      message: `"${primaryGoal.title}" is ${goalPct}% funded — $${fmt(goalRemaining)} to go.`,
    });
  }

  const toneAccent = { urgent: 'orange', success: 'cyan', motivational: 'gold', encouraging: 'purple' };

  const weeklySpending = [3, 2, 1, 0].map((weeksAgo) => {
    const rangeStart = new Date(weekStart);
    rangeStart.setDate(rangeStart.getDate() - weeksAgo * 7);
    const rangeEnd = new Date(rangeStart);
    rangeEnd.setDate(rangeEnd.getDate() + 7);
    const actual = transactions
      .filter((t) => t.type === 'expense' && new Date(t.occurred_at) >= rangeStart && new Date(t.occurred_at) < rangeEnd)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { label: weeksAgo === 0 ? 'This week' : `${weeksAgo} wk${weeksAgo > 1 ? 's' : ''} ago`, actual };
  });
  const weekMax = Math.max(...weeklySpending.map((w) => w.actual), monthlyBudget / 4 || 1, 1);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!txForm.amount || Number(txForm.amount) <= 0) {
      setFormError('Enter an amount greater than 0.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      amount: Number(txForm.amount),
      type: txForm.type,
      category: txForm.category || null,
      merchant: txForm.merchant || null,
      occurred_at: txForm.occurred_at,
    });
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setTxForm({ amount: '', type: 'expense', category: '', merchant: '', occurred_at: new Date().toISOString().slice(0, 10) });
    setOpenForm(null);
    await loadAll(userId);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!goalForm.title.trim() || !goalForm.target_amount || Number(goalForm.target_amount) <= 0) {
      setFormError('Give your goal a title and a target amount greater than 0.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('goals').insert({
      user_id: userId,
      title: goalForm.title.trim(),
      target_amount: Number(goalForm.target_amount),
      current_amount: 0,
      target_date: goalForm.target_date || null,
      status: 'active',
    });
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setGoalForm({ title: '', target_amount: '', target_date: '' });
    setOpenForm(null);
    await loadAll(userId);
  };

  return (
    <>
      <header className="page-head fade-up in-view">
        <p className="eyebrow">Your Money, Understood</p>
        <h1>Budget Tracker</h1>
        <p className="page-sub">Real insight into your spending, goals, habits, and investments — built to keep you moving, not just watching.</p>
        <div className="quick-actions">
          <button className="qa-btn qa-primary" onClick={() => { setFormError(''); setOpenForm(openForm === 'transaction' ? null : 'transaction'); }}>+ Add Transaction</button>
          <button className="qa-btn" onClick={() => { setFormError(''); setOpenForm(openForm === 'goal' ? null : 'goal'); }}>+ Set Goal</button>
          <button className="qa-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Connect Account (Coming Soon)</button>
        </div>

        {openForm === 'transaction' && (
          <form style={qaFormStyle} onSubmit={handleAddTransaction}>
            {formError && <div style={s.errorBox}>{formError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={s.label}>Amount</label>
                <input type="number" min="0.01" step="0.01" style={s.input} value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>Type</label>
                <select style={s.select} value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Category</label>
                <input type="text" style={s.input} value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>Merchant (optional)</label>
                <input type="text" style={s.input} value={txForm.merchant} onChange={(e) => setTxForm({ ...txForm, merchant: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>Date</label>
                <input type="date" style={s.input} value={txForm.occurred_at} onChange={(e) => setTxForm({ ...txForm, occurred_at: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={saving} style={s.buttonPrimary(saving)}>{saving ? 'Saving...' : 'Add Transaction'}</button>
          </form>
        )}

        {openForm === 'goal' && (
          <form style={qaFormStyle} onSubmit={handleAddGoal}>
            {formError && <div style={s.errorBox}>{formError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Goal Title</label>
                <input type="text" style={s.input} value={goalForm.title} onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>Target Amount</label>
                <input type="number" min="0.01" step="0.01" style={s.input} value={goalForm.target_amount} onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>Target Date (optional)</label>
                <input type="date" style={s.input} value={goalForm.target_date} onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={saving} style={s.buttonPrimary(saving)}>{saving ? 'Saving...' : 'Set Goal'}</button>
          </form>
        )}
      </header>

      {/* SNAPSHOT */}
      <section className="snapshot fade-up in-view">
        <div className="snap-card">
          <span className="snap-label">Today's Safe Spend</span>
          <span className="snap-value gl-cyan">{dailySafeSpend !== null ? `$${fmt(dailySafeSpend)}` : '—'}</span>
          <span className="snap-note">{hasBudget ? "Based on this month's remaining budget" : 'Add a budget to see this'}</span>
        </div>
        <div className="snap-card">
          <span className="snap-label">This Month vs Budget</span>
          <span className="snap-value gl-gold">${fmt(expenseThisMonth)}</span>
          <span className="snap-note">{hasBudget ? `Monthly budget $${fmt(monthlyBudget)}` : 'No budget set'}</span>
          {hasBudget && (
            <div className="snap-bar">
              <div className={`snap-bar-actual ${overBudget ? 'over' : ''}`} style={{ width: `${Math.min((expenseThisMonth / monthlyBudget) * 100, 100)}%` }}></div>
            </div>
          )}
        </div>
        <div className="snap-card">
          <span className="snap-label">Goal Progress</span>
          <span className="snap-value gl-purple">{goalPct !== null ? `${goalPct}%` : '—'}</span>
          <span className="snap-note">{goalRemaining !== null ? `$${fmt(goalRemaining)} remaining` : 'No active goal'}</span>
        </div>
        <div className="snap-card snap-status">
          <span className="snap-label">Status</span>
          <span className="snap-status-text">{statusText}</span>
        </div>
      </section>

      <div className="two-col">
        {/* AI FEED / INSIGHTS */}
        <section className="panel ai-feed fade-up in-view">
          <h2 className="panel-h">Insights</h2>
          <div className="feed-list">
            {insights.length === 0 && <EmptyState>Add a transaction or goal to start seeing personalized insights here.</EmptyState>}
            {insights.map((item, idx) => (
              <div key={idx} className={`feed-item accent-${toneAccent[item.tone]}`}>
                <span className="feed-cat">{item.category}</span>
                <p>{item.message}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ALERTS */}
        <section className="panel alerts-panel fade-up in-view">
          <h2 className="panel-h">Alerts</h2>
          <div className="alert-list">
            {alerts.length === 0 && <EmptyState>No alerts yet. We'll let you know if we spot anything worth flagging.</EmptyState>}
            {alerts.map((a) => (
              <div key={a.id} className={`alert-item accent-${a.severity === 'urgent' ? 'orange' : a.severity === 'warning' ? 'gold' : 'cyan'}`}>
                <div className="alert-top">
                  <span className="alert-type">{a.alert_type}</span>
                  <span className="alert-time">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                <p>{a.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* GOALS */}
      <section className="panel-full fade-up in-view">
        <h2 className="panel-h">Goals</h2>
        {goals.length === 0 ? (
          <EmptyState>You haven't set any goals yet — click "+ Set Goal" above to add one.</EmptyState>
        ) : (
          <div className="goal-grid">
            {goals.map((g) => {
              const pct = Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100);
              const accent = g.status === 'completed' ? 'cyan' : 'gold';
              return (
                <div key={g.id} className={`goal-card accent-${accent}`}>
                  <div className="goal-top">
                    <h3>{g.title}</h3>
                    <span className="goal-type">{g.status}</span>
                  </div>
                  <div className="goal-ring-row">
                    <div className="goal-ring">
                      <svg viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
                        <circle cx="40" cy="40" r="34" fill="none" className={`ring-stroke-${accent}`} strokeWidth="6" strokeDasharray={`${(Math.min(pct, 100) / 100) * 214} 214`} strokeLinecap="round" transform="rotate(-90 40 40)" />
                      </svg>
                      <span className="ring-pct">{pct}%</span>
                    </div>
                    <div className="goal-nums">
                      <span className="goal-current">${fmt(g.current_amount)}<span className="goal-of"> / ${fmt(g.target_amount)}</span></span>
                      <span className="goal-due">{g.target_date ? `Due ${new Date(g.target_date).toLocaleDateString()}` : 'No due date'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* WEEKLY SPENDING */}
      <section className="panel-full fade-up in-view">
        <h2 className="panel-h">Weekly Spending</h2>
        {transactions.length === 0 ? (
          <EmptyState>Log some transactions to see your weekly spending trend.</EmptyState>
        ) : (
          <div className="week-chart">
            {weeklySpending.map((w) => {
              const barPct = Math.min((w.actual / weekMax) * 100, 100);
              return (
                <div className="week-row" key={w.label}>
                  <span className="week-label">{w.label}</span>
                  <div className="week-bar-track">
                    <div className="week-actual under" style={{ width: `${barPct}%` }}></div>
                  </div>
                  <span className="week-amount gl-cyan">${fmt(w.actual)}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="two-col">
        {/* HABITS */}
        <section className="panel fade-up in-view">
          <h2 className="panel-h">Habits</h2>
          {habits.length === 0 ? (
            <EmptyState>Habit tracking will appear here automatically as you log transactions over time.</EmptyState>
          ) : (
            <div className="habit-list">
              {habits.map((h) => (
                <div key={h.id} className="habit-card accent-gold">
                  <div className="habit-info">
                    <span className="habit-cat">{h.habit_type}</span>
                    <span className="habit-avg">Streak: {h.current_streak}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* INVESTMENTS */}
        <section className="panel fade-up in-view">
          <h2 className="panel-h">Investments</h2>
          {investments.length === 0 ? (
            <EmptyState>No investments tracked yet.</EmptyState>
          ) : (
            <div className="invest-list">
              {investments.map((inv) => {
                const gain = Number(inv.current_value) - Number(inv.purchase_price);
                return (
                  <div key={inv.id} className="invest-row">
                    <div className="invest-name">
                      <span className="invest-full">{inv.asset_name}</span>
                    </div>
                    <span className="invest-value">${fmt(inv.current_value)}</span>
                    <span className={`invest-gain ${gain >= 0 ? 'gain-pos' : 'gain-neg'}`}>{gain >= 0 ? '+' : ''}${fmt(gain)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ACCOUNT ACCESS */}
      <section className="panel-full fade-up in-view">
        <h2 className="panel-h">Recent Account Access</h2>
        <p className="access-note">A log of recent activity on your account.</p>
        {accessLogs.length === 0 ? (
          <EmptyState>No account access recorded yet.</EmptyState>
        ) : (
          <div className="access-list">
            {accessLogs.map((a) => (
              <div key={a.id} className="access-row">
                <div className="access-who">
                  <span className="access-dot dot-active"></span>
                  <span className="access-name">{a.accessed_by === userId ? 'You' : 'Another user'}</span>
                  <span className="access-role">{a.action}</span>
                </div>
                <span className="access-login">{new Date(a.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
