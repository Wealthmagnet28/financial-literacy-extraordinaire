import { useState, useEffect, useRef } from "react";

// --- Mock Data ---
const WEEK_DATA = [
  { day: "Mon", spent: 42, budget: 60, label: "good", note: "Stayed focused — groceries only." },
  { day: "Tue", spent: 18, budget: 60, label: "good", note: "Minimal spending, solid discipline." },
  { day: "Wed", spent: 87, budget: 60, label: "bad", note: "Impulse purchase at electronics store." },
  { day: "Thu", spent: 35, budget: 60, label: "good", note: "Meal prepped and skipped takeout." },
  { day: "Fri", spent: 55, budget: 60, label: "warning", note: "Close to limit — dining out added up." },
  { day: "Sat", spent: 110, budget: 60, label: "bad", note: "Weekend outing went over plan." },
  { day: "Sun", spent: 22, budget: 60, label: "good", note: "Recovery day. Smart reset." },
];

const GOALS = [
  { id: 1, name: "Emergency Fund", current: 2400, target: 5000, icon: "🛡️" },
  { id: 2, name: "New Laptop", current: 680, target: 1200, icon: "💻" },
  { id: 3, name: "Vacation Fund", current: 350, target: 2000, icon: "✈️" },
];

const FLOW_DATA = {
  income: 3200,
  spent: 2180,
  saved: 420,
  topCategories: [
    { name: "Housing", amount: 950, pct: 43.6 },
    { name: "Food & Dining", amount: 480, pct: 22.0 },
    { name: "Transport", amount: 310, pct: 14.2 },
    { name: "Shopping", amount: 240, pct: 11.0 },
    { name: "Subscriptions", amount: 120, pct: 5.5 },
    { name: "Other", amount: 80, pct: 3.7 },
  ],
};

const COACH_MESSAGES = [
  {
    id: 1,
    date: "Today",
    type: "daily",
    text: "You had 4 good spending days out of 7 this week. Wednesday's electronics purchase was the biggest outlier — consider a 24-hour rule for non-essential buys over $50. Your savings goal moved forward by $85. That's real progress.",
  },
  {
    id: 2,
    date: "Yesterday",
    type: "motivation",
    text: "You're on a 3-day streak of staying under budget. That takes discipline. Keep this pace and your Emergency Fund hits 50% by end of month.",
  },
  {
    id: 3,
    date: "2 days ago",
    type: "alert",
    text: "Your dining category is 15% higher than last week. Two unplanned restaurant visits pushed the total. Meal prepping Thursday helped pull it back — more of that.",
  },
  {
    id: 4,
    date: "4 days ago",
    type: "daily",
    text: "Weekly summary: Income exceeded spending by $1,020. That surplus went partially to savings ($420) and the rest stayed in checking. Consider routing more toward your goals automatically.",
  },
];

const ALERTS = [
  { id: 1, type: "warning", text: "Subscription renewal: Spotify ($10.99) charges tomorrow.", active: true },
  { id: 2, type: "info", text: "You've saved $85 more this month than last month at this point.", active: true },
  { id: 3, type: "danger", text: "Dining budget is 92% used with 8 days left.", active: true },
];

const ACTIONS = [
  { id: 1, label: "Move $50 to savings", icon: "💰", done: false },
  { id: 2, label: "Review subscriptions", icon: "🔍", done: false },
  { id: 3, label: "Set tomorrow's spending cap", icon: "🎯", done: false },
  { id: 4, label: "Check upcoming bills", icon: "📋", done: true },
];

// --- Animated Starfield Background ---
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
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const a = s.alpha + Math.sin(t * 0.001 + s.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${Math.max(0, a)})`;
        ctx.fill();
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

// --- Glassmorphism Card ---
function GlassCard({ children, style, className, glow, onClick }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: "rgba(18, 10, 32, 0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(160, 120, 255, 0.15)",
        borderRadius: 16,
        padding: "24px",
        boxShadow: glow
          ? `0 0 30px rgba(160, 100, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// --- Progress Bar ---
function ProgressBar({ current, target, color = "#b47aff", height = 8 }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: height, height, width: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: height,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

// --- Day Label Pill ---
function DayLabel({ label }) {
  const config = {
    good: { bg: "rgba(74, 222, 128, 0.15)", border: "rgba(74, 222, 128, 0.4)", color: "#4ade80", text: "Good Day" },
    warning: { bg: "rgba(250, 204, 21, 0.15)", border: "rgba(250, 204, 21, 0.4)", color: "#facc15", text: "Watch It" },
    bad: { bg: "rgba(248, 113, 113, 0.15)", border: "rgba(248, 113, 113, 0.4)", color: "#f87171", text: "Over Budget" },
  };
  const c = config[label];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
      }}
    >
      {c.text}
    </span>
  );
}

// --- Spending Bar Chart ---
function SpendingChart({ data }) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.spent, d.budget)));
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140 }}>
      {data.map((d) => {
        const h = (d.spent / maxVal) * 110;
        const budgetH = (d.budget / maxVal) * 110;
        const colors = { good: "#4ade80", warning: "#facc15", bad: "#f87171" };
        return (
          <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, color: colors[d.label], fontWeight: 600 }}>${d.spent}</span>
            <div style={{ position: "relative", width: "100%", height: 115 }}>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "15%",
                  width: "70%",
                  height: budgetH,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px dashed rgba(255,255,255,0.12)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "20%",
                  width: "60%",
                  height: h,
                  borderRadius: 6,
                  background: `linear-gradient(180deg, ${colors[d.label]}, ${colors[d.label]}44)`,
                  transition: "height 0.5s ease",
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// --- Category Flow Bar ---
function CategoryBar({ categories }) {
  const colors = ["#b47aff", "#f59e0b", "#4ade80", "#f87171", "#38bdf8", "#a78bfa"];
  return (
    <div>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 14, marginBottom: 14 }}>
        {categories.map((c, i) => (
          <div key={c.name} style={{ width: `${c.pct}%`, background: colors[i % colors.length], transition: "width 0.5s" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
        {categories.map((c, i) => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>${c.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main App ---
export default function AIMoneyCoach() {
  const [activeTab, setActiveTab] = useState("coach");
  const [selectedDay, setSelectedDay] = useState(null);
  const [actions, setActions] = useState(ACTIONS);
  const [expandedMsg, setExpandedMsg] = useState(null);

  const toggleAction = (id) => setActions((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));

  const todayLabel = "good";
  const streak = 3;
  const weekSpent = WEEK_DATA.reduce((s, d) => s + d.spent, 0);
  const goodDays = WEEK_DATA.filter((d) => d.label === "good").length;

  const msgTypeConfig = {
    daily: { icon: "📊", accent: "#b47aff", label: "Daily Insight" },
    motivation: { icon: "🔥", accent: "#f59e0b", label: "Motivation" },
    alert: { icon: "⚡", accent: "#f87171", label: "Alert" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a0514 0%, #110a24 40%, #0d0820 100%)", color: "#fff", fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
      <Starfield />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* ===== HEADER ===== */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#b47aff", textTransform: "uppercase", marginBottom: 8 }}>
            Club FLE
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #e0c3ff, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI Money Coach
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, maxWidth: 420, marginInline: "auto" }}>
            Your personal guide for smarter spending and better money habits.
          </p>
        </div>

        {/* ===== QUICK STATS ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "This Week", value: `$${weekSpent}`, sub: "of $420 budget", color: weekSpent > 420 ? "#f87171" : "#4ade80" },
            { label: "Savings Move", value: `+$${FLOW_DATA.saved}`, sub: "this month", color: "#f59e0b" },
            { label: "Coach Streak", value: `${streak} days`, sub: `${goodDays}/7 good days`, color: "#b47aff" },
          ].map((s) => (
            <GlassCard key={s.label} style={{ padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.sub}</div>
            </GlassCard>
          ))}
        </div>

        {/* ===== TAB NAV ===== */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
          {[
            { id: "coach", label: "Coach" },
            { id: "flow", label: "Money Flow" },
            { id: "days", label: "Spending Days" },
            { id: "organize", label: "Organize" },
            { id: "history", label: "History" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.2s",
                background: activeTab === t.id ? "rgba(180, 122, 255, 0.2)" : "transparent",
                color: activeTab === t.id ? "#d4b4ff" : "rgba(255,255,255,0.4)",
                boxShadow: activeTab === t.id ? "0 0 12px rgba(180, 122, 255, 0.1)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== COACH TAB ===== */}
        {activeTab === "coach" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Today's Coach Message */}
            <GlassCard glow>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #b47aff, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🧠</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>Today's Coaching</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Based on your last 7 days</div>
                </div>
                <div style={{ marginLeft: "auto" }}><DayLabel label={todayLabel} /></div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", margin: 0 }}>
                {COACH_MESSAGES[0].text}
              </p>
            </GlassCard>

            {/* Motivation */}
            <GlassCard>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>🔥</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>Motivation</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.15)" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                    You're on a <strong style={{ color: "#fbbf24" }}>3-day streak</strong> of good spending days. That's your longest this month.
                  </p>
                </div>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                    Emergency Fund is <strong style={{ color: "#4ade80" }}>48% complete</strong>. At this pace, you'll reach 50% by month-end.
                  </p>
                </div>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(180, 122, 255, 0.08)", border: "1px solid rgba(180, 122, 255, 0.15)" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                    You spent <strong style={{ color: "#b47aff" }}>$85 less on dining</strong> this week compared to last. That discipline is adding up.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Action Steps */}
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Next Steps</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {actions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => toggleAction(a.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: a.done ? "rgba(74, 222, 128, 0.25)" : "rgba(255,255,255,0.08)",
                      background: a.done ? "rgba(74, 222, 128, 0.06)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: `2px solid ${a.done ? "#4ade80" : "rgba(255,255,255,0.2)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#4ade80",
                        background: a.done ? "rgba(74, 222, 128, 0.15)" : "transparent",
                        flexShrink: 0,
                      }}
                    >
                      {a.done ? "✓" : ""}
                    </div>
                    <span style={{ fontSize: 13, color: a.done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.8)", textDecoration: a.done ? "line-through" : "none", fontWeight: 500 }}>
                      {a.icon} {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===== MONEY FLOW TAB ===== */}
        {activeTab === "flow" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Money In", value: `$${FLOW_DATA.income.toLocaleString()}`, color: "#4ade80", icon: "↓" },
                { label: "Money Out", value: `$${FLOW_DATA.spent.toLocaleString()}`, color: "#f87171", icon: "↑" },
                { label: "Net Saved", value: `+$${(FLOW_DATA.income - FLOW_DATA.spent).toLocaleString()}`, color: "#f59e0b", icon: "★" },
              ].map((s) => (
                <GlassCard key={s.label} style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4, opacity: 0.6 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
                </GlassCard>
              ))}
            </div>

            {/* Category Breakdown */}
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 16 }}>Where Your Money Went</div>
              <CategoryBar categories={FLOW_DATA.topCategories} />
            </GlassCard>

            {/* Coach Note on Flow */}
            <GlassCard style={{ borderLeft: "3px solid #b47aff" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#d4b4ff", marginBottom: 6 }}>Coach's Take</div>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                    More money came in than went out this month — that's the foundation. Your Housing and Food together account for 66% of spending, which is typical. The area to watch is Shopping at $240 — that's where most of the impulse spending landed. Subscriptions at $120/month adds up to $1,440/year. Worth a review.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===== SPENDING DAYS TAB ===== */}
        {activeTab === "days" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 16 }}>This Week at a Glance</div>
              <SpendingChart data={WEEK_DATA} />
              <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#4ade80", marginRight: 4, verticalAlign: "middle" }} /> Good
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#facc15", marginRight: 4, verticalAlign: "middle" }} /> Watch
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#f87171", marginRight: 4, verticalAlign: "middle" }} /> Over
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, border: "1px dashed rgba(255,255,255,0.2)", marginRight: 4, verticalAlign: "middle" }} /> Budget
                </span>
              </div>
            </GlassCard>

            {/* Day-by-day breakdown */}
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Day by Day</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {WEEK_DATA.map((d, i) => (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDay(selectedDay === i ? null : i)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: `1px solid ${selectedDay === i ? "rgba(180, 122, 255, 0.3)" : "rgba(255,255,255,0.06)"}`,
                      background: selectedDay === i ? "rgba(180, 122, 255, 0.06)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", width: 36 }}>{d.day}</span>
                      <DayLabel label={d.label} />
                      <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 700, color: d.label === "bad" ? "#f87171" : d.label === "warning" ? "#facc15" : "#4ade80" }}>
                        ${d.spent}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>/ ${d.budget}</span>
                    </div>
                    {selectedDay === i && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                          🧠 {d.note}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===== ORGANIZE TAB ===== */}
        {activeTab === "organize" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Goals */}
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 16 }}>Goals</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {GOALS.map((g) => (
                  <div key={g.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{g.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", flex: 1 }}>{g.name}</span>
                      <span style={{ fontSize: 12, color: "#b47aff", fontWeight: 700 }}>
                        ${g.current.toLocaleString()} / ${g.target.toLocaleString()}
                      </span>
                    </div>
                    <ProgressBar current={g.current} target={g.target} color={g.current / g.target > 0.5 ? "#4ade80" : "#b47aff"} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                      {Math.round((g.current / g.target) * 100)}% complete · ${(g.target - g.current).toLocaleString()} to go
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Alerts */}
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Alerts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ALERTS.map((a) => {
                  const alertColors = {
                    warning: { bg: "rgba(250, 204, 21, 0.08)", border: "rgba(250, 204, 21, 0.2)", icon: "⚠️" },
                    info: { bg: "rgba(56, 189, 248, 0.08)", border: "rgba(56, 189, 248, 0.2)", icon: "ℹ️" },
                    danger: { bg: "rgba(248, 113, 113, 0.08)", border: "rgba(248, 113, 113, 0.2)", icon: "🚨" },
                  };
                  const ac = alertColors[a.type];
                  return (
                    <div key={a.id} style={{ padding: "12px 16px", borderRadius: 10, background: ac.bg, border: `1px solid ${ac.border}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 14 }}>{ac.icon}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{a.text}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Budget Notes / Reminders */}
            <GlassCard>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Reminders & Notes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "📅", text: "Car insurance due July 15 — $180" },
                  { icon: "📝", text: "Cancel gym trial before July 20" },
                  { icon: "💡", text: "Research high-yield savings accounts this weekend" },
                  { icon: "🎯", text: "Set August vacation budget before booking anything" },
                ].map((n, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 14 }}>{n.icon}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{n.text}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 4 }}>Coaching History</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 8px" }}>
              Every message your coach has sent, so you can track progress over time.
            </p>
            {COACH_MESSAGES.map((m) => {
              const cfg = msgTypeConfig[m.type];
              return (
                <GlassCard
                  key={m.id}
                  onClick={() => setExpandedMsg(expandedMsg === m.id ? null : m.id)}
                  style={{ cursor: "pointer", borderLeft: `3px solid ${cfg.accent}` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: cfg.accent }}>{cfg.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{m.date}</div>
                    </div>
                    <span style={{ fontSize: 16, color: "rgba(255,255,255,0.2)", transform: expandedMsg === m.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </div>
                  {expandedMsg === m.id && (
                    <p style={{ margin: "12px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                      {m.text}
                    </p>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            Club FLE · Financial Literacy Extraordinaire
          </div>
        </div>
      </div>
    </div>
  );
}
