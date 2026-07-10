import { useState } from "react";
import {
  Home, TrendingUp, Gift, Bell, ScrollText, ChevronRight,
  Flame, Trophy, Clock, Check, X, Plus, AlertTriangle,
  Users, CalendarClock, ShieldCheck, Sparkles
} from "lucide-react";

/* ---------------------------------------------------------
   Club FLE — Parent Dashboard
   Drop this file in as a React island inside your Astro
   site (e.g. src/components/ParentDashboard.jsx) and mount
   it on the Family/Parent route with client:load.

   All data below is mock state. Wire the TODO markers up to
   your real events model (quiz_completed, goal_reached,
   reward_created, reward_redeemed, parent_acknowledged_risk)
   when the API is ready.
--------------------------------------------------------- */

const TABS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "promises", label: "Promise log", icon: ScrollText },
];

const CHILDREN = [
  { id: "emma", name: "Emma", grade: "Grade 5", initials: "E", streak: 6, weeklyScore: 82 },
  { id: "jake", name: "Jake", grade: "Grade 3", initials: "J", streak: 2, weeklyScore: 64 },
];

const QUIZZES = {
  emma: [
    { id: 1, subject: "Money basics", score: 92, trend: "up", date: "Jul 8", time: "6m" },
    { id: 2, subject: "Saving goals", score: 88, trend: "up", date: "Jul 6", time: "9m" },
    { id: 3, subject: "Budgeting", score: 61, trend: "down", date: "Jul 3", time: "11m" },
    { id: 4, subject: "Interest", score: 74, trend: "steady", date: "Jul 1", time: "7m" },
  ],
  jake: [
    { id: 1, subject: "Counting coins", score: 70, trend: "up", date: "Jul 7", time: "5m" },
    { id: 2, subject: "Piggy bank goals", score: 55, trend: "down", date: "Jul 4", time: "8m" },
  ],
};

const MASTERY = {
  emma: [
    { topic: "Saving", level: "up" }, { topic: "Budgeting", level: "down" },
    { topic: "Interest", level: "steady" }, { topic: "Investing", level: "up" },
  ],
  jake: [
    { topic: "Counting", level: "up" }, { topic: "Goals", level: "down" },
  ],
};

const INITIAL_REWARDS = [
  { id: "r1", childId: "emma", name: "Skate park afternoon", type: "experiential", goal: "5 quizzes at 70%+", progress: 3, target: 5, requiresApproval: true, isPromise: false, status: "active" },
  { id: "r2", childId: "emma", name: "Disneyland trip", type: "experiential", goal: "20 quizzes at 75%+", progress: 12, target: 20, requiresApproval: true, isPromise: true, ackAt: "Jul 2, 2026", status: "at_risk" },
  { id: "r3", childId: "jake", name: "30 extra minutes of games", type: "privilege", goal: "3 quizzes this week", progress: 3, target: 3, requiresApproval: false, isPromise: false, status: "ready" },
];

const INITIAL_NOTIFICATIONS = [
  { id: "n1", childId: "jake", type: "goal_reached", text: "Jake reached his quiz goal — approve his reward?", time: "2h ago", unread: true },
  { id: "n2", childId: "emma", type: "milestone", text: "Emma hit a 6-day streak.", time: "1d ago", unread: true },
  { id: "n3", childId: "emma", type: "weekly_summary", text: "Weekly summary is ready — 3 of 4 possible rewards given.", time: "3d ago", unread: false },
];

function trendColor(trend) {
  if (trend === "up") return "var(--good)";
  if (trend === "down") return "var(--bad)";
  return "var(--gold)";
}

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="pfle-bar">
      <div className="pfle-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ParentDashboard() {
  const [tab, setTab] = useState("overview");
  const [childId, setChildId] = useState("emma");
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showBuilder, setShowBuilder] = useState(false);
  const [draft, setDraft] = useState({ name: "", goalCount: 5, requiresApproval: true, isPromise: false });
  const [pendingAck, setPendingAck] = useState(null);
  const [ackChecked, setAckChecked] = useState(false);

  const child = CHILDREN.find((c) => c.id === childId);
  const childRewards = rewards.filter((r) => r.childId === childId);
  const childNotifications = notifications.filter((n) => n.childId === childId);
  const quizzes = QUIZZES[childId] || [];
  const mastery = MASTERY[childId] || [];

  function startCreateReward() {
    setDraft({ name: "", goalCount: 5, requiresApproval: true, isPromise: false });
    setShowBuilder(true);
  }

  function saveReward() {
    if (!draft.name.trim()) return;
    const newReward = {
      id: `r${Date.now()}`,
      childId,
      name: draft.name,
      type: "tangible",
      goal: `${draft.goalCount} quizzes`,
      progress: 0,
      target: draft.goalCount,
      requiresApproval: draft.requiresApproval,
      isPromise: draft.isPromise,
      status: draft.isPromise ? "at_risk" : "active",
    };
    if (draft.isPromise) {
      setPendingAck(newReward);
      setAckChecked(false);
      setShowBuilder(false);
    } else {
      // TODO: POST reward_created event to API
      setRewards((prev) => [...prev, newReward]);
      setShowBuilder(false);
    }
  }

  function confirmPromise() {
    if (!ackChecked || !pendingAck) return;
    // TODO: POST reward_created + parent_acknowledged_risk events to API
    setRewards((prev) => [
      ...prev,
      { ...pendingAck, ackAt: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) },
    ]);
    setPendingAck(null);
  }

  function markNotificationRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  function updatePromiseStatus(id, status) {
    // TODO: POST audit log entry for fulfilled/broken transitions
    setRewards((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const promiseRewards = rewards.filter((r) => r.isPromise);

  return (
    <div className="pfle-root">
      <style>{`
        .pfle-root {
          --void: #0a0714;
          --panel: rgba(139,92,246,0.07);
          --panel-border: rgba(240,194,75,0.18);
          --purple: #8b5cf6;
          --purple-deep: #4c2e8c;
          --gold: #f0c24b;
          --orange: #ff8a4c;
          --text: #f3eeff;
          --muted: #a99bc9;
          --good: #4ade80;
          --bad: #f2665f;
          font-family: 'Inter', system-ui, sans-serif;
          background: radial-gradient(ellipse at top, #1a0f2e 0%, var(--void) 60%);
          color: var(--text);
          border-radius: 20px;
          padding: 28px;
          max-width: 920px;
        }
        .pfle-root h1, .pfle-root h2, .pfle-root h3 {
          font-family: 'Playfair Display', Georgia, serif;
          margin: 0;
        }
        .pfle-topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
        .pfle-children { display:flex; gap:8px; }
        .pfle-child-chip {
          display:flex; align-items:center; gap:8px; padding:6px 14px 6px 6px;
          border-radius:999px; border:1px solid var(--panel-border); background: var(--panel);
          cursor:pointer; color:var(--muted); font-size:13px; transition: all .15s;
        }
        .pfle-child-chip.active { color:var(--text); border-color:var(--gold); box-shadow:0 0 0 1px var(--gold) inset; }
        .pfle-avatar { width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,var(--purple),var(--orange)); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#1a0f2e; }
        .pfle-tabs { display:flex; gap:4px; border-bottom:1px solid var(--panel-border); margin-bottom:22px; overflow-x:auto; }
        .pfle-tab { display:flex; align-items:center; gap:6px; padding:10px 16px; font-size:13px; color:var(--muted); background:none; border:none; cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; }
        .pfle-tab.active { color:var(--gold); border-bottom-color:var(--gold); }
        .pfle-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin-bottom:20px; }
        .pfle-card { background:var(--panel); border:1px solid var(--panel-border); border-radius:14px; padding:16px; backdrop-filter: blur(6px); }
        .pfle-card-label { font-size:12px; color:var(--muted); margin-bottom:6px; }
        .pfle-card-value { font-size:22px; font-weight:600; }
        .pfle-bar { height:6px; border-radius:999px; background:rgba(255,255,255,0.08); overflow:hidden; margin-top:8px; }
        .pfle-bar-fill { height:100%; background:linear-gradient(90deg,var(--purple),var(--gold)); }
        .pfle-list-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .pfle-pill { font-size:11px; padding:3px 9px; border-radius:999px; font-weight:600; }
        .pfle-pill.up { background:rgba(74,222,128,0.15); color:var(--good); }
        .pfle-pill.down { background:rgba(242,102,95,0.15); color:var(--bad); }
        .pfle-pill.steady { background:rgba(240,194,75,0.15); color:var(--gold); }
        .pfle-btn { background:linear-gradient(135deg,var(--purple),var(--purple-deep)); color:#fff; border:none; padding:10px 18px; border-radius:10px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px; }
        .pfle-btn.ghost { background:transparent; border:1px solid var(--panel-border); color:var(--text); }
        .pfle-btn.gold { background:linear-gradient(135deg,var(--gold),var(--orange)); color:#2a1a05; font-weight:600; }
        .pfle-mastery-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px; }
        .pfle-mastery-cell { border-radius:10px; padding:12px; text-align:center; font-size:13px; }
        .pfle-mastery-cell.up { background:rgba(74,222,128,0.14); color:var(--good); }
        .pfle-mastery-cell.down { background:rgba(242,102,95,0.14); color:var(--bad); }
        .pfle-mastery-cell.steady { background:rgba(240,194,75,0.14); color:var(--gold); }
        .pfle-input, .pfle-select { width:100%; padding:9px 12px; border-radius:8px; border:1px solid var(--panel-border); background:rgba(255,255,255,0.04); color:var(--text); font-size:13px; margin-top:4px; }
        .pfle-field { margin-bottom:14px; }
        .pfle-field label { font-size:12px; color:var(--muted); }
        .pfle-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:13px; }
        .pfle-seal { width:44px; height:44px; border-radius:50%; border:2px solid var(--gold); display:flex; align-items:center; justify-content:center; color:var(--gold); flex-shrink:0; }
        .pfle-modal-backdrop { position:relative; background:rgba(0,0,0,0.55); border-radius:16px; padding:32px; display:flex; align-items:center; justify-content:center; min-height:340px; }
        .pfle-modal { background:#150c26; border:1px solid var(--gold); border-radius:16px; padding:24px; max-width:420px; }
        .pfle-status-badge { font-size:11px; padding:4px 10px; border-radius:999px; font-weight:600; }
        .pfle-status-badge.at_risk { background:rgba(240,194,75,0.15); color:var(--gold); }
        .pfle-status-badge.active { background:rgba(139,92,246,0.2); color:#c9b6ff; }
        .pfle-status-badge.ready { background:rgba(74,222,128,0.15); color:var(--good); }
        .pfle-status-badge.fulfilled { background:rgba(74,222,128,0.15); color:var(--good); }
        .pfle-status-badge.broken { background:rgba(242,102,95,0.15); color:var(--bad); }
        .pfle-empty { color:var(--muted); font-size:13px; padding:20px 0; text-align:center; }
      `}</style>

      <div className="pfle-topbar">
        <h1 style={{ fontSize: 22 }}>Parent dashboard</h1>
        <div className="pfle-children">
          {CHILDREN.map((c) => (
            <div
              key={c.id}
              className={`pfle-child-chip ${childId === c.id ? "active" : ""}`}
              onClick={() => setChildId(c.id)}
            >
              <div className="pfle-avatar">{c.initials}</div>
              {c.name}
            </div>
          ))}
        </div>
      </div>

      <div className="pfle-tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`pfle-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div>
          <div className="pfle-grid">
            <div className="pfle-card">
              <div className="pfle-card-label">Weekly progress</div>
              <div className="pfle-card-value">{child.weeklyScore}%</div>
              <ProgressBar value={child.weeklyScore} max={100} />
            </div>
            <div className="pfle-card">
              <div className="pfle-card-label"><Flame size={12} style={{ verticalAlign: -1 }} /> Streak</div>
              <div className="pfle-card-value">{child.streak} days</div>
            </div>
            <div className="pfle-card">
              <div className="pfle-card-label">Active rewards</div>
              <div className="pfle-card-value">{childRewards.length}</div>
            </div>
            <div className="pfle-card">
              <div className="pfle-card-label">Unread alerts</div>
              <div className="pfle-card-value">{childNotifications.filter((n) => n.unread).length}</div>
            </div>
          </div>

          <h3 style={{ fontSize: 15, marginBottom: 10 }}>Reward spotlight</h3>
          {childRewards[0] ? (
            <div className="pfle-card" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{childRewards[0].name}</strong>
                <span className={`pfle-status-badge ${childRewards[0].status}`}>{childRewards[0].status.replace("_", " ")}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0" }}>
                {childRewards[0].progress} of {childRewards[0].target} — {childRewards[0].goal}
              </div>
              <ProgressBar value={childRewards[0].progress} max={childRewards[0].target} />
            </div>
          ) : (
            <div className="pfle-empty">No rewards set up yet. Head to the Rewards tab to create one.</div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="pfle-btn" onClick={() => setTab("rewards")}><Plus size={14} /> Create reward</button>
            <button className="pfle-btn ghost" onClick={() => setTab("progress")}>View analytics <ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {tab === "progress" && (
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Mastery by topic</h3>
          <div className="pfle-mastery-grid" style={{ marginBottom: 22 }}>
            {mastery.map((m) => (
              <div key={m.topic} className={`pfle-mastery-cell ${m.level}`}>{m.topic}</div>
            ))}
          </div>

          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Quiz history</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 0, marginBottom: 10 }}>
            Green is improving, gold is steady, red suggests extra support.
          </p>
          {quizzes.map((q) => (
            <div key={q.id} className="pfle-list-row">
              <div>
                <div style={{ fontSize: 14 }}>{q.subject}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  <Clock size={11} style={{ verticalAlign: -1 }} /> {q.time} · {q.date}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 600 }}>{q.score}%</span>
                <span className={`pfle-pill ${q.trend}`} style={{ color: trendColor(q.trend) }}>{q.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REWARDS */}
      {tab === "rewards" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 15 }}>Rewards</h3>
            <button className="pfle-btn" onClick={startCreateReward}><Plus size={14} /> Create reward</button>
          </div>

          {childRewards.length === 0 && <div className="pfle-empty">No rewards yet for {child.name}.</div>}

          {childRewards.map((r) => (
            <div key={r.id} className="pfle-card" style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
              {r.isPromise && (
                <div className="pfle-seal" title="This reward is a promise">
                  <ShieldCheck size={20} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{r.name}</strong>
                  <span className={`pfle-status-badge ${r.status}`}>{r.status.replace("_", " ")}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0" }}>{r.goal}</div>
                <ProgressBar value={r.progress} max={r.target} />
              </div>
            </div>
          ))}

          {showBuilder && (
            <div className="pfle-card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 14, marginBottom: 14 }}>New reward</h3>
              <div className="pfle-field">
                <label>Reward name</label>
                <input
                  className="pfle-input"
                  placeholder="Skate park afternoon"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="pfle-field">
                <label>Quizzes required to reach the goal</label>
                <input
                  className="pfle-input"
                  type="number"
                  min={1}
                  value={draft.goalCount}
                  onChange={(e) => setDraft({ ...draft, goalCount: Number(e.target.value) })}
                />
              </div>
              <div className="pfle-toggle-row">
                <span>Require my approval before redemption</span>
                <input type="checkbox" checked={draft.requiresApproval} onChange={(e) => setDraft({ ...draft, requiresApproval: e.target.checked })} />
              </div>
              <div className="pfle-toggle-row">
                <span>This is a promise (e.g. a trip or big outing)</span>
                <input type="checkbox" checked={draft.isPromise} onChange={(e) => setDraft({ ...draft, isPromise: e.target.checked })} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button className="pfle-btn gold" onClick={saveReward}>Save reward</button>
                <button className="pfle-btn ghost" onClick={() => setShowBuilder(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NOTIFICATIONS */}
      {tab === "notifications" && (
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Notifications</h3>
          {childNotifications.length === 0 && <div className="pfle-empty">Nothing new for {child.name}.</div>}
          {childNotifications.map((n) => (
            <div key={n.id} className="pfle-list-row">
              <div>
                <div style={{ fontSize: 14, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{n.time}</div>
              </div>
              {n.unread ? (
                <button className="pfle-btn ghost" onClick={() => markNotificationRead(n.id)}>Mark read</button>
              ) : (
                <Check size={16} color="var(--good)" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROMISE LOG */}
      {tab === "promises" && (
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Promise log</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 0, marginBottom: 14 }}>
            Every promise-type reward you've acknowledged, with its follow-through status.
          </p>
          {promiseRewards.length === 0 && <div className="pfle-empty">No promises made yet.</div>}
          {promiseRewards.map((r) => (
            <div key={r.id} className="pfle-card" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{r.name}</strong>
                <span className={`pfle-status-badge ${r.status}`}>{r.status.replace("_", " ")}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0" }}>
                Acknowledged {r.ackAt} · {r.goal}
              </div>
              {r.status === "at_risk" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button className="pfle-btn gold" onClick={() => updatePromiseStatus(r.id, "fulfilled")}>Mark fulfilled</button>
                  <button className="pfle-btn ghost" onClick={() => updatePromiseStatus(r.id, "broken")}>Mark not kept</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROMISE ACKNOWLEDGEMENT MODAL */}
      {pendingAck && (
        <div className="pfle-modal-backdrop" style={{ position: "absolute", inset: 0, zIndex: 10 }}>
          <div className="pfle-modal">
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <AlertTriangle size={22} color="var(--gold)" />
              <h3 style={{ fontSize: 16 }}>Before you set this promise</h3>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Your child will see <strong style={{ color: "var(--text)" }}>{pendingAck.name}</strong> as a promise,
              not just a goal. If they hit the target and you don't follow through, it can hurt their trust in you.
            </p>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, margin: "16px 0" }}>
              <input type="checkbox" checked={ackChecked} onChange={(e) => setAckChecked(e.target.checked)} style={{ marginTop: 3 }} />
              I understand, and I'm ready to follow through if my child meets this goal.
            </label>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>This confirmation is saved in your parent log, not shown to your child.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="pfle-btn gold" disabled={!ackChecked} style={{ opacity: ackChecked ? 1 : 0.5 }} onClick={confirmPromise}>
                Confirm reward
              </button>
              <button className="pfle-btn ghost" onClick={() => setPendingAck(null)}>Go back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
