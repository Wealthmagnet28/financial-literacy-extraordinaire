import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// DATA: 30 BUSINESSES
// ═══════════════════════════════════════════════════════════════
const BUSINESSES = [
  { id: 1, name: "Used Car Dealership", icon: "🚗", cat: "auto", startup: "$50K–$150K", margin: "15–25%", diff: 3 },
  { id: 2, name: "New Car Dealership", icon: "🏎️", cat: "auto", startup: "$200K–$500K", margin: "8–15%", diff: 5 },
  { id: 3, name: "Clothing Store", icon: "👕", cat: "fashion", startup: "$20K–$80K", margin: "40–60%", diff: 3 },
  { id: 4, name: "Sneaker Store", icon: "👟", cat: "fashion", startup: "$30K–$100K", margin: "30–50%", diff: 3 },
  { id: 5, name: "Vending Machines", icon: "🎰", cat: "passive", startup: "$5K–$20K", margin: "40–60%", diff: 1 },
  { id: 6, name: "Coffee Shop", icon: "☕", cat: "food", startup: "$25K–$100K", margin: "60–80%", diff: 3 },
  { id: 7, name: "Fast Food Restaurant", icon: "🍔", cat: "food", startup: "$100K–$500K", margin: "10–20%", diff: 4 },
  { id: 8, name: "Food Truck", icon: "🚚", cat: "food", startup: "$15K–$50K", margin: "25–40%", diff: 2 },
  { id: 9, name: "Convenience Store", icon: "🏪", cat: "retail", startup: "$40K–$150K", margin: "20–35%", diff: 3 },
  { id: 10, name: "Auto Repair Shop", icon: "🔧", cat: "auto", startup: "$30K–$100K", margin: "40–60%", diff: 3 },
  { id: 11, name: "Car Wash", icon: "🧽", cat: "auto", startup: "$50K–$200K", margin: "35–55%", diff: 2 },
  { id: 12, name: "Cell Phone Repair", icon: "📱", cat: "tech", startup: "$5K–$25K", margin: "50–70%", diff: 2 },
  { id: 13, name: "Beauty Supply Store", icon: "💄", cat: "beauty", startup: "$30K–$80K", margin: "35–50%", diff: 3 },
  { id: 14, name: "Barber Shop", icon: "💈", cat: "beauty", startup: "$15K–$50K", margin: "50–70%", diff: 2 },
  { id: 15, name: "Laundromat", icon: "🧺", cat: "passive", startup: "$50K–$200K", margin: "20–35%", diff: 2 },
  { id: 16, name: "T-Shirt Printing", icon: "🎨", cat: "creative", startup: "$5K–$20K", margin: "40–65%", diff: 2 },
  { id: 17, name: "Ice Cream Shop", icon: "🍦", cat: "food", startup: "$20K–$60K", margin: "50–70%", diff: 2 },
  { id: 18, name: "Bakery", icon: "🧁", cat: "food", startup: "$20K–$80K", margin: "40–60%", diff: 3 },
  { id: 19, name: "Furniture Store", icon: "🪑", cat: "retail", startup: "$50K–$200K", margin: "30–50%", diff: 4 },
  { id: 20, name: "Grocery Store", icon: "🛒", cat: "retail", startup: "$80K–$300K", margin: "5–15%", diff: 4 },
  { id: 21, name: "Toy Store", icon: "🧸", cat: "retail", startup: "$25K–$80K", margin: "35–50%", diff: 3 },
  { id: 22, name: "Bike Shop", icon: "🚲", cat: "retail", startup: "$30K–$100K", margin: "30–45%", diff: 3 },
  { id: 23, name: "Pet Store", icon: "🐾", cat: "retail", startup: "$40K–$120K", margin: "30–50%", diff: 3 },
  { id: 24, name: "Jewelry Store", icon: "💎", cat: "retail", startup: "$30K–$150K", margin: "40–65%", diff: 4 },
  { id: 25, name: "Gas Station", icon: "⛽", cat: "retail", startup: "$200K–$500K", margin: "5–15%", diff: 4 },
  { id: 26, name: "Landscaping Service", icon: "🌿", cat: "service", startup: "$5K–$20K", margin: "40–60%", diff: 2 },
  { id: 27, name: "Cleaning Service", icon: "🧹", cat: "service", startup: "$3K–$10K", margin: "30–50%", diff: 1 },
  { id: 28, name: "Sports Card Shop", icon: "⚾", cat: "retail", startup: "$10K–$40K", margin: "25–50%", diff: 2 },
  { id: 29, name: "Online Thrift Store", icon: "📦", cat: "creative", startup: "$1K–$5K", margin: "40–70%", diff: 1 },
  { id: 30, name: "Restaurant", icon: "🍽️", cat: "food", startup: "$100K–$400K", margin: "10–20%", diff: 5 },
];

// ═══════════════════════════════════════════════════════════════
// DATA: COMPANY CONNECTIONS
// ═══════════════════════════════════════════════════════════════
const COMPANY_MAP = {
  auto: { company: "Toyota", what: "Reliable cars at every price point", who: "Families, commuters, first-time buyers", success: "Reliability reputation built over decades of consistent quality", marketing: "Trust-based ads focusing on dependability and resale value", competitor: "Strong — Ford, Honda, Hyundai all compete for the same buyer", audience: "Mass market, value-conscious consumers" },
  fashion: { company: "Nike", what: "Athletic shoes, apparel, and lifestyle gear", who: "Athletes, teens, fashion-forward consumers", success: "Iconic branding and athlete partnerships that create cultural status", marketing: "Celebrity endorsements, social media, limited drops that create urgency", competitor: "Very high — Adidas, New Balance, Puma all fight for market share", audience: "Young, brand-conscious, willing to pay for status" },
  food: { company: "McDonald's", what: "Fast, affordable, consistent meals worldwide", who: "Everyone — families, workers, travelers, students", success: "Speed, consistency, and value pricing that never changes", marketing: "TV, app deals, Happy Meals, seasonal limited items", competitor: "Intense — Burger King, Wendy's, Chick-fil-A, and local spots", audience: "Mass market, convenience-driven, price-sensitive" },
  retail: { company: "Target", what: "Affordable home goods, clothing, groceries, essentials", who: "Suburban families, young professionals, deal hunters", success: "Clean stores, designer collabs, and a brand that feels premium but affordable", marketing: "Weekly deals, app exclusives, social media, seasonal campaigns", competitor: "High — Walmart on price, Amazon on convenience", audience: "Middle-income families who want quality without luxury prices" },
  beauty: { company: "Sephora", what: "Prestige cosmetics, skincare, beauty tools", who: "Beauty enthusiasts from teens to adults", success: "In-store experience, huge product range, and loyalty rewards", marketing: "Influencer partnerships, tutorials, app engagement, birthday gifts", competitor: "Ulta on price, department stores on prestige", audience: "Trend-aware, willing to invest in self-care and appearance" },
  tech: { company: "Apple (Service Model)", what: "Premium devices and repair ecosystem", who: "Tech users who value quality and simplicity", success: "Ecosystem lock-in and premium brand positioning", marketing: "Minimalist ads, word of mouth, retail experience", competitor: "Samsung on hardware, independent repair shops on price", audience: "Quality-first consumers who prefer premium experiences" },
  passive: { company: "Coinstar / Route Operators", what: "Self-service machines placed in high-traffic locations", who: "Convenience seekers in stores, malls, offices", success: "Low labor costs, location strategy, and passive income model", marketing: "Placement deals, signage, no traditional ads needed", competitor: "Low — mostly about securing the best locations first", audience: "Impulse buyers, people who want quick convenience" },
  service: { company: "Stanley Steemer", what: "Professional cleaning and maintenance services", who: "Homeowners, property managers, businesses", success: "Reputation, consistency, and trust built through referrals", marketing: "Local ads, Google reviews, door-to-door, referral programs", competitor: "High locally — many small operators, low barriers to entry", audience: "Property owners who value reliability over lowest price" },
  creative: { company: "Etsy Sellers / Printful", what: "Custom products made on demand or resold online", who: "Niche buyers looking for unique or personalized items", success: "Low overhead, creative branding, and social media marketing", marketing: "Instagram, TikTok, marketplace SEO, influencer gifting", competitor: "Moderate — millions of sellers, but niche markets reward originality", audience: "Young, online-first shoppers who value uniqueness over brand" },
};

// ═══════════════════════════════════════════════════════════════
// DATA: QUIZ (passage + question)
// ═══════════════════════════════════════════════════════════════
const QUIZ_TOPICS = [
  { topic: "Persuasion", passage: "A good salesperson doesn't just talk about a product — they connect it to what the buyer already wants. If someone walks into a sneaker store looking for running shoes, a great salesperson asks about their running goals, then shows a shoe that matches. The sale feels helpful instead of pushy because it starts with listening.", question: "What makes a salesperson persuasive instead of pushy?", options: ["Talking fast so the customer can't say no", "Listening first, then matching the product to what the buyer needs", "Offering the most expensive item right away", "Ignoring what the customer says and pushing the newest product"], correct: 1, scores: { strategy: 2, decision: 1 } },
  { topic: "Needs vs Wants", passage: "You have $100 for the week. School supplies cost $20, a field trip costs $80, and new shoes cost $100. You need supplies for class, the field trip is once a year, and your current shoes still fit. A smart spender handles needs first, then decides which wants matter most.", question: "What should you buy first?", options: ["New shoes because they look better", "School supplies because class needs come first", "The field trip because it's fun", "Nothing — save all of it"], correct: 1, scores: { budget: 2, responsibility: 1 } },
  { topic: "Pricing Strategy", passage: "A coffee shop downtown charges $6 for a latte. A new shop opens across the street charging $4 for the same quality. The first shop responds by adding a loyalty card: buy 5, get 1 free. Instead of lowering their price, they created extra value. Customers feel rewarded for coming back, and the shop protects its profit margins.", question: "Why did the first coffee shop use a loyalty card instead of lowering prices?", options: ["They didn't care about losing customers", "Loyalty cards create repeat visits without cutting profit margins", "They wanted to charge more than everyone", "Lowering prices is always the best strategy"], correct: 1, scores: { strategy: 2, investing: 1 } },
  { topic: "Budgeting", passage: "Marcus earns $500 a month from his part-time job. His phone bill is $40, gas is $60, and he saves $100. That leaves $300 for food, fun, and unexpected costs. When his friend asks him to split a $200 concert ticket, Marcus realizes it would take two-thirds of his free money for the month. He decides to wait for a cheaper show next month.", question: "Why was Marcus smart to wait?", options: ["Concerts are always a waste of money", "Spending $200 would leave almost nothing for food and emergencies", "He should never spend money on fun things", "He earns too little to ever go to a concert"], correct: 1, scores: { budget: 2, saving: 1 } },
  { topic: "Competition", passage: "Two food trucks park on the same block. One sells tacos for $3. The other sells gourmet tacos for $7 with fresh ingredients and unique sauces. The $3 truck gets more volume, but the $7 truck earns more per sale and attracts customers willing to pay for quality. Both can succeed because they target different audiences.", question: "What does this example show about competition?", options: ["The cheaper option always wins", "You can compete on quality and audience instead of just price", "Food trucks can never make money", "There's no strategy involved in food businesses"], correct: 1, scores: { strategy: 2, decision: 1 } },
  { topic: "Saving vs Spending", passage: "Jada gets $50 for her birthday. She wants a new game ($40), a book ($15), and to save some for later. She realizes she can't afford everything. She picks the game now, borrows the book from the library, and saves $10. She got what she wanted most without going broke.", question: "What made Jada's decision smart?", options: ["She bought everything she wanted", "She prioritized, found a free alternative, and still saved something", "She should have saved all $50", "Spending birthday money is always wrong"], correct: 1, scores: { saving: 2, decision: 1 } },
  { topic: "Upselling", passage: "A customer orders a medium coffee for $4. The cashier says, 'For just $1 more you can get a large — that's 50% more coffee for 25% more money.' The customer upgrades. The shop just increased that sale by 25% with one sentence. Upselling works when the upgrade feels like a deal, not a trick.", question: "Why does this upsell work?", options: ["The cashier pressured the customer into spending more", "The customer gets noticeably more value for a small extra cost", "Large drinks are always better", "The shop is being dishonest about the value"], correct: 1, scores: { strategy: 2, investing: 1 } },
  { topic: "Investing Basics", passage: "Kai puts $100 into a savings account that earns 5% per year. After one year he has $105. He leaves it in. After year two, he earns 5% on $105, giving him $110.25. That extra $0.25 came from earning interest on his interest. Over 10 years, that $100 becomes $163 without him adding anything. That's compounding.", question: "What makes compounding powerful?", options: ["You earn interest on your original money plus all the interest it already earned", "Banks give you extra money for no reason", "You have to keep adding money every month", "It only works with large amounts of money"], correct: 0, scores: { investing: 3 } },
  { topic: "Target Audience", passage: "A t-shirt printing business can sell to anyone, but the most successful ones pick a niche. One shop only makes shirts for local sports teams. Another focuses on custom graduation shirts. By narrowing their audience, they become the go-to option for that group instead of competing with every printer in town.", question: "Why does narrowing your audience help a business?", options: ["Fewer customers always means less money", "You become the best option for a specific group instead of competing with everyone", "It's easier to make fewer shirts", "Niche businesses can't grow"], correct: 1, scores: { strategy: 2, decision: 1 } },
  { topic: "Risk vs Reward", passage: "Two friends each have $1,000. One opens a cleaning service for $800 and earns $400/month within 3 months. The other waits for a 'perfect' business idea and still has $1,000 a year later — but earned nothing from it. Starting small and learning beats waiting for perfect.", question: "What's the main lesson here?", options: ["You should never save money", "Taking smart action with a small investment beats waiting for a perfect plan", "Cleaning services are the only good business", "Risk is always bad"], correct: 1, scores: { investing: 2, responsibility: 1 } },
];

// ═══════════════════════════════════════════════════════════════
// DATA: WHACK-A-MOLE QUESTIONS
// ═══════════════════════════════════════════════════════════════
const MOLE_QS = [
  { q: "4 kids to feed on a tight budget. Best choice?", a: ["Expensive restaurant", "Affordable groceries for the week", "Skip meals to save money", "Order delivery every night"], c: 1, s: { responsibility: 2, budget: 1 } },
  { q: "Your clothing store has unsold summer inventory. What do you do?", a: ["Throw it away", "End-of-season clearance sale", "Keep it at full price", "Hide it in the back"], c: 1, s: { strategy: 2, decision: 1 } },
  { q: "A customer complains about your product. Best response?", a: ["Ignore them", "Listen, apologize, fix the problem", "Argue with them publicly", "Block them on social media"], c: 1, s: { responsibility: 2 } },
  { q: "You have $500 profit. Best reinvestment?", a: ["Buy yourself something nice", "Better equipment that increases output", "Lottery tickets", "Lend it to a friend with no plan"], c: 1, s: { investing: 2, strategy: 1 } },
  { q: "Your competitor drops prices 20%. What do you do?", a: ["Panic and close the business", "Add value instead of matching their price", "Drop prices even lower until you lose money", "Pretend it didn't happen"], c: 1, s: { strategy: 2, decision: 1 } },
  { q: "Best way to get your first 10 customers?", a: ["Wait for them to find you", "Tell friends, post on social media, offer a first-time deal", "Spend your entire budget on a billboard", "Lower your price to $0"], c: 1, s: { strategy: 2 } },
  { q: "You earned $200 this week. Smart split?", a: ["Spend it all on wants", "Save some, cover needs, then spend a little on wants", "Save every penny and never enjoy anything", "Give it all away"], c: 1, s: { budget: 2, saving: 1 } },
  { q: "Your food truck is slow on Mondays. Best fix?", a: ["Close on Mondays forever", "Try a Monday lunch deal to test demand", "Complain about it", "Move to a different city"], c: 1, s: { strategy: 2, decision: 1 } },
];

// ═══════════════════════════════════════════════════════════════
// DATA: PITCH FEATURES
// ═══════════════════════════════════════════════════════════════
const QUICK_REACTIONS = [
  { text: "Good job, I like this.", emoji: "👍", tone: "positive" },
  { text: "Something needs to be corrected.", emoji: "✏️", tone: "neutral" },
  { text: "Not bad.", emoji: "🤔", tone: "neutral" },
  { text: "Could use some improvement.", emoji: "📝", tone: "neutral" },
  { text: "I think you're on to something good, keep going.", emoji: "🌟", tone: "positive" },
  { text: "Great job!!", emoji: "🔥", tone: "positive" },
  { text: "5 stars!!", emoji: "⭐", tone: "positive" },
];

const BLOCKED_PATTERNS = [
  { pattern: /\b(stupid|dumb|idiot|moron|loser|lame|trash|garbage|worthless|pathetic|useless)\b/i, reason: "Insulting language isn't allowed. Try describing the issue instead." },
  { pattern: /\b(shut up|nobody cares|who cares|kill yourself|kys)\b/i, reason: "Dismissive or harmful phrases aren't allowed." },
  { pattern: /\b(ugly|hideous|disgusting|nasty)\b/i, reason: "Personal attacks on appearance aren't allowed." },
  { pattern: /\b(hate|despise) (you|this|it)\b/i, reason: "Try describing what specifically didn't work instead." },
  { pattern: /\b(suck|sucks|sucked)\b/i, reason: "Give a specific reason it didn't work for you." },
  { pattern: /(f+u+c+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|d+a+m+n+)/i, reason: "Profanity isn't allowed. Keep it constructive." },
];

const MOCK_OPPONENTS = [
  { name: "Tyler R.", avatar: "🧑‍💼", biz: "Food Truck", age: 14 },
  { name: "Maya J.", avatar: "👩‍💼", biz: "Sneaker Store", age: 15 },
  { name: "Chris W.", avatar: "🧑‍🎓", biz: "Vending Machines", age: 13 },
  { name: "Aisha B.", avatar: "👩‍🎓", biz: "Beauty Supply", age: 16 },
  { name: "Marcus L.", avatar: "🧑", biz: "T-Shirt Printing", age: 15 },
];

const OPPONENT_PITCH = {
  title: "Neighborhood Smoothie Bar",
  bullets: [
    "Low startup cost, high margins on blended drinks",
    "Target gyms, schools, and morning commuters",
    "Seasonal menu rotations to keep it fresh",
    "Loyalty app with a free smoothie after 10 visits",
  ],
  description: "A smoothie bar near a local gym and high school. Menu changes every season to match demand. Costs are low because the product is simple. Growth plan is to add a second location after 12 months of profit.",
};

const OPPONENT_FEEDBACK = {
  reaction: 4, // "I think you're on to something good, keep going."
  rating: 4,
  critique: "The bullet points are clear and I can tell you thought about the audience. The one thing I'd push on is the growth plan — how do you handle competition once other people copy the idea? Otherwise this is a strong pitch.",
};

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, stars = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        sp: Math.random() * 0.25 + 0.05,
        a: Math.random() * 0.4 + 0.2,
        p: Math.random() * 6.28,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.28);
        ctx.fillStyle = `rgba(200,180,255,${Math.max(0, s.a + Math.sin(t * 0.001 + s.p) * 0.1)})`;
        ctx.fill();
        s.y -= s.sp;
        if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

function Glass({ children, style, glow, onClick, accent }) {
  return (
    <div onClick={onClick} style={{
      background: "rgba(18,10,32,0.65)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: `1px solid ${accent || "rgba(160,120,255,0.15)"}`,
      borderRadius: 16,
      padding: 24,
      boxShadow: glow
        ? "0 0 30px rgba(160,100,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
        : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.2s",
      ...style,
    }}>{children}</div>
  );
}

function Bar({ pct, color = "#b47aff", h = 8 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: h, height: h, overflow: "hidden", width: "100%" }}>
      <div style={{
        width: `${Math.min(pct, 100)}%`,
        height: "100%",
        borderRadius: h,
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        transition: "width 0.6s ease",
      }} />
    </div>
  );
}

function Pill({ text, color = "#b47aff", active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px",
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      fontSize: 11,
      fontWeight: 600,
      background: active ? `${color}22` : "rgba(255,255,255,0.03)",
      color: active ? color : "rgba(255,255,255,0.35)",
      transition: "all 0.2s",
    }}>{text}</button>
  );
}

function Btn({ children, onClick, style, disabled, variant = "primary" }) {
  const variants = {
    primary: "linear-gradient(135deg, #b47aff, #f59e0b)",
    secondary: "rgba(180,122,255,0.08)",
    danger: "rgba(248,113,113,0.1)",
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "12px 24px",
      borderRadius: 12,
      border: variant === "primary" ? "none" : `1px solid ${variant === "secondary" ? "rgba(180,122,255,0.25)" : "rgba(248,113,113,0.25)"}`,
      cursor: disabled ? "not-allowed" : "pointer",
      background: variants[variant],
      color: variant === "primary" ? "#fff" : variant === "danger" ? "#f87171" : "#d4b4ff",
      fontSize: 13,
      fontWeight: 700,
      opacity: disabled ? 0.4 : 1,
      transition: "all 0.2s",
      ...style,
    }}>{children}</button>
  );
}

function StarRating({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{
              fontSize: size,
              background: "none",
              border: "none",
              cursor: "pointer",
              filter: active ? "none" : "grayscale(1) opacity(0.25)",
              transition: "all 0.15s",
              padding: 2,
            }}
          >⭐</button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: BUSINESS PICKER
// ═══════════════════════════════════════════════════════════════
function BusinessPicker({ onSelect, currentBiz }) {
  const [filter, setFilter] = useState("all");
  const cats = ["all", "food", "retail", "auto", "fashion", "beauty", "service", "tech", "passive", "creative"];
  const filtered = filter === "all" ? BUSINESSES : BUSINESSES.filter((b) => b.cat === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Glass style={{ borderLeft: "3px solid #b47aff" }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          Pick a business to run. Study how real companies operate, take quizzes on business thinking, play fast-paced money games, pitch your ideas head-to-head, and earn scores across six skill areas.
        </p>
      </Glass>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {cats.map((c) => (
          <Pill key={c} text={c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)} active={filter === c} onClick={() => setFilter(c)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {filtered.map((b) => {
          const isCurrent = currentBiz?.id === b.id;
          return (
            <Glass
              key={b.id}
              onClick={() => onSelect(b)}
              style={{ padding: 16, textAlign: "center", position: "relative" }}
              accent={isCurrent ? "rgba(180,122,255,0.4)" : "rgba(160,120,255,0.1)"}
            >
              {isCurrent && (
                <div style={{ position: "absolute", top: 6, right: 6, fontSize: 9, fontWeight: 700, color: "#d4b4ff", background: "rgba(180,122,255,0.2)", padding: "2px 6px", borderRadius: 4 }}>ACTIVE</div>
              )}
              <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 4, lineHeight: 1.3 }}>{b.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{b.startup}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 6 }}>
                {[1, 2, 3, 4, 5].map((d) => (
                  <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: d <= b.diff ? "#f59e0b" : "rgba(255,255,255,0.08)" }} />
                ))}
              </div>
            </Glass>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: BUSINESS ANALYSIS
// ═══════════════════════════════════════════════════════════════
function Analysis({ biz }) {
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
      <Glass glow>
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
      </Glass>

      {fields.map((f) => (
        <Glass key={f.label} style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, marginTop: 1 }}>{f.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#d4b4ff", marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{f.value}</div>
            </div>
          </div>
        </Glass>
      ))}

      <Glass>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e0c3ff", marginBottom: 10 }}>Strategy Features</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {["Competition Analysis", "Break-even Calculator", "Upsell & Bundle Strategy", "Local vs Online Sales", "Seasonal Demand Check", "Pricing Strategy", "Ad Channel Selection", "Customer Persona Builder", "Profit Margin Tracker", "Inventory Risk Meter"].map((s) => (
            <div key={s} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{s}</div>
          ))}
        </div>
      </Glass>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: QUIZ
// ═══════════════════════════════════════════════════════════════
function QuizMode({ onScore }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [res, setRes] = useState([]);
  const q = QUIZ_TOPICS[qi];
  const done = qi >= QUIZ_TOPICS.length;

  const pick = (i) => {
    if (sel !== null) return;
    setSel(i);
    const ok = i === q.correct;
    setRes([...res, { ok }]);
    if (ok) onScore(q.scores);
    setTimeout(() => { setSel(null); setQi(qi + 1); }, 1200);
  };

  if (done) {
    const cc = res.filter((r) => r.ok).length;
    return (
      <Glass glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Quiz Complete</div>
        <div style={{ fontSize: 16, color: "#fbbf24", fontWeight: 700, marginBottom: 16 }}>{cc} / {QUIZ_TOPICS.length} correct</div>
        <Bar pct={(cc / QUIZ_TOPICS.length) * 100} color={cc >= 7 ? "#4ade80" : "#f59e0b"} h={12} />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>
          {cc >= 8 ? "Outstanding business thinking. You're ready to run something." : cc >= 5 ? "Solid foundation. Keep learning and your scores will climb." : "Good start. Review the passages and try again to improve."}
        </p>
        <Btn onClick={() => { setQi(0); setRes([]); setSel(null); }} style={{ marginTop: 16 }}>Try Again</Btn>
      </Glass>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Question {qi + 1} of {QUIZ_TOPICS.length}</span>
        <span style={{ fontSize: 11, color: "#b47aff", fontWeight: 600 }}>{q.topic}</span>
      </div>
      <Bar pct={(qi / QUIZ_TOPICS.length) * 100} color="#b47aff" />
      <Glass style={{ borderLeft: "3px solid #f59e0b" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Read First</div>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>{q.passage}</p>
      </Glass>
      <Glass glow>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#e0c3ff", marginBottom: 16 }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((o, i) => {
            let bg = "rgba(255,255,255,0.03)", bd = "rgba(255,255,255,0.08)", cl = "rgba(255,255,255,0.75)";
            if (sel !== null) {
              if (i === q.correct) { bg = "rgba(74,222,128,0.12)"; bd = "rgba(74,222,128,0.3)"; cl = "#4ade80"; }
              else if (i === sel) { bg = "rgba(248,113,113,0.12)"; bd = "rgba(248,113,113,0.3)"; cl = "#f87171"; }
            }
            return (
              <button key={i} onClick={() => pick(i)} style={{
                padding: "14px 18px", borderRadius: 12, border: `1px solid ${bd}`, background: bg, color: cl,
                fontSize: 13, fontWeight: 500, textAlign: "left", cursor: sel === null ? "pointer" : "default",
                transition: "all 0.2s", lineHeight: 1.5, width: "100%",
              }}>
                <span style={{ fontWeight: 700, marginRight: 8, color: "rgba(255,255,255,0.3)" }}>{String.fromCharCode(65 + i)}.</span>{o}
              </button>
            );
          })}
        </div>
      </Glass>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: WHACK-A-MOLE GAME
// ═══════════════════════════════════════════════════════════════
function MoleGame({ onScore }) {
  const [qi, setQi] = useState(0);
  const [moles, setMoles] = useState([null, null, null, null]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [phase, setPhase] = useState("ready");
  const [flash, setFlash] = useState(null);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);
  const timerRef = useRef(null);
  const cq = MOLE_QS[qi % MOLE_QS.length];

  const spawn = useCallback(() => {
    const idx = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const cp = idx[0];
    const wa = cq.a.filter((_, i) => i !== cq.c).sort(() => Math.random() - 0.5);
    const m = [null, null, null, null];
    m[cp] = { text: cq.a[cq.c], correct: true, vis: true };
    let wi = 0;
    idx.slice(1).forEach((p) => { m[p] = { text: wa[wi++], correct: false, vis: true }; });
    setMoles(m);
  }, [cq]);

  const start = () => { setPhase("playing"); setScore(0); setTimer(30); setQi(0); setHits(0); setMiss(0); };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { setPhase("done"); clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => { if (phase === "playing") spawn(); }, [qi, phase, spawn]);

  const whack = (i) => {
    if (phase !== "playing" || !moles[i]) return;
    if (moles[i].correct) {
      setScore((s) => s + 100);
      setHits((h) => h + 1);
      setFlash("ok");
      if (cq.s) onScore(cq.s);
      setTimeout(() => { setFlash(null); setQi((q) => q + 1); }, 600);
    } else {
      setScore((s) => Math.max(0, s - 25));
      setMiss((m) => m + 1);
      setFlash("no");
      setTimeout(() => setFlash(null), 400);
    }
  };

  if (phase === "ready") return (
    <Glass glow style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔨</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#e0c3ff", marginBottom: 8 }}>Whack-a-Mole: Money Edition</div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>Read the question. Whack the correct answer. Wrong answers cost points. 30 seconds. Go.</p>
      <Btn onClick={start}>Start Game</Btn>
    </Glass>
  );

  if (phase === "done") return (
    <Glass glow style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{score >= 500 ? "🏆" : score >= 300 ? "🔥" : "💪"}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Game Over</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24", marginBottom: 16 }}>{score} pts</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20 }}>
        <div><div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>{hits}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Correct</div></div>
        <div><div style={{ fontSize: 18, fontWeight: 800, color: "#f87171" }}>{miss}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Wrong</div></div>
      </div>
      <Btn onClick={start}>Play Again</Btn>
    </Glass>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>{score} pts</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: timer <= 10 ? "#f87171" : "rgba(255,255,255,0.6)" }}>⏱ {timer}s</div>
      </div>
      <Glass style={{ borderLeft: `3px solid ${flash === "ok" ? "#4ade80" : flash === "no" ? "#f87171" : "#f59e0b"}`, transition: "border-color 0.2s" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", lineHeight: 1.6 }}>{cq.q}</div>
      </Glass>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {moles.map((m, i) => (
          <button key={i} onClick={() => whack(i)} style={{
            padding: 20, borderRadius: 16, border: "2px solid rgba(255,255,255,0.08)", minHeight: 100,
            background: m?.vis ? "rgba(18,10,32,0.8)" : "rgba(255,255,255,0.02)",
            cursor: m?.vis ? "pointer" : "default", transition: "all 0.15s",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            transform: m?.vis ? "scale(1)" : "scale(0.9)", opacity: m?.vis ? 1 : 0.3,
          }}>
            <div style={{ fontSize: 28 }}>{m?.vis ? "🟤" : "🕳️"}</div>
            {m?.vis && <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 1.4 }}>{m.text}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: SCORES DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Scores({ scores }) {
  const cats = [
    { k: "responsibility", l: "Responsibility", i: "🛡️", c: "#4ade80" },
    { k: "budget", l: "Budgeting", i: "📊", c: "#38bdf8" },
    { k: "saving", l: "Saving", i: "💰", c: "#f59e0b" },
    { k: "investing", l: "Investing", i: "📈", c: "#b47aff" },
    { k: "decision", l: "Decision-Making", i: "🧠", c: "#e879f9" },
    { k: "strategy", l: "Strategy", i: "♟️", c: "#f87171" },
  ];
  const mx = Math.max(...cats.map((c) => scores[c.k] || 0), 1);
  const total = cats.reduce((s, c) => s + (scores[c.k] || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Glass glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Total Score</div>
        <div style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #e0c3ff, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{total}</div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "8px 0 0" }}>Smart money habits build through repeated good decisions.</p>
      </Glass>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {cats.map((c) => (
          <Glass key={c.k} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{c.i}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.c }}>{c.l}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{scores[c.k] || 0}</div>
            <Bar pct={mx > 0 ? ((scores[c.k] || 0) / mx) * 100 : 0} color={c.c} h={6} />
          </Glass>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: CHALLENGE (Leaderboard)
// ═══════════════════════════════════════════════════════════════
function Challenge({ scores }) {
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const lb = [
    { name: "You", score: total, hl: true },
    { name: "Jordan M.", score: 42 },
    { name: "Aaliyah K.", score: 38 },
    { name: "DeShawn R.", score: 35 },
    { name: "Sofia L.", score: 28 },
  ].sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Glass style={{ borderLeft: "3px solid #e879f9" }}>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
          Challenge friends in your age group to see who scores highest on quizzes and games. Compete on business knowledge, not luck.
        </p>
      </Glass>
      <Glass glow>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Leaderboard</div>
        {lb.map((p, i) => (
          <div key={p.name} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            borderRadius: 10, marginBottom: 8,
            background: p.hl ? "rgba(180,122,255,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${p.hl ? "rgba(180,122,255,0.2)" : "rgba(255,255,255,0.05)"}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === 0 ? "linear-gradient(135deg,#f59e0b,#fbbf24)" : i === 1 ? "rgba(192,192,192,0.3)" : i === 2 ? "rgba(205,127,50,0.3)" : "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: i <= 2 ? "#fff" : "rgba(255,255,255,0.3)",
            }}>{i + 1}</div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: p.hl ? 700 : 500, color: p.hl ? "#d4b4ff" : "rgba(255,255,255,0.65)" }}>
              {p.name}{p.hl && <span style={{ fontSize: 10, color: "#b47aff" }}> (you)</span>}
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: p.hl ? "#fbbf24" : "rgba(255,255,255,0.5)" }}>{p.score}</span>
          </div>
        ))}
      </Glass>
      <Glass>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 12 }}>Send a Challenge</div>
        {sent ? (
          <div style={{ padding: 16, borderRadius: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>✅</div>
            <div style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>Challenge sent to {name}!</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>They'll try to beat your {total} points.</div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Friend's username" style={{ background: "none", border: "none", color: "#fff", fontSize: 13, width: "100%", outline: "none", fontFamily: "inherit" }} />
              </div>
              <Btn onClick={() => name && setSent(true)} style={{ whiteSpace: "nowrap" }} disabled={!name}>Challenge</Btn>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Same quiz and game set. Highest combined score wins.</p>
          </div>
        )}
      </Glass>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN: MUTUAL PITCH (the big one)
// ═══════════════════════════════════════════════════════════════
function MutualPitch({ selectedBiz, judgeMode, setJudgeMode, pitchRequestsOn, setPitchRequestsOn }) {
  const [phase, setPhase] = useState("lobby");
  const [pitchTime, setPitchTime] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [title, setTitle] = useState("");
  const [bullets, setBullets] = useState(["", "", "", ""]);
  const [body, setBody] = useState("");
  const [timer, setTimer] = useState(0);
  const [myReaction, setMyReaction] = useState(null);
  const [critique, setCritique] = useState("");
  const [critiqueError, setCritiqueError] = useState("");
  const [rating, setRating] = useState(0);
  const [critiqueSubmitted, setCritiqueSubmitted] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showWithdrawWarn, setShowWithdrawWarn] = useState(false);
  const [pitchBank, setPitchBank] = useState([
    { title: "Mobile Car Wash Service", bullets: ["Low startup, high demand", "Target apartment complexes", "Offer monthly subscriptions", "Upsell interior detailing"], date: "Jul 5, 2026", time: "3:22 PM", opponent: "Tyler R.", won: true },
    { title: "Custom Phone Case Shop", bullets: ["Online + local markets", "Partner with local artists", "Low inventory risk", "Social media marketing"], date: "Jun 28, 2026", time: "1:15 PM", opponent: "Maya J.", won: false },
  ]);
  const timerRef = useRef(null);

  const wordCount = body.split(/\s+/).filter(Boolean).length;

  const startMatching = (searchTerm) => {
    setPhase("matching");
    setTimeout(() => {
      if (searchTerm) {
        setOpponent({ name: searchTerm, avatar: "🧑", biz: "Their business idea", age: 14 });
      } else {
        setOpponent(MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)]);
      }
      setPhase("ready");
      setIsReady(false);
    }, 2000);
  };

  const startPitch = () => {
    setTimer(pitchTime * 60);
    setPhase("writing");
  };

  useEffect(() => {
    if (phase !== "writing") return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          submitPitch();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const submitPitch = () => {
    clearInterval(timerRef.current);
    const now = new Date();
    const newEntry = {
      title: title || "Untitled Pitch",
      bullets: bullets.filter(Boolean),
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      opponent: opponent?.name || "Unknown",
      won: null,
    };
    setPitchBank((prev) => [newEntry, ...prev]);
    setPhase("waiting");
    setTimeout(() => setPhase("review"), 2500);
  };

  const validateCritique = (text) => {
    if (!text.trim()) return "";
    for (const { pattern, reason } of BLOCKED_PATTERNS) {
      if (pattern.test(text)) return reason;
    }
    if (text.length > 500) return "Critique must be under 500 characters.";
    return "";
  };

  const handleCritique = (text) => {
    setCritique(text);
    setCritiqueError(validateCritique(text));
  };

  const submitFeedback = () => {
    if (critiqueError || !critique.trim() || !rating) return;
    setCritiqueSubmitted(true);
  };

  const resetPitch = () => {
    setPhase("lobby");
    setTitle("");
    setBullets(["", "", "", ""]);
    setBody("");
    setCritique("");
    setCritiqueError("");
    setRating(0);
    setCritiqueSubmitted(false);
    setMyReaction(null);
    setOpponent(null);
    setIsReady(false);
    setShowWithdrawWarn(false);
  };

  const revisePitch = () => {
    setPhase("writing");
    setTimer(pitchTime * 60);
    setCritique("");
    setCritiqueError("");
    setRating(0);
    setCritiqueSubmitted(false);
    setMyReaction(null);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ═══ LOBBY ═══
  if (phase === "lobby") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Glass glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎤</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Mutual Pitch</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 auto 20px", maxWidth: 420 }}>
          Pitch your business idea. Challenge another user's idea. Score the strongest concept. After both pitches are complete, private feedback unlocks for both sides at the same time.
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Choose pitch length</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[5, 10, 15].map((t) => (
              <button key={t} onClick={() => setPitchTime(t)} style={{
                padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 700,
                background: pitchTime === t ? "rgba(180,122,255,0.2)" : "rgba(255,255,255,0.03)",
                color: pitchTime === t ? "#d4b4ff" : "rgba(255,255,255,0.35)",
                transition: "all 0.2s",
              }}>{t} min</button>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>If your opponent picks a shorter time, the shorter time goes last.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
          <Btn onClick={() => startMatching(null)}>Find a Pitcher in My Age Group</Btn>
          <div style={{ display: "flex", gap: 6, alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "6px 10px 6px 14px" }}>
            <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Or search by username" style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => searchName && startMatching(searchName)} disabled={!searchName} style={{
              padding: "6px 12px", borderRadius: 8, border: "none", cursor: searchName ? "pointer" : "not-allowed",
              background: searchName ? "rgba(180,122,255,0.15)" : "rgba(255,255,255,0.03)",
              color: searchName ? "#d4b4ff" : "rgba(255,255,255,0.2)",
              fontSize: 11, fontWeight: 700, fontFamily: "inherit",
            }}>Send</button>
          </div>
          <button onClick={() => setPhase("history")} style={{
            padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(180,122,255,0.25)",
            background: "rgba(180,122,255,0.08)", color: "#d4b4ff", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>View Pitch Memory Bank</button>
        </div>
      </Glass>

      <Glass>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 12 }}>Pitch Rules</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "📝", text: "Include a title and bullet points for your business idea" },
            { icon: "📏", text: "500 word maximum for your pitch description" },
            { icon: "⏱️", text: "Both users agree on 5, 10, or 15 minute rounds" },
            { icon: "🔒", text: "Private feedback unlocks only after both pitches are done" },
            { icon: "🚫", text: "No cussing, name-calling, or insults — constructive only" },
            { icon: "📁", text: "Your pitch title, bullets, and date are saved. Full text is not." },
            { icon: "⚠️", text: "Withdraw mid-round and you get no feedback either way." },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 16 }}>{r.icon}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </Glass>

      <Glass>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 12 }}>Settings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Accept Pitch Requests</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Turn off to hide from matching</div>
            </div>
            <button onClick={() => setPitchRequestsOn(!pitchRequestsOn)} style={{
              width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
              background: pitchRequestsOn ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.06)",
              position: "relative", transition: "all 0.2s",
            }}>
              <div style={{
                position: "absolute", top: 2, left: pitchRequestsOn ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%",
                background: pitchRequestsOn ? "#4ade80" : "rgba(255,255,255,0.3)",
                transition: "all 0.2s",
              }} />
            </button>
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Judge Mode</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>For teachers or admins to review rounds</div>
            </div>
            <button onClick={() => setJudgeMode(!judgeMode)} style={{
              width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
              background: judgeMode ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)",
              position: "relative", transition: "all 0.2s",
            }}>
              <div style={{
                position: "absolute", top: 2, left: judgeMode ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%",
                background: judgeMode ? "#f59e0b" : "rgba(255,255,255,0.3)",
                transition: "all 0.2s",
              }} />
            </button>
          </label>
        </div>
      </Glass>

      {!pitchRequestsOn && (
        <Glass style={{ borderLeft: "3px solid #f87171" }}>
          <div style={{ fontSize: 12, color: "#f87171", fontWeight: 600, marginBottom: 4 }}>Pitch requests are off</div>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Turn them back on to receive incoming pitch challenges.</p>
        </Glass>
      )}
    </div>
  );

  // ═══ MATCHING ═══
  if (phase === "matching") return (
    <Glass glow style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 36, marginBottom: 16, animation: "pulseGlow 1.5s infinite" }}>🔍</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#e0c3ff", marginBottom: 8 }}>Finding a pitcher in your age group...</div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Matching you with someone ready to pitch</p>
      <style>{`@keyframes pulseGlow{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.95)}}`}</style>
    </Glass>
  );

  // ═══ READY ═══
  if (phase === "ready" && opponent) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Glass glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", marginBottom: 16 }}>✓ Match Found</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>🧑‍💼</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>You</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{selectedBiz?.name || "Your Business"}</div>
            {isReady && <div style={{ marginTop: 6, fontSize: 10, color: "#4ade80", fontWeight: 700 }}>✓ READY</div>}
          </div>
          <div style={{ fontSize: 24, color: "#f59e0b", fontWeight: 800 }}>VS</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>{opponent.avatar}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{opponent.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{opponent.biz}</div>
            <div style={{ marginTop: 6, fontSize: 10, color: "#4ade80", fontWeight: 700 }}>✓ READY</div>
          </div>
        </div>
        <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", marginBottom: 20, display: "inline-block" }}>
          <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 600 }}>⏱ {pitchTime} minute round</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!isReady ? (
            <Btn onClick={() => setIsReady(true)}>Mark Myself Ready</Btn>
          ) : (
            <>
              <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", fontSize: 12, color: "#4ade80" }}>
                Both players ready. Start when you're set.
              </div>
              <Btn onClick={startPitch}>Start Pitching</Btn>
            </>
          )}
          <button onClick={() => { setPhase("lobby"); setOpponent(null); }} style={{
            padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Cancel Match</button>
        </div>
      </Glass>
    </div>
  );

  // ═══ WRITING ═══
  if (phase === "writing") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>Your Pitch</div>
        <div style={{
          padding: "6px 14px", borderRadius: 8,
          background: timer <= 60 ? "rgba(248,113,113,0.15)" : "rgba(245,158,11,0.1)",
          border: `1px solid ${timer <= 60 ? "rgba(248,113,113,0.3)" : "rgba(245,158,11,0.2)"}`,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: timer <= 60 ? "#f87171" : "#fbbf24" }}>⏱ {formatTime(timer)}</span>
        </div>
      </div>

      <Glass glow>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6 }}>Pitch Title</div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name your business idea" maxLength={80} style={{
            width: "100%", padding: "12px 16px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
            color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
          }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 6 }}>Key Points (bullets)</div>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>•</span>
              <input type="text" value={b} onChange={(e) => { const n = [...bullets]; n[i] = e.target.value; setBullets(n); }} placeholder={`Point ${i + 1}`} maxLength={120} style={{
                flex: 1, padding: "8px 12px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
                color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit",
              }} />
              {bullets.length > 2 && (
                <button onClick={() => setBullets(bullets.filter((_, j) => j !== i))} style={{
                  padding: "4px 8px", background: "none", border: "none",
                  color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 14,
                }}>✕</button>
              )}
            </div>
          ))}
          {bullets.length < 6 && (
            <button onClick={() => setBullets([...bullets, ""])} style={{
              padding: "6px 14px", borderRadius: 8,
              border: "1px dashed rgba(255,255,255,0.1)", background: "none",
              color: "rgba(255,255,255,0.25)", fontSize: 11, cursor: "pointer", marginTop: 4,
            }}>+ Add point</button>
          )}
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Description</div>
            <div style={{ fontSize: 11, color: wordCount > 500 ? "#f87171" : wordCount > 400 ? "#facc15" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>{wordCount}/500 words</div>
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe your business idea — what it does, who it serves, why it works, and how you'd grow it..." rows={8} style={{
            width: "100%", padding: "14px 16px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
            color: "#fff", fontSize: 13, lineHeight: 1.7, outline: "none",
            fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
          }} />
        </div>
      </Glass>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={submitPitch} style={{ flex: 1 }} disabled={!title.trim() || wordCount > 500}>Submit Pitch</Btn>
        <Btn variant="danger" onClick={() => setShowWithdrawWarn(true)}>Withdraw</Btn>
      </div>

      {wordCount > 500 && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)" }}>
          <span style={{ fontSize: 12, color: "#f87171" }}>⚠ Over the 500 word limit. Trim your description before submitting.</span>
        </div>
      )}

      {showWithdrawWarn && (
        <Glass accent="rgba(248,113,113,0.3)">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>Withdraw from this round?</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 12 }}>
            If you back out now, you get no feedback and neither does {opponent?.name}. This is a commitment-based process.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { clearInterval(timerRef.current); resetPitch(); }} style={{
              flex: 1, padding: 10, borderRadius: 10, border: "1px solid rgba(248,113,113,0.3)",
              background: "rgba(248,113,113,0.08)", color: "#f87171",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Yes, Withdraw</button>
            <button onClick={() => setShowWithdrawWarn(false)} style={{
              flex: 1, padding: 10, borderRadius: 10, border: "1px solid rgba(180,122,255,0.25)",
              background: "rgba(180,122,255,0.08)", color: "#d4b4ff",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>Keep Pitching</button>
          </div>
        </Glass>
      )}
    </div>
  );

  // ═══ WAITING ═══
  if (phase === "waiting") return (
    <Glass glow style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 36, marginBottom: 16, animation: "pulseGlow 1.5s infinite" }}>⏳</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#e0c3ff", marginBottom: 8 }}>Pitch submitted!</div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Waiting for {opponent?.name || "your opponent"} to finish...</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>Feedback unlocks once both pitches are complete</p>
      <style>{`@keyframes pulseGlow{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.95)}}`}</style>
    </Glass>
  );

  // ═══ REVIEW ═══
  if (phase === "review") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {judgeMode && (
        <Glass style={{ borderLeft: "3px solid #f59e0b" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Judge Mode Active</div>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>You're reviewing this round as a moderator. Both pitches, reactions, ratings, and critiques are visible.</p>
        </Glass>
      )}

      <Glass glow>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 24 }}>{opponent?.avatar || "🧑‍💼"}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>{opponent?.name || "Opponent"}'s Pitch</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{opponent?.biz}</div>
          </div>
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>{OPPONENT_PITCH.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {OPPONENT_PITCH.bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{OPPONENT_PITCH.description}</p>
      </Glass>

      {!critiqueSubmitted ? (
        <>
          <Glass>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 12 }}>Quick Reaction</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {QUICK_REACTIONS.map((r, i) => (
                <button key={i} onClick={() => setMyReaction(i)} style={{
                  padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600,
                  background: myReaction === i ? (r.tone === "positive" ? "rgba(74,222,128,0.15)" : "rgba(250,204,21,0.15)") : "rgba(255,255,255,0.03)",
                  color: myReaction === i ? (r.tone === "positive" ? "#4ade80" : "#facc15") : "rgba(255,255,255,0.45)",
                  transition: "all 0.2s",
                }}>{r.emoji} {r.text}</button>
              ))}
            </div>
          </Glass>

          <Glass accent={critiqueError ? "rgba(248,113,113,0.3)" : "rgba(180,122,255,0.15)"}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>Private Constructive Feedback</div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, marginBottom: 12 }}>
              Your opponent won't see this until both reviews are submitted. Be honest and constructive.
            </p>
            <textarea value={critique} onChange={(e) => handleCritique(e.target.value)} placeholder="What worked well? What could be stronger? Any suggestions?" rows={4} style={{
              width: "100%", padding: "12px 16px", borderRadius: 10,
              border: `1px solid ${critiqueError ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.08)"}`,
              background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 13, lineHeight: 1.6,
              outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Blocks profanity, insults, and name-calling</div>
              <div style={{ fontSize: 10, color: critique.length > 400 ? "#facc15" : "rgba(255,255,255,0.3)" }}>{critique.length}/500</div>
            </div>
            {critiqueError && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#f87171" }}>⚠ {critiqueError}</span>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Rating (out of 5)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>{rating}/5</span>}
              </div>
            </div>

            <Btn onClick={submitFeedback} disabled={!!critiqueError || !critique.trim() || !rating} style={{ width: "100%" }}>Submit Feedback</Btn>
          </Glass>
        </>
      ) : (
        <>
          <Glass accent="rgba(74,222,128,0.2)">
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>Feedback Locked In</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Both sides submitted. Reveal below.</p>
            </div>
          </Glass>

          <Glass glow>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{opponent?.avatar}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e0c3ff" }}>{opponent?.name}'s Feedback for You</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Just unlocked</div>
              </div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Reaction</div>
              <div style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>{QUICK_REACTIONS[OPPONENT_FEEDBACK.reaction].emoji} {QUICK_REACTIONS[OPPONENT_FEEDBACK.reaction].text}</div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Rating</div>
              <div style={{ fontSize: 16, color: "#fbbf24", fontWeight: 800 }}>{"⭐".repeat(OPPONENT_FEEDBACK.rating)}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginLeft: 6 }}>{OPPONENT_FEEDBACK.rating}/5</span></div>
            </div>
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(180,122,255,0.06)", border: "1px solid rgba(180,122,255,0.15)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, fontWeight: 600 }}>Critique</div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{OPPONENT_FEEDBACK.critique}</p>
            </div>
          </Glass>

          <Glass>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e0c3ff", marginBottom: 10 }}>What's Next?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn onClick={revisePitch}>🔄 Revise & Repitch</Btn>
              <Btn variant="secondary" onClick={resetPitch}>New Pitch Round</Btn>
              <button onClick={() => setPhase("history")} style={{
                padding: "10px 20px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>View Memory Bank</button>
            </div>
          </Glass>
        </>
      )}
    </div>
  );

  // ═══ HISTORY (Memory Bank) ═══
  if (phase === "history") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>Pitch Memory Bank</div>
        <button onClick={() => setPhase("lobby")} style={{
          padding: "6px 14px", borderRadius: 8,
          border: "1px solid rgba(180,122,255,0.25)", background: "rgba(180,122,255,0.08)",
          color: "#d4b4ff", fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>← Back to Lobby</button>
      </div>
      <Glass style={{ borderLeft: "3px solid #b47aff" }}>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          Your pitch titles, bullet points, and timestamps are saved here. Full pitch text is not stored after submission — this encourages thoughtful preparation each round.
        </p>
      </Glass>
      {pitchBank.length === 0 ? (
        <Glass style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>No pitches yet. Start a round to build your history.</div>
        </Glass>
      ) : (
        pitchBank.map((p, i) => (
          <Glass key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>vs. {p.opponent}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{p.date}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{p.time}</div>
                {p.won !== null && (
                  <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: p.won ? "#4ade80" : "#f87171" }}>
                    {p.won ? "✓ Won" : "✕ Lost"}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {p.bullets.map((b, j) => (
                <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{b}</span>
                </div>
              ))}
            </div>
          </Glass>
        ))
      )}
    </div>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function BusinessSimulatorLab() {
  const [screen, setScreen] = useState("pick");
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [scores, setScores] = useState({ responsibility: 0, budget: 0, saving: 0, investing: 0, decision: 0, strategy: 0 });
  const [judgeMode, setJudgeMode] = useState(false);
  const [pitchRequestsOn, setPitchRequestsOn] = useState(true);

  const addScore = (s) => {
    if (!s) return;
    setScores((prev) => {
      const n = { ...prev };
      Object.entries(s).forEach(([k, v]) => { n[k] = (n[k] || 0) + v; });
      return n;
    });
  };

  const selectBiz = (b) => { setSelectedBiz(b); setScreen("analyze"); };
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const tabs = [
    { id: "pick", label: "Business", icon: "🏪" },
    { id: "analyze", label: "Analysis", icon: "🔍", dis: !selectedBiz },
    { id: "quiz", label: "Quiz", icon: "📝" },
    { id: "game", label: "Game", icon: "🎮" },
    { id: "pitch", label: "Pitch", icon: "🎤" },
    { id: "scores", label: "Scores", icon: "📊" },
    { id: "challenge", label: "Compete", icon: "⚔️" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0514 0%, #110a24 40%, #0d0820 100%)",
      color: "#fff",
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <Starfield />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#b47aff", textTransform: "uppercase", marginBottom: 8 }}>Club FLE</div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: "0 0 6px",
            background: "linear-gradient(135deg, #e0c3ff, #f59e0b, #fbbf24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Business Simulator Lab</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 460, marginInline: "auto", lineHeight: 1.5 }}>
            Pick a business. Study the strategy. Quiz. Game. Pitch head-to-head. Earn your scores.
          </p>
        </div>

        {/* ACTIVE BIZ + SCORE BANNER */}
        {selectedBiz && (
          <div style={{ display: "flex", gap: 12, margin: "16px 0", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: "rgba(180,122,255,0.1)", border: "1px solid rgba(180,122,255,0.2)", flex: 1 }}>
              <span style={{ fontSize: 18 }}>{selectedBiz.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#d4b4ff" }}>{selectedBiz.name}</span>
            </div>
            {judgeMode && (
              <div style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>⚖️ Judge</span>
              </div>
            )}
            <div style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>{total} pts</span>
            </div>
          </div>
        )}

        {/* TAB NAV */}
        <div style={{ display: "flex", gap: 3, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 3, overflowX: "auto" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => !t.dis && setScreen(t.id)}
              style={{
                flex: 1,
                padding: "10px 4px",
                borderRadius: 10,
                border: "none",
                cursor: t.dis ? "default" : "pointer",
                fontSize: 10,
                fontWeight: 600,
                transition: "all 0.2s",
                minWidth: 0,
                whiteSpace: "nowrap",
                background: screen === t.id ? "rgba(180,122,255,0.2)" : "transparent",
                color: t.dis ? "rgba(255,255,255,0.15)" : screen === t.id ? "#d4b4ff" : "rgba(255,255,255,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* SCREENS */}
        {screen === "pick" && <BusinessPicker onSelect={selectBiz} currentBiz={selectedBiz} />}
        {screen === "analyze" && selectedBiz && <Analysis biz={selectedBiz} />}
        {screen === "quiz" && <QuizMode onScore={addScore} />}
        {screen === "game" && <MoleGame onScore={addScore} />}
        {screen === "pitch" && <MutualPitch selectedBiz={selectedBiz} judgeMode={judgeMode} setJudgeMode={setJudgeMode} pitchRequestsOn={pitchRequestsOn} setPitchRequestsOn={setPitchRequestsOn} />}
        {screen === "scores" && <Scores scores={scores} />}
        {screen === "challenge" && <Challenge scores={scores} />}

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            Club FLE · Financial Literacy Extraordinaire
          </div>
        </div>
      </div>
    </div>
  );
}
