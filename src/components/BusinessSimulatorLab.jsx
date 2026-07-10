import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════
// DATA: 30 BUSINESSES
// ═══════════════════════════════════════════════
const BUSINESSES = [
  { id: 1, name: "Used Car Dealership", icon: "🚗", cat: "auto", startup: "$50K–$150K", margin: "15–25%", difficulty: 3 },
  { id: 2, name: "New Car Dealership", icon: "🏎️", cat: "auto", startup: "$200K–$500K", margin: "8–15%", difficulty: 5 },
  { id: 3, name: "Clothing Store", icon: "👕", cat: "fashion", startup: "$20K–$80K", margin: "40–60%", difficulty: 3 },
  { id: 4, name: "Sneaker Store", icon: "👟", cat: "fashion", startup: "$30K–$100K", margin: "30–50%", difficulty: 3 },
  { id: 5, name: "Vending Machine Business", icon: "🎰", cat: "passive", startup: "$5K–$20K", margin: "40–60%", difficulty: 1 },
  { id: 6, name: "Coffee Shop", icon: "☕", cat: "food", startup: "$25K–$100K", margin: "60–80%", difficulty: 3 },
  { id: 7, name: "Fast Food Restaurant", icon: "🍔", cat: "food", startup: "$100K–$500K", margin: "10–20%", difficulty: 4 },
  { id: 8, name: "Food Truck", icon: "🚚", cat: "food", startup: "$15K–$50K", margin: "25–40%", difficulty: 2 },
  { id: 9, name: "Convenience Store", icon: "🏪", cat: "retail", startup: "$40K–$150K", margin: "20–35%", difficulty: 3 },
  { id: 10, name: "Auto Repair Shop", icon: "🔧", cat: "auto", startup: "$30K–$100K", margin: "40–60%", difficulty: 3 },
  { id: 11, name: "Car Wash", icon: "🧽", cat: "auto", startup: "$50K–$200K", margin: "35–55%", difficulty: 2 },
  { id: 12, name: "Cell Phone Repair", icon: "📱", cat: "tech", startup: "$5K–$25K", margin: "50–70%", difficulty: 2 },
  { id: 13, name: "Beauty Supply Store", icon: "💄", cat: "beauty", startup: "$30K–$80K", margin: "35–50%", difficulty: 3 },
  { id: 14, name: "Barber Shop", icon: "💈", cat: "beauty", startup: "$15K–$50K", margin: "50–70%", difficulty: 2 },
  { id: 15, name: "Laundromat", icon: "🧺", cat: "passive", startup: "$50K–$200K", margin: "20–35%", difficulty: 2 },
  { id: 16, name: "T-Shirt Printing", icon: "🎨", cat: "creative", startup: "$5K–$20K", margin: "40–65%", difficulty: 2 },
  { id: 17, name: "Ice Cream Shop", icon: "🍦", cat: "food", startup: "$20K–$60K", margin: "50–70%", difficulty: 2 },
  { id: 18, name: "Bakery", icon: "🧁", cat: "food", startup: "$20K–$80K", margin: "40–60%", difficulty: 3 },
  { id: 19, name: "Furniture Store", icon: "🪑", cat: "retail", startup: "$50K–$200K", margin: "30–50%", difficulty: 4 },
  { id: 20, name: "Grocery Store", icon: "🛒", cat: "retail", startup: "$80K–$300K", margin: "5–15%", difficulty: 4 },
  { id: 21, name: "Toy Store", icon: "🧸", cat: "retail", startup: "$25K–$80K", margin: "35–50%", difficulty: 3 },
  { id: 22, name: "Bike Shop", icon: "🚲", cat: "retail", startup: "$30K–$100K", margin: "30–45%", difficulty: 3 },
  { id: 23, name: "Pet Store", icon: "🐾", cat: "retail", startup: "$40K–$120K", margin: "30–50%", difficulty: 3 },
  { id: 24, name: "Jewelry Store", icon: "💎", cat: "retail", startup: "$30K–$150K", margin: "40–65%", difficulty: 4 },
  { id: 25, name: "Gas Station", icon: "⛽", cat: "retail", startup: "$200K–$500K", margin: "5–15%", difficulty: 4 },
  { id: 26, name: "Landscaping Service", icon: "🌿", cat: "service", startup: "$5K–$20K", margin: "40–60%", difficulty: 2 },
  { id: 27, name: "Cleaning Service", icon: "🧹", cat: "service", startup: "$3K–$10K", margin: "30–50%", difficulty: 1 },
  { id: 28, name: "Sports Card Shop", icon: "⚾", cat: "retail", startup: "$10K–$40K", margin: "25–50%", difficulty: 2 },
  { id: 29, name: "Online Thrift Store", icon: "📦", cat: "creative", startup: "$1K–$5K", margin: "40–70%", difficulty: 1 },
  { id: 30, name: "Restaurant", icon: "🍽️", cat: "food", startup: "$100K–$400K", margin: "10–20%", difficulty: 5 },
];

// ═══════════════════════════════════════════════
// DATA: COMPANY CONNECTIONS
// ═══════════════════════════════════════════════
const COMPANY_MAP = {
  "auto": { company: "Toyota", what: "Reliable cars at every price point", who: "Families, commuters, and first-time buyers", success: "Reliability reputation built over decades of consistent quality", marketing: "Trust-based ads focusing on dependability and resale value", competitor: "Strong — Ford, Honda, Hyundai all compete for the same buyer", audience: "Mass market, value-conscious consumers" },
  "fashion": { company: "Nike", what: "Athletic shoes, apparel, and lifestyle gear", who: "Athletes, teens, fashion-forward consumers", success: "Iconic branding and athlete partnerships that create cultural status", marketing: "Celebrity endorsements, social media, limited drops that create urgency", competitor: "Very high — Adidas, New Balance, Puma all fight for market share", audience: "Young, brand-conscious, willing to pay for status" },
  "food": { company: "McDonald's", what: "Fast, affordable, consistent meals worldwide", who: "Everyone — families, workers, travelers, students", success: "Speed, consistency, and value pricing that never changes", marketing: "TV, app deals, Happy Meals for kids, seasonal limited items", competitor: "Intense — Burger King, Wendy's, Chick-fil-A, and local spots", audience: "Mass market, convenience-driven, price-sensitive" },
  "retail": { company: "Target", what: "Affordable home goods, clothing, groceries, and essentials", who: "Suburban families, young professionals, deal hunters", success: "Clean stores, designer collabs, and a brand that feels premium but affordable", marketing: "Weekly deals, app exclusives, social media, seasonal campaigns", competitor: "High — Walmart on price, Amazon on convenience", audience: "Middle-income families who want quality without luxury prices" },
  "beauty": { company: "Sephora", what: "Prestige cosmetics, skincare, and beauty tools", who: "Beauty enthusiasts from teens to adults", success: "In-store experience, huge product range, and loyalty rewards", marketing: "Influencer partnerships, tutorials, app engagement, birthday gifts", competitor: "Ulta on price, department stores on prestige", audience: "Trend-aware, willing to invest in self-care and appearance" },
  "tech": { company: "Apple (Service Model)", what: "Premium devices and repair ecosystem", who: "Tech users who value quality and simplicity", success: "Ecosystem lock-in and premium brand positioning", marketing: "Minimalist ads, word of mouth, retail experience", competitor: "Samsung on hardware, independent repair shops on price", audience: "Quality-first consumers who prefer premium experiences" },
  "passive": { company: "Coinstar / Route Operators", what: "Self-service machines placed in high-traffic locations", who: "Convenience seekers in stores, malls, offices", success: "Low labor costs, location strategy, and passive income model", marketing: "Placement deals, signage, no traditional ads needed", competitor: "Low — mostly about securing the best locations first", audience: "Impulse buyers, people who want quick convenience" },
  "service": { company: "Stanley Steemer", what: "Professional cleaning and maintenance services", who: "Homeowners, property managers, businesses", success: "Reputation, consistency, and trust built through referrals", marketing: "Local ads, Google reviews, door-to-door, referral programs", competitor: "High locally — many small operators, low barriers to entry", audience: "Property owners who value reliability over lowest price" },
  "creative": { company: "Etsy Sellers / Printful", what: "Custom products made on demand or resold online", who: "Niche buyers looking for unique or personalized items", success: "Low overhead, creative branding, and social media marketing", marketing: "Instagram, TikTok, marketplace SEO, influencer gifting", competitor: "Moderate — millions of sellers, but niche markets reward originality", audience: "Young, online-first shoppers who value uniqueness over brand" },
};

// ═══════════════════════════════════════════════
// DATA: QUIZZES (passage + question per topic)
// ═══════════════════════════════════════════════
const QUIZ_TOPICS = [
  {
    topic: "Persuasion",
    passage: "A good salesperson doesn't just talk about a product — they connect it to what the buyer already wants. If someone walks into a sneaker store looking for running shoes, a great salesperson asks about their running goals, then shows a shoe that matches. The sale feels helpful instead of pushy because it starts with listening.",
    question: "What makes a salesperson persuasive instead of pushy?",
    options: ["Talking fast so the customer can't say no", "Listening first, then matching the product to what the buyer needs", "Offering the most expensive item right away", "Ignoring what the customer says and pushing the newest product"],
    correct: 1, scores: { strategy: 2, decision: 1 },
  },
  {
    topic: "Needs vs Wants",
    passage: "You have $100 for the week. School supplies cost $20, a field trip costs $80, and new shoes cost $100. You need supplies for class, the field trip is once a year, and your current shoes still fit. A smart spender handles needs first, then decides which wants matter most with what's left.",
    question: "What should you buy first?",
    options: ["New shoes because they look better", "School supplies because class needs come first", "The field trip because it's fun", "Nothing — save all of it"],
    correct: 1, scores: { budget: 2, responsibility: 1 },
  },
  {
    topic: "Pricing Strategy",
    passage: "A coffee shop downtown charges $6 for a latte. A new shop opens across the street charging $4 for the same quality. The first shop responds by adding a loyalty card: buy 5, get 1 free. Instead of lowering their price, they created extra value. Customers feel rewarded for coming back, and the shop protects its profit margins.",
    question: "Why did the first coffee shop use a loyalty card instead of lowering prices?",
    options: ["They didn't care about losing customers", "Loyalty cards create repeat visits without cutting profit margins", "They wanted to charge more than everyone", "Lowering prices is always the best strategy"],
    correct: 1, scores: { strategy: 2, investing: 1 },
  },
  {
    topic: "Budgeting Choices",
    passage: "Marcus earns $500 a month from his part-time job. His phone bill is $40, gas is $60, and he saves $100. That leaves $300 for food, fun, and unexpected costs. When his friend asks him to split a $200 concert ticket, Marcus realizes it would take two-thirds of his free money for the month. He decides to wait for a cheaper show next month.",
    question: "Why was Marcus smart to wait?",
    options: ["Concerts are always a waste of money", "Spending $200 would leave almost nothing for food and emergencies", "He should never spend money on fun things", "He earns too little to ever go to a concert"],
    correct: 1, scores: { budget: 2, saving: 1 },
  },
  {
    topic: "Competition Analysis",
    passage: "Two food trucks park on the same block. One sells tacos for $3. The other sells gourmet tacos for $7 with fresh ingredients and unique sauces. The $3 truck gets more volume, but the $7 truck earns more per sale and attracts customers willing to pay for quality. Both can succeed because they target different audiences.",
    question: "What does this example show about competition?",
    options: ["The cheaper option always wins", "You can compete on quality and audience instead of just price", "Food trucks can never make money", "There's no strategy involved in food businesses"],
    correct: 1, scores: { strategy: 2, decision: 1 },
  },
  {
    topic: "Saving vs Spending",
    passage: "Jada gets $50 for her birthday. She wants a new game ($40), a book ($15), and to save some for later. She realizes she can't afford everything. She picks the game now, borrows the book from the library, and saves $10. She got what she wanted most without going broke.",
    question: "What made Jada's decision smart?",
    options: ["She bought everything she wanted", "She prioritized, found a free alternative, and still saved something", "She should have saved all $50", "Spending birthday money is always wrong"],
    correct: 1, scores: { saving: 2, decision: 1 },
  },
  {
    topic: "Upselling",
    passage: "A customer orders a medium coffee for $4. The cashier says, 'For just $1 more you can get a large — that's 50% more coffee for 25% more money.' The customer upgrades. The shop just increased that sale by 25% with one sentence. Upselling works when the upgrade feels like a deal, not a trick.",
    question: "Why does this upsell work?",
    options: ["The cashier pressured the customer into spending more", "The customer gets noticeably more value for a small extra cost", "Large drinks are always better", "The shop is being dishonest about the value"],
    correct: 1, scores: { strategy: 2, investing: 1 },
  },
  {
    topic: "Investing Basics",
    passage: "Kai puts $100 into a savings account that earns 5% per year. After one year he has $105. He leaves it in. After year two, he earns 5% on $105, giving him $110.25. That extra $0.25 came from earning interest on his interest. Over 10 years, that $100 becomes $163 without him adding anything. That's compounding.",
    question: "What makes compounding powerful?",
    options: ["You earn interest on your original money plus all the interest it already earned", "Banks give you extra money for no reason", "You have to keep adding money every month", "It only works with large amounts of money"],
    correct: 0, scores: { investing: 3 },
  },
  {
    topic: "Target Audience",
    passage: "A t-shirt printing business can sell to anyone, but the most successful ones pick a niche. One shop only makes shirts for local sports teams. Another focuses on custom graduation shirts. By narrowing their audience, they become the go-to option for that group instead of competing with every printer in town.",
    question: "Why does narrowing your audience help a business?",
    options: ["Fewer customers always means less money", "You become the best option for a specific group instead of competing with everyone", "It's easier to make fewer shirts", "Niche businesses can't grow"],
    correct: 1, scores: { strategy: 2, decision: 1 },
  },
  {
    topic: "Risk vs Reward",
    passage: "Two friends each have $1,000. One opens a cleaning service for $800 and earns $400/month within 3 months. The other waits for a 'perfect' business idea and still has $1,000 a year later — but earned nothing from it. Starting small and learning beats waiting for perfect.",
    question: "What's the main lesson here?",
    options: ["You should never save money", "Taking smart action with a small investment beats waiting for a perfect plan", "Cleaning services are the only good business", "Risk is always bad"],
    correct: 1, scores: { investing: 2, responsibility: 1 },
  },
];

// ═══════════════════════════════════════════════
// DATA: WHACK-A-MOLE GAME QUESTIONS
// ═══════════════════════════════════════════════
const MOLE_QUESTIONS = [
  { q: "You have 4 kids to feed on a tight budget. Best choice?", answers: ["Expensive restaurant", "Affordable groceries for the week", "Skip meals to save money", "Order delivery every night"], correct: 1, scores: { responsibility: 2, budget: 1 } },
  { q: "Your clothing store has unsold summer inventory. What do you do?", answers: ["Throw it away", "End-of-season clearance sale", "Keep it at full price", "Hide it in the back"], correct: 1, scores: { strategy: 2, decision: 1 } },
  { q: "A customer complains about your product. Best response?", answers: ["Ignore them", "Listen, apologize, fix the problem", "Argue with them publicly", "Block them on social media"], correct: 1, scores: { responsibility: 2 } },
  { q: "You have $500 profit. Best reinvestment?", answers: ["Buy yourself something nice", "Better equipment that increases output", "Lottery tickets", "Lend it to a friend with no plan"], correct: 1, scores: { investing: 2, strategy: 1 } },
  { q: "Your competitor drops prices 20%. What do you do?", answers: ["Panic and close the business", "Add value instead of matching their price", "Drop prices even lower until you lose money", "Pretend it didn't happen"], correct: 1, scores: { strategy: 2, decision: 1 } },
  { q: "Best way to get your first 10 customers?", answers: ["Wait for them to find you", "Tell friends, post on social media, offer a first-time deal", "Spend your entire budget on a billboard", "Lower your price to $0"], correct: 1, scores: { strategy: 2 } },
  { q: "You earned $200 this week. Smart split?", answers: ["Spend it all on wants", "Save some, cover needs, then spend a little on wants", "Save every penny and never enjoy anything", "Give it all away"], correct: 1, scores: { budget: 2, saving: 1 } },
  { q: "Your food truck is slow on Mondays. Best fix?", answers: ["Close on Mondays forever", "Try a Monday lunch deal to test demand", "Complain about it", "Move to a different city"], correct: 1, scores: { strategy: 2, decision: 1 } },
];

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let id, stars = [];
    const resize = () => { c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; stars = Array.from({ length: 80 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.2 + 0.3, sp: Math.random() * 0.25 + 0.05, a: Math.random() * 0.4 + 0.2, p: Math.random() * 6.28 })); };
    resize(); window.addEventListener("resize", resize);
    const draw = t => { ctx.clearRect(0, 0, c.width, c.height); stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fillStyle = `rgba(200,180,255,${Math.max(0, s.a + Math.sin(t * 0.001 + s.p) * 0.1)})`; ctx.fill(); s.y -= s.sp; if (s.y < -5) { s.y = c.height + 5; s.x = Math.random() * c.width; } }); id = requestAnimationFrame(draw); };
    id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

function G({ children, style, glow, onClick, accent }) {
  return <div onClick={onClick} style={{ background: "rgba(18,10,32,0.65)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: `1px solid ${accent || "rgba(160,120,255,0.15)"}`, borderRadius: 16, padding: 24, boxShadow: glow ? "0 0 30px rgba(160,100,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)", cursor: onClick ? "pointer" : "default", transition: "all 0.2s", ...style }}>{children}</div>;
}

function Bar({ pct, color = "#b47aff", h = 8 }) {
  return <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: h, height: h, overflow: "hidden", width: "100%" }}><div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: h, background: `linear-gradient(90deg,${color},${color}88)`, transition: "width 0.6s" }} /></div>;
}

function Pill({ text, color, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: active ? `${color}22` : "rgba(255,255,255,0.03)", color: active ? color : "rgba(255,255,255,0.35)", transition: "all 0.2s" }}>{text}</button>;
}

// ═══════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════

// --- BUSINESS PICKER ---
function BusinessPicker({ onSelect }) {
  const [filter, setFilter] = useState("all");
  const cats = ["all", "food", "retail", "auto", "fashion", "beauty", "service", "tech", "passive", "creative"];
  const filtered = filter === "all" ? BUSINESSES : BUSINESSES.filter(b => b.cat === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <G style={{ borderLeft: "3px solid #b47aff" }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Pick a business to run. You'll study how real companies in this space operate, take quizzes on business thinking, play fast-paced money games, and earn scores across six skill areas.</p>
      </G>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {cats.map(c => <Pill key={c} text={c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)} color="#b47aff" active={filter === c} onClick={() => setFilter(c)} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {filtered.map(b => (
          <G key={b.id} onClick={() => onSelect(b)} style={{ padding: 16, cursor: "pointer", textAlign: "center" }} accent="rgba(160,120,255,0.1)">
            <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 4, lineHeight: 1.3 }}>{b.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{b.startup}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 6 }}>
              {[1,2,3,4,5].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: d <= b.difficulty ? "#f59e0b" : "rgba(255,255,255,0.08)" }} />)}
            </div>
          </G>
        ))}
      </div>
    </div>
  );
}

// --- BUSINESS ANALYSIS ---
function BusinessAnalysis({ biz }) {
  const info = COMPANY_MAP[biz.cat] || COMPANY_MAP.retail;
  const fields = [
    { label: "What they sell", value: info.what, icon: "📦" },
    { label: "Who buys it", value: info.who, icon: "👥" },
    { label: "Why they succeed", value: info.success, icon: "🏆" },
    { label: "Marketing strategy", value: info.marketing, icon: "📣" },
    { label: "Competitor pressure", value: info.competitor, icon: "⚔️" },
    { label: "Audience type", value: info.audience, icon: "🎯" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <G glow>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #b47aff22, #f59e0b22)", border: "1px solid rgba(180,122,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{biz.icon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e0c3ff" }}>{biz.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Startup: {biz.startup} · Margin: {biz.margin}</div>
          </div>
        </div>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 4 }}>REAL-WORLD EXAMPLE</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24" }}>{info.company}</div>
        </div>
      </G>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fields.map(f => (
          <G key={f.label} style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, marginTop: 1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#d4b4ff", marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{f.value}</div>
              </div>
            </div>
          </G>
        ))}
      </div>
      <G>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e0c3ff", marginBottom: 10 }}>Strategy Features to Explore</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {["Competition Analysis", "Break-even Calculator", "Upsell & Bundle Strategy", "Local vs Online Sales", "Seasonal Demand Check", "Pricing Strategy", "Ad Channel Selection", "Customer Persona Builder", "Profit Margin Tracker", "Inventory Risk Meter"].map(s => (
            <div key={s} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
              {s}
            </div>
          ))}
        </div>
      </G>
    </div>
  );
}

// --- QUIZ MODE ---
function QuizMode({ biz, onScore }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const quiz = QUIZ_TOPICS[qIdx];
  const done = qIdx >= QUIZ_TOPICS.length;

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === quiz.correct;
    const newResults = [...results, { correct, scores: correct ? quiz.scores : {} }];
    setResults(newResults);
    if (correct) onScore(quiz.scores);
    setTimeout(() => { setSelected(null); setQIdx(qIdx + 1); }, 1200);
  };

  if (done) {
    const correctCount = results.filter(r => r.correct).length;
    return (
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Quiz Complete</div>
        <div style={{ fontSize: 16, color: "#fbbf24", fontWeight: 700, marginBottom: 16 }}>{correctCount} / {QUIZ_TOPICS.length} correct</div>
        <Bar pct={(correctCount / QUIZ_TOPICS.length) * 100} color={correctCount >= 7 ? "#4ade80" : "#f59e0b"} h={12} />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>
          {correctCount >= 8 ? "Outstanding business thinking. You're ready to run something." : correctCount >= 5 ? "Solid foundation. Keep learning and your scores will climb." : "Good start. Review the passages and try again to improve."}
        </p>
        <button onClick={() => { setQIdx(0); setResults([]); }} style={{ marginTop: 16, padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700 }}>Try Again</button>
      </G>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Question {qIdx + 1} of {QUIZ_TOPICS.length}</span>
        <span style={{ fontSize: 11, color: "#b47aff", fontWeight: 600 }}>{quiz.topic}</span>
      </div>
      <Bar pct={((qIdx) / QUIZ_TOPICS.length) * 100} color="#b47aff" />
      <G style={{ borderLeft: "3px solid #f59e0b" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Read First</div>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>{quiz.passage}</p>
      </G>
      <G glow>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#e0c3ff", marginBottom: 16 }}>{quiz.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {quiz.options.map((opt, i) => {
            let bg = "rgba(255,255,255,0.03)";
            let border = "rgba(255,255,255,0.08)";
            let color = "rgba(255,255,255,0.75)";
            if (selected !== null) {
              if (i === quiz.correct) { bg = "rgba(74,222,128,0.12)"; border = "rgba(74,222,128,0.3)"; color = "#4ade80"; }
              else if (i === selected) { bg = "rgba(248,113,113,0.12)"; border = "rgba(248,113,113,0.3)"; color = "#f87171"; }
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 13, fontWeight: 500, textAlign: "left", cursor: selected === null ? "pointer" : "default", transition: "all 0.2s", lineHeight: 1.5, width: "100%" }}>
                <span style={{ fontWeight: 700, marginRight: 8, color: "rgba(255,255,255,0.3)" }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
      </G>
    </div>
  );
}

// --- WHACK-A-MOLE GAME ---
function MoleGame({ onScore }) {
  const [qIdx, setQIdx] = useState(0);
  const [moles, setMoles] = useState([null, null, null, null]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [phase, setPhase] = useState("ready"); // ready, playing, done
  const [flash, setFlash] = useState(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const timerRef = useRef(null);
  const moleRef = useRef(null);

  const currentQ = MOLE_QUESTIONS[qIdx % MOLE_QUESTIONS.length];

  const spawnMoles = useCallback(() => {
    const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const correctPos = indices[0];
    const wrongAnswers = currentQ.answers.filter((_, i) => i !== currentQ.correct).sort(() => Math.random() - 0.5);
    const newMoles = [null, null, null, null];
    newMoles[correctPos] = { text: currentQ.answers[currentQ.correct], correct: true, visible: true };
    let wi = 0;
    indices.slice(1).forEach(pos => { newMoles[pos] = { text: wrongAnswers[wi++], correct: false, visible: true }; });
    setMoles(newMoles);
  }, [currentQ]);

  const startGame = () => {
    setPhase("playing"); setScore(0); setTimer(30); setQIdx(0); setHits(0); setMisses(0);
    spawnMoles();
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { setPhase("done"); clearInterval(timerRef.current); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => { if (phase === "playing") spawnMoles(); }, [qIdx, phase, spawnMoles]);

  const whack = (i) => {
    if (phase !== "playing" || !moles[i]) return;
    if (moles[i].correct) {
      setScore(s => s + 100);
      setHits(h => h + 1);
      setFlash("correct");
      if (currentQ.scores) onScore(currentQ.scores);
      setTimeout(() => { setFlash(null); setQIdx(q => q + 1); }, 600);
    } else {
      setScore(s => Math.max(0, s - 25));
      setMisses(m => m + 1);
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
    }
  };

  if (phase === "ready") return (
    <G glow style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔨</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#e0c3ff", marginBottom: 8 }}>Whack-a-Mole: Money Edition</div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>Read the question and whack the correct answer before time runs out. Wrong answers cost points. Fast thinking, smart choices.</p>
      <button onClick={startGame} style={{ padding: "14px 36px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 15, fontWeight: 700 }}>Start Game</button>
    </G>
  );

  if (phase === "done") return (
    <G glow style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{score >= 500 ? "🏆" : score >= 300 ? "🔥" : "💪"}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Game Over</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24", marginBottom: 16 }}>{score} pts</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20 }}>
        <div><div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>{hits}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Correct</div></div>
        <div><div style={{ fontSize: 18, fontWeight: 800, color: "#f87171" }}>{misses}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Wrong</div></div>
      </div>
      <button onClick={startGame} style={{ padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700 }}>Play Again</button>
    </G>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>{score} pts</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: timer <= 10 ? "#f87171" : "rgba(255,255,255,0.6)" }}>⏱ {timer}s</div>
      </div>
      <G style={{ borderLeft: `3px solid ${flash === "correct" ? "#4ade80" : flash === "wrong" ? "#f87171" : "#f59e0b"}`, transition: "border-color 0.2s" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", lineHeight: 1.6 }}>{currentQ.q}</div>
      </G>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {moles.map((m, i) => (
          <button key={i} onClick={() => whack(i)} style={{
            padding: 20, borderRadius: 16, border: "2px solid rgba(255,255,255,0.08)", minHeight: 100,
            background: m?.visible ? "rgba(18,10,32,0.8)" : "rgba(255,255,255,0.02)",
            cursor: m?.visible ? "pointer" : "default", transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            transform: m?.visible ? "scale(1)" : "scale(0.9)", opacity: m?.visible ? 1 : 0.3,
          }}>
            <div style={{ fontSize: 28 }}>{m?.visible ? "🟤" : "🕳️"}</div>
            {m?.visible && <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 1.4 }}>{m.text}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- SCORE DASHBOARD ---
function ScoreDashboard({ scores }) {
  const cats = [
    { key: "responsibility", label: "Responsibility", icon: "🛡️", color: "#4ade80" },
    { key: "budget", label: "Budgeting", icon: "📊", color: "#38bdf8" },
    { key: "saving", label: "Saving", icon: "💰", color: "#f59e0b" },
    { key: "investing", label: "Investing", icon: "📈", color: "#b47aff" },
    { key: "decision", label: "Decision-Making", icon: "🧠", color: "#e879f9" },
    { key: "strategy", label: "Strategy", icon: "♟️", color: "#f87171" },
  ];
  const maxScore = Math.max(...cats.map(c => scores[c.key] || 0), 1);
  const total = cats.reduce((s, c) => s + (scores[c.key] || 0), 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Total Score</div>
        <div style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #e0c3ff, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{total}</div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>Your scores grow with every quiz and game. Smart money habits build through repeated good decisions.</p>
      </G>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {cats.map(c => (
          <G key={c.key} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{scores[c.key] || 0}</div>
            <Bar pct={maxScore > 0 ? ((scores[c.key] || 0) / maxScore) * 100 : 0} color={c.color} h={6} />
          </G>
        ))}
      </div>
    </div>
  );
}

// --- CHALLENGE MODE ---
function ChallengeMode({ scores }) {
  const [challenger, setChallenger] = useState("");
  const [sent, setSent] = useState(false);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const leaderboard = [
    { name: "You", score: total, highlight: true },
    { name: "Jordan M.", score: 42 },
    { name: "Aaliyah K.", score: 38 },
    { name: "DeShawn R.", score: 35 },
    { name: "Sofia L.", score: 28 },
  ].sort((a, b) => b.score - a.score);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <G style={{ borderLeft: "3px solid #e879f9" }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Challenge friends in your age group to see who scores highest on quizzes and games. Compete on business knowledge, not luck.</p>
      </G>
      <G glow>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Leaderboard</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leaderboard.map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: p.highlight ? "rgba(180,122,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${p.highlight ? "rgba(180,122,255,0.2)" : "rgba(255,255,255,0.05)"}` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,#f59e0b,#fbbf24)" : i === 1 ? "rgba(192,192,192,0.3)" : i === 2 ? "rgba(205,127,50,0.3)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: i <= 2 ? "#fff" : "rgba(255,255,255,0.3)" }}>
                {i + 1}
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: p.highlight ? 700 : 500, color: p.highlight ? "#d4b4ff" : "rgba(255,255,255,0.65)" }}>
                {p.name} {p.highlight && <span style={{ fontSize: 10, color: "#b47aff" }}>(you)</span>}
              </span>
              <span style={{ fontSize: 15, fontWeight: 800, color: p.highlight ? "#fbbf24" : "rgba(255,255,255,0.5)" }}>{p.score}</span>
            </div>
          ))}
        </div>
      </G>
      <G>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 12 }}>Send a Challenge</div>
        {sent ? (
          <div style={{ padding: "16px", borderRadius: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>✅</div>
            <div style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>Challenge sent to {challenger}!</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>They'll get a notification to beat your score of {total} points.</div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" }}>
                <input type="text" value={challenger} onChange={e => setChallenger(e.target.value)} placeholder="Friend's username" style={{ background: "none", border: "none", color: "#fff", fontSize: 13, width: "100%", outline: "none", fontFamily: "inherit" }} />
              </div>
              <button onClick={() => challenger && setSent(true)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>Challenge</button>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Your friend will take the same quiz and game set. Highest combined score wins.</p>
          </div>
        )}
      </G>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function BusinessSimulatorLab() {
  const [screen, setScreen] = useState("pick"); // pick, analyze, quiz, game, scores, challenge
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [scores, setScores] = useState({ responsibility: 0, budget: 0, saving: 0, investing: 0, decision: 0, strategy: 0 });

  const addScore = (s) => { if (!s) return; setScores(prev => { const n = { ...prev }; Object.entries(s).forEach(([k, v]) => { n[k] = (n[k] || 0) + v; }); return n; }); };

  const selectBiz = (b) => { setSelectedBiz(b); setScreen("analyze"); };

  const tabs = [
    { id: "pick", label: "Choose Business", icon: "🏪" },
    { id: "analyze", label: "Analysis", icon: "🔍", disabled: !selectedBiz },
    { id: "quiz", label: "Quiz", icon: "📝" },
    { id: "game", label: "Game", icon: "🎮" },
    { id: "scores", label: "Scores", icon: "📊" },
    { id: "challenge", label: "Challenge", icon: "⚔️" },
  ];

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a0514 0%, #110a24 40%, #0d0820 100%)", color: "#fff", fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
      <Starfield />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#b47aff", textTransform: "uppercase", marginBottom: 8 }}>Club FLE</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #e0c3ff, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Business Simulator Lab</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 440, marginInline: "auto", lineHeight: 1.5 }}>
            Pick a business. Study the strategy. Take the quiz. Play the game. Earn your scores.
          </p>
        </div>

        {/* ACTIVE BIZ + SCORE BANNER */}
        {selectedBiz && (
          <div style={{ display: "flex", gap: 12, margin: "16px 0", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: "rgba(180,122,255,0.1)", border: "1px solid rgba(180,122,255,0.2)", flex: 1 }}>
              <span style={{ fontSize: 18 }}>{selectedBiz.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#d4b4ff" }}>{selectedBiz.name}</span>
            </div>
            <div style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>{total} pts</span>
            </div>
          </div>
        )}

        {/* TAB NAV */}
        <div style={{ display: "flex", gap: 3, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 3, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => !t.disabled && setScreen(t.id)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 10, border: "none", cursor: t.disabled ? "default" : "pointer", fontSize: 11, fontWeight: 600, transition: "all 0.2s", minWidth: 0, whiteSpace: "nowrap",
              background: screen === t.id ? "rgba(180,122,255,0.2)" : "transparent",
              color: t.disabled ? "rgba(255,255,255,0.15)" : screen === t.id ? "#d4b4ff" : "rgba(255,255,255,0.4)",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* SCREENS */}
        {screen === "pick" && <BusinessPicker onSelect={selectBiz} />}
        {screen === "analyze" && selectedBiz && <BusinessAnalysis biz={selectedBiz} />}
        {screen === "quiz" && <QuizMode biz={selectedBiz} onScore={addScore} />}
        {screen === "game" && <MoleGame onScore={addScore} />}
        {screen === "scores" && <ScoreDashboard scores={scores} />}
        {screen === "challenge" && <ChallengeMode scores={scores} />}

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Club FLE · Financial Literacy Extraordinaire</div>
        </div>
      </div>
    </div>
  );
}
