import { useState, useEffect, useRef, useMemo } from "react";

// ─── MOCK DATA ───
const EXISTING_GOALS = [
  {
    id: 1, type: "budget", label: "Weekly Spending", target: 300, current: 218,
    period: "weekly", unit: "$", direction: "under",
    history: [280, 310, 265, 295, 218], // last 5 weeks
    streak: 3, bestStreak: 5, created: "May 12",
  },
  {
    id: 2, type: "income", label: "Weekly Earnings", target: 800, current: 600,
    period: "weekly", unit: "$", direction: "over",
    history: [720, 680, 810, 750, 600],
    streak: 0, bestStreak: 2, created: "Apr 28",
  },
  {
    id: 3, type: "savings", label: "Emergency Fund", target: 5000, current: 2400,
    period: "yearly", unit: "$", direction: "over",
    history: [1800, 1950, 2100, 2250, 2400],
    streak: 5, bestStreak: 5, created: "Jan 3",
  },
];

const BADGES = [
  { id: 1, icon: "🛡️", name: "Budget Win", desc: "Stayed under budget for a full week", earned: true, date: "Jun 22" },
  { id: 2, icon: "🔥", name: "Savings Streak", desc: "Added to savings 5 weeks in a row", earned: true, date: "Jul 1" },
  { id: 3, icon: "💰", name: "Income Goal Met", desc: "Hit your weekly earnings target", earned: true, date: "Jun 15" },
  { id: 4, icon: "📈", name: "Investing Momentum", desc: "Maintained consistent investment contributions", earned: false, date: null },
  { id: 5, icon: "⭐", name: "First Goal Set", desc: "Created your very first money goal", earned: true, date: "Jan 3" },
  { id: 6, icon: "🏆", name: "Monthly Champion", desc: "Hit all goals in a single month", earned: false, date: null },
];

const COMPLETED_GOALS = [
  { label: "Save $1,000 starter fund", completed: "Mar 15", type: "savings" },
  { label: "Stay under $250/week for a month", completed: "May 30", type: "budget" },
  { label: "Earn $3,000 in one month", completed: "Apr 30", type: "income" },
];

// ─── STARFIELD ───
function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let stars = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3, speed: Math.random() * 0.3 + 0.08,
        alpha: Math.random() * 0.5 + 0.2, pulse: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const a = s.alpha + Math.sin(t * 0.001 + s.pulse) * 0.12;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${Math.max(0, a)})`; ctx.fill();
        s.y -= s.speed;
        if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

// ─── GLASS CARD ───
function Glass({ children, style, glow, onClick, accent }) {
  return (
    <div onClick={onClick} style={{
      background: "rgba(18, 10, 32, 0.65)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      border: `1px solid ${accent ? `${accent}33` : "rgba(160, 120, 255, 0.15)"}`,
      borderRadius: 16, padding: 24,
      boxShadow: glow ? `0 0 30px rgba(160, 100, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.04)` : `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
      transition: "transform 0.2s, box-shadow 0.2s", cursor: onClick ? "pointer" : "default", ...style,
    }}>
      {children}
    </div>
  );
}

// ─── PROGRESS BAR ───
function Bar({ pct, color = "#b47aff", height = 8, showPct = false }) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: height, height, overflow: "hidden" }}>
        <div style={{ width: `${clamped}%`, height: "100%", borderRadius: height, background: `linear-gradient(90deg, ${color}, ${color}88)`, transition: "width 0.8s ease" }} />
      </div>
      {showPct && <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 36, textAlign: "right" }}>{Math.round(clamped)}%</span>}
    </div>
  );
}

// ─── MINI SPARKLINE ───
function Sparkline({ data, color = "#b47aff", width = 100, height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(points.split(" ").pop().split(",")[0])} cy={parseFloat(points.split(" ").pop().split(",")[1])} r="3" fill={color} />
    </svg>
  );
}

// ─── COMPOUND INTEREST CALCULATOR ───
function CompoundPreviewer() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState("monthly");

  const freqMap = { daily: 365, weekly: 52, monthly: 12, yearly: 1 };
  const n = freqMap[freq];

  const projections = useMemo(() => {
    const results = [];
    for (let y = 0; y <= years; y++) {
      const amount = principal * Math.pow(1 + (rate / 100) / n, n * y);
      results.push({ year: y, amount: Math.round(amount) });
    }
    return results;
  }, [principal, rate, years, freq, n]);

  const finalAmount = projections[projections.length - 1]?.amount || principal;
  const totalGrowth = finalAmount - principal;
  const maxAmount = Math.max(...projections.map(p => p.amount));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Starting amount", value: principal, set: setPrincipal, prefix: "$", min: 100, max: 100000, step: 100 },
          { label: "Annual rate", value: rate, set: setRate, prefix: "", suffix: "%", min: 1, max: 30, step: 0.5 },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600 }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px" }}>
              {f.prefix && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>{f.prefix}</span>}
              <input type="number" value={f.value} onChange={e => f.set(Number(e.target.value))} min={f.min} max={f.max} step={f.step}
                style={{ background: "none", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, width: "100%", outline: "none", fontFamily: "inherit" }} />
              {f.suffix && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>{f.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600 }}>Time horizon: {years} years</div>
        <input type="range" min={1} max={30} value={years} onChange={e => setYears(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#b47aff" }} />
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {Object.keys(freqMap).map(f => (
          <button key={f} onClick={() => setFreq(f)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
            background: freq === f ? "rgba(180, 122, 255, 0.2)" : "rgba(255,255,255,0.03)",
            color: freq === f ? "#d4b4ff" : "rgba(255,255,255,0.35)",
            transition: "all 0.2s",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 120 }}>
        {projections.map((p, i) => {
          const h = (p.amount / maxAmount) * 100;
          const isLast = i === projections.length - 1;
          return (
            <div key={p.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{
                width: "100%", height: h, borderRadius: 3, minHeight: 3,
                background: isLast
                  ? "linear-gradient(180deg, #f59e0b, #f59e0b66)"
                  : `linear-gradient(180deg, rgba(180,122,255,${0.3 + (i / projections.length) * 0.7}), rgba(180,122,255,0.1))`,
                transition: "height 0.4s",
              }} />
              {(i === 0 || isLast || i === Math.floor(projections.length / 2)) && (
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Y{p.year}</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ padding: 14, borderRadius: 10, background: "rgba(180, 122, 255, 0.08)", border: "1px solid rgba(180, 122, 255, 0.15)", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#d4b4ff" }}>${finalAmount.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Final value</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>+${totalGrowth.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Total growth</div>
        </div>
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.02)", borderLeft: "3px solid #f59e0b" }}>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          The longer you stay consistent, the more compounding works in your favor. Even small differences in frequency add up over time.
        </p>
      </div>
    </div>
  );
}

// ─── GOAL CARD ───
function GoalCard({ goal }) {
  const [expanded, setExpanded] = useState(false);
  const pct = goal.direction === "under"
    ? Math.max(0, ((goal.target - goal.current) / goal.target) * 100)
    : (goal.current / goal.target) * 100;

  const isOnTrack = goal.direction === "under" ? goal.current <= goal.target : goal.current >= goal.target;
  const gap = goal.direction === "under" ? goal.current - goal.target : goal.target - goal.current;

  const typeConfig = {
    budget: { icon: "🎯", color: "#4ade80", accentColor: isOnTrack ? "#4ade80" : "#facc15" },
    income: { icon: "💵", color: "#f59e0b", accentColor: isOnTrack ? "#4ade80" : "#facc15" },
    savings: { icon: "🛡️", color: "#b47aff", accentColor: "#b47aff" },
  };
  const cfg = typeConfig[goal.type] || typeConfig.savings;

  const getMessage = () => {
    if (isOnTrack && goal.type === "budget") return "You're within your budget — keep going.";
    if (isOnTrack && goal.type === "income") return `Nice progress — you've earned $${goal.current} of your $${goal.target} goal.`;
    if (isOnTrack && goal.type === "savings") return "Steady momentum. Long-term growth is still moving forward.";
    if (goal.type === "budget") return `You're $${Math.abs(gap)} over this ${goal.period}'s target. That's okay — small adjustments still count.`;
    if (goal.type === "income") return `You're $${Math.abs(gap)} away from this ${goal.period}'s target. That's okay — small steps still count.`;
    return `You're $${Math.abs(gap).toLocaleString()} away. Your past progress stays earned.`;
  };

  const periodMsg = {
    daily: "Today's progress is helping your bigger goal.",
    weekly: "This week is shaping up well.",
    monthly: "You're building steady momentum.",
    yearly: "Long-term growth is still moving forward.",
  };

  return (
    <Glass onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer" }} accent={cfg.accentColor}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${cfg.color}15`, border: `1px solid ${cfg.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {cfg.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{goal.label}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{goal.period} · since {goal.created}</div>
        </div>
        <Sparkline data={goal.history} color={cfg.accentColor} width={70} height={28} />
      </div>

      <Bar pct={pct} color={cfg.accentColor} showPct />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {goal.direction === "under" ? `$${goal.current} spent` : `$${goal.current.toLocaleString()} earned`} of ${goal.target.toLocaleString()} target
        </span>
        {goal.streak > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b" }}>🔥 {goal.streak} week streak</span>
        )}
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "10px 14px", borderRadius: 10, background: isOnTrack ? "rgba(74, 222, 128, 0.06)" : "rgba(250, 204, 21, 0.06)", border: `1px solid ${isOnTrack ? "rgba(74, 222, 128, 0.15)" : "rgba(250, 204, 21, 0.15)"}` }}>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              {getMessage()}
            </p>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
            {periodMsg[goal.period]} {goal.bestStreak > 0 && `Your best streak is ${goal.bestStreak} weeks.`}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(180, 122, 255, 0.25)", background: "rgba(180, 122, 255, 0.08)", color: "#d4b4ff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Adjust goal
            </button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              View details
            </button>
          </div>
        </div>
      )}
    </Glass>
  );
}

// ─── GOAL CREATOR ───
function GoalCreator({ onClose }) {
  const [type, setType] = useState("budget");
  const [period, setPeriod] = useState("weekly");
  const [amount, setAmount] = useState("");

  const hints = {
    budget: `Example: "I want to stay under $300 this week."`,
    income: `Example: "I want to earn $800 this week."`,
    savings: `Example: "I want to save $5,000 this year."`,
  };
  const typeLabels = { budget: "🎯 Budget", income: "💵 Income", savings: "🛡️ Savings" };

  return (
    <Glass glow style={{ border: "1px solid rgba(180, 122, 255, 0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e0c3ff" }}>Set a new goal</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Choose a target for spending, income, or saving.</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 20, cursor: "pointer", padding: 4 }}>✕</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6 }}>Goal type</div>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(typeLabels).map(([k, v]) => (
            <button key={k} onClick={() => setType(k)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: type === k ? "rgba(180, 122, 255, 0.2)" : "rgba(255,255,255,0.03)",
              color: type === k ? "#d4b4ff" : "rgba(255,255,255,0.35)", transition: "all 0.2s",
            }}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6 }}>Period</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["daily", "weekly", "monthly", "yearly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
              background: period === p ? "rgba(245, 158, 11, 0.15)" : "rgba(255,255,255,0.03)",
              color: period === p ? "#fbbf24" : "rgba(255,255,255,0.35)", transition: "all 0.2s",
            }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6 }}>Target amount</div>
        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, marginRight: 6 }}>$</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
            style={{ background: "none", border: "none", color: "#fff", fontSize: 18, fontWeight: 700, width: "100%", outline: "none", fontFamily: "inherit" }} />
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6, fontStyle: "italic" }}>{hints[type]}</div>
      </div>

      <button style={{
        width: "100%", padding: 14, borderRadius: 12, border: "none", cursor: "pointer",
        background: "linear-gradient(135deg, #b47aff, #f59e0b)", color: "#fff",
        fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
      }}>
        Create goal
      </button>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 8 }}>
        You can always change your target later as your schedule or income changes.
      </div>
    </Glass>
  );
}

// ─── MAIN APP ───
export default function GoalsAndRewards() {
  const [tab, setTab] = useState("goals");
  const [showCreator, setShowCreator] = useState(false);
  const [expandedBadge, setExpandedBadge] = useState(null);

  const earnedCount = BADGES.filter(b => b.earned).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0514 0%, #110a24 40%, #0d0820 100%)",
      color: "#fff",
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <Starfield />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* ═══ HEADER ═══ */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#b47aff", textTransform: "uppercase", marginBottom: 8 }}>Club FLE</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #e0c3ff, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Goals & Rewards
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 4px", maxWidth: 460, marginInline: "auto", lineHeight: 1.6 }}>
            Progress that feels good
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0, maxWidth: 440, marginInline: "auto", lineHeight: 1.6 }}>
            Set goals for your budget, income, and investments, then watch your progress build one step at a time.
          </p>
        </div>

        {/* ═══ QUICK STATS ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "24px 0" }}>
          {[
            { label: "Active Goals", value: EXISTING_GOALS.length, color: "#b47aff", sub: `${COMPLETED_GOALS.length} completed` },
            { label: "Best Streak", value: "5 wks", color: "#f59e0b", sub: "savings consistency" },
            { label: "Badges Earned", value: `${earnedCount}/${BADGES.length}`, color: "#4ade80", sub: "keep going" },
          ].map(s => (
            <Glass key={s.label} style={{ padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{s.sub}</div>
            </Glass>
          ))}
        </div>

        {/* ═══ TAB NAV ═══ */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
          {[
            { id: "goals", label: "My Goals" },
            { id: "rewards", label: "Rewards" },
            { id: "compound", label: "Grow Capital" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: tab === t.id ? "rgba(180, 122, 255, 0.2)" : "transparent",
              color: tab === t.id ? "#d4b4ff" : "rgba(255,255,255,0.4)",
              boxShadow: tab === t.id ? "0 0 12px rgba(180, 122, 255, 0.1)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ═══ GOALS TAB ═══ */}
        {tab === "goals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Intro */}
            <Glass style={{ borderLeft: "3px solid #b47aff" }}>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Your goals don't have to feel like an uphill battle. This tab turns big money targets into small, manageable steps so you can see what you've earned, what you're building, and what's still ahead — without pressure or judgment.
              </p>
            </Glass>

            {/* Active Goals */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>Active Goals</div>
              <button onClick={() => setShowCreator(!showCreator)} style={{
                padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(180, 122, 255, 0.3)",
                background: "rgba(180, 122, 255, 0.1)", color: "#d4b4ff", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                {showCreator ? "Cancel" : "+ New goal"}
              </button>
            </div>

            {showCreator && <GoalCreator onClose={() => setShowCreator(false)} />}

            {EXISTING_GOALS.map(g => <GoalCard key={g.id} goal={g} />)}

            {/* How it works */}
            <Glass>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>How goal tracking works</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "📐", title: "Smart breakdowns", desc: "Pick a yearly or weekly target and we create daily micro-goals so progress feels doable." },
                  { icon: "🔄", title: "Flexible pacing", desc: "If your earnings vary week to week, the app highlights the gap, encourages small wins, and offers adjustment options — never shame." },
                  { icon: "📊", title: "Persistent progress", desc: "A tough day doesn't erase your wins. Past goals stay earned and your progress stays visible." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 18, marginTop: 1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Glass>

            {/* Completed Goals */}
            <Glass>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 4 }}>Completed Goals</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Completed goals are saved, not forgotten.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {COMPLETED_GOALS.map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(74, 222, 128, 0.04)", border: "1px solid rgba(74, 222, 128, 0.1)" }}>
                    <span style={{ fontSize: 16, color: "#4ade80" }}>✓</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{g.label}</div>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{g.completed}</span>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        )}

        {/* ═══ REWARDS TAB ═══ */}
        {tab === "rewards" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Glass style={{ borderLeft: "3px solid #f59e0b" }}>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Celebrate the goals you complete and the habits that got you there. Badges and streaks remain visible even after missed days — your wins are never erased.
              </p>
            </Glass>

            {/* Badge Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {BADGES.map(b => (
                <Glass key={b.id} onClick={() => setExpandedBadge(expandedBadge === b.id ? null : b.id)}
                  style={{
                    padding: 16, textAlign: "center", cursor: "pointer",
                    opacity: b.earned ? 1 : 0.4,
                    border: b.earned ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(255,255,255,0.06)",
                  }}>
                  <div style={{ fontSize: 32, marginBottom: 8, filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: b.earned ? "#fbbf24" : "rgba(255,255,255,0.4)", marginBottom: 4 }}>{b.name}</div>
                  {expandedBadge === b.id && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{b.desc}</div>
                      {b.earned && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Earned {b.date}</div>}
                      {!b.earned && <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4 }}>Keep going — you're close</div>}
                    </div>
                  )}
                </Glass>
              ))}
            </div>

            {/* Motivation Messages */}
            <Glass>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>🔥</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>Your Momentum</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { msg: "You earned 3 badges this quarter. Your consistency is building real momentum.", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.06)" },
                  { msg: "Your 5-week savings streak is your personal best. Goal unlocked — your progress is part of your story.", color: "#4ade80", bg: "rgba(74, 222, 128, 0.06)" },
                  { msg: "Two more badges to go. Investing Momentum and Monthly Champion are within reach if you keep this pace.", color: "#b47aff", bg: "rgba(180, 122, 255, 0.06)" },
                ].map((m, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: m.bg, border: `1px solid ${m.color}22` }}>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{m.msg}</p>
                  </div>
                ))}
              </div>
            </Glass>

            {/* Nudge */}
            <Glass style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e0c3ff", marginBottom: 6 }}>Want a smaller next step?</div>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Try adjusting your weekly target or breaking it into smaller daily goals. This app is here to support you, not pressure you.
              </p>
              <button style={{
                padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #b47aff, #f59e0b)", color: "#fff",
                fontSize: 13, fontWeight: 700,
              }}>
                Adjust my goals
              </button>
            </Glass>
          </div>
        )}

        {/* ═══ COMPOUND TAB ═══ */}
        {tab === "compound" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Glass style={{ borderLeft: "3px solid #f59e0b" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", marginBottom: 6 }}>Grow your capital</div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                See how your money can build over time through compounding. Adjust the numbers below to explore how starting amount, rate, time, and compounding frequency change your outcome.
              </p>
            </Glass>

            <Glass glow>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 16 }}>Compound Interest Previewer</div>
              <CompoundPreviewer />
            </Glass>

            {/* Compounding Frequency Explainer */}
            <Glass>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>How frequency matters</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { freq: "Daily", desc: "Small growth added each day. Adds up fastest over long periods.", icon: "📅" },
                  { freq: "Weekly", desc: "Growth measured week by week. Visible progress at a steady pace.", icon: "📆" },
                  { freq: "Monthly", desc: "Steady progress over time. The most common compounding period.", icon: "🗓️" },
                  { freq: "Yearly", desc: "Long-term gains that build on themselves. Simplest to understand.", icon: "📊" },
                ].map(f => (
                  <div key={f.freq} style={{ padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{f.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{f.freq}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </Glass>

            {/* Investment Goal CTA */}
            <Glass style={{ textAlign: "center", padding: 20, border: "1px solid rgba(245, 158, 11, 0.15)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fbbf24", marginBottom: 6 }}>Ready to set an investment goal?</div>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Turn these projections into a real target. Track your contributions and watch compounding do the heavy lifting.
              </p>
              <button style={{
                padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #f59e0b, #b47aff)", color: "#fff",
                fontSize: 13, fontWeight: 700,
              }}>
                Create investment goal
              </button>
            </Glass>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            Club FLE · Financial Literacy Extraordinaire
          </div>
        </div>
      </div>
    </div>
  );
}
