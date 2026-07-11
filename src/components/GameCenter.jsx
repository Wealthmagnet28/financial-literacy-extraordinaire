import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// GAME CENTER DATA
// ═══════════════════════════════════════════════════════════════

const AGE_GROUPS = {
  kids: { label: "Kids", icon: "🧒", color: "#4ade80", desc: "Ages 5–12", bg: "rgba(74,222,128,0.08)" },
  teens: { label: "Teens", icon: "🎓", color: "#38bdf8", desc: "Ages 13–17", bg: "rgba(56,189,248,0.08)" },
  adults: { label: "Adults", icon: "💼", color: "#f59e0b", desc: "Ages 18+", bg: "rgba(245,158,11,0.08)" },
};

const SKILL_AREAS = [
  { key: "responsibility", label: "Responsibility", icon: "🛡️", color: "#4ade80" },
  { key: "budgeting", label: "Budgeting", icon: "📊", color: "#38bdf8" },
  { key: "saving", label: "Saving", icon: "💰", color: "#f59e0b" },
  { key: "investing", label: "Investing", icon: "📈", color: "#b47aff" },
];

const GRADE_SCALE = [
  { label: "Wealth Master", min: 95, color: "#fbbf24", icon: "👑" },
  { label: "Guru", min: 86, color: "#b47aff", icon: "🧠" },
  { label: "Pro", min: 75, color: "#4ade80", icon: "⭐" },
  { label: "Advanced Beginner", min: 50, color: "#38bdf8", icon: "📘" },
  { label: "Novice", min: 0, color: "#f87171", icon: "🌱" },
];

function getGrade(pct) {
  return GRADE_SCALE.find(g => pct >= g.min) || GRADE_SCALE[GRADE_SCALE.length - 1];
}

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA — KIDS
// ═══════════════════════════════════════════════════════════════
const KIDS_QUIZZES = [
  { q: "You get $5 for helping at home. Should you spend it all on candy?", opts: ["Yes, candy is great!", "Save some and spend a little", "Give it all away", "Hide it under the bed forever"], correct: 1, skill: "saving", explain: "Saving some and spending a little is a smart balance." },
  { q: "Is a new toy a need or a want?", opts: ["A need", "A want", "Both", "Neither"], correct: 1, skill: "responsibility", explain: "Toys are wants. Needs are things like food, clothes, and a home." },
  { q: "What is a budget?", opts: ["A type of piggy bank", "A plan for how to use your money", "A game you play with coins", "A big number"], correct: 1, skill: "budgeting", explain: "A budget is a plan that helps you decide where your money goes." },
  { q: "What happens when you save money for a long time?", opts: ["It disappears", "It stays the same forever", "It can grow and help you buy bigger things", "Nothing happens"], correct: 2, skill: "saving", explain: "Saving over time means you can reach bigger goals." },
  { q: "You want a $20 toy but only have $10. What should you do?", opts: ["Take it anyway", "Save more money until you have $20", "Give up forever", "Ask for a loan from a stranger"], correct: 1, skill: "saving", explain: "Saving up until you have enough is the responsible choice." },
  { q: "Which of these is a need?", opts: ["Video game", "Warm jacket in winter", "Extra candy", "Stickers"], correct: 1, skill: "responsibility", explain: "A warm jacket keeps you safe — that's a need." },
  { q: "If you earn $3 and want to save half, how much do you save?", opts: ["$1", "$1.50", "$2", "$3"], correct: 1, skill: "budgeting", explain: "$3 divided in half is $1.50. Great math and great saving!" },
  { q: "Your friend wants you to spend all your money at the store. What do you do?", opts: ["Spend it all to make them happy", "Spend some and save the rest", "Tell them to spend their own money", "Run away"], correct: 1, skill: "responsibility", explain: "Spending some and saving the rest shows smart decision-making." },
  { q: "What does it mean to invest?", opts: ["Throw money away", "Put money into something that can grow over time", "Give money to your teacher", "Buy the most expensive thing"], correct: 1, skill: "investing", explain: "Investing means putting money somewhere it can grow." },
  { q: "You have $10. Food costs $4, a toy costs $5. What's the smart choice?", opts: ["Buy both and have $1 left", "Buy food first, then decide about the toy", "Buy the toy first", "Don't buy anything ever"], correct: 1, skill: "budgeting", explain: "Needs like food come first, then you decide on wants." },
  { q: "Why is it good to put coins in a piggy bank?", opts: ["Because piggy banks are cute", "Because it helps you save for something you want later", "Because coins are heavy", "Because adults told you to"], correct: 1, skill: "saving", explain: "Saving coins adds up over time toward a bigger goal." },
  { q: "If you break a friend's toy, what's the responsible thing to do?", opts: ["Pretend it didn't happen", "Offer to help fix or replace it", "Blame someone else", "Laugh about it"], correct: 1, skill: "responsibility", explain: "Taking responsibility and helping fix it is the right thing to do." },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA — TEENS
// ═══════════════════════════════════════════════════════════════
const TEENS_QUIZZES = [
  { q: "You earn $200 from your part-time job. How should you split it?", opts: ["Spend it all on clothes", "Save 50%, spend 30%, invest 20%", "Give it all to friends", "Put it all under your mattress"], correct: 1, skill: "budgeting", explain: "Splitting income between saving, spending, and investing builds strong money habits." },
  { q: "What is emergency savings for?", opts: ["Buying the latest phone", "Covering unexpected costs like a flat tire or doctor visit", "Going out with friends", "Investing in stocks"], correct: 1, skill: "saving", explain: "Emergency savings protects you from surprise expenses." },
  { q: "Which spending choice is smarter: $5 coffee every day or making coffee at home?", opts: ["$5 coffee — it tastes better", "Making it at home — it saves $100+ per month", "Neither — skip coffee entirely", "Buy the most expensive option always"], correct: 1, skill: "budgeting", explain: "$5/day = $150/month. Making coffee at home saves significant money." },
  { q: "What does investing help money do over time?", opts: ["Disappear faster", "Grow through compound interest and returns", "Stay exactly the same", "Lose value every year"], correct: 1, skill: "investing", explain: "Investing helps your money grow over time through compounding." },
  { q: "Why does credit need careful use?", opts: ["Because credit cards are free money", "Because borrowing too much leads to debt and interest payments", "Because banks want to be your friend", "Credit doesn't need careful use"], correct: 1, skill: "responsibility", explain: "Credit charges interest. Using it carelessly creates debt that's hard to escape." },
  { q: "You get a raise at work. What's the best move?", opts: ["Immediately upgrade your lifestyle", "Save the extra money and keep your current spending", "Quit your job to celebrate", "Lend it all to friends"], correct: 1, skill: "saving", explain: "Saving extra income instead of spending more is called 'avoiding lifestyle creep.'" },
  { q: "A friend asks you to invest in their 'guaranteed' business idea. What should you do?", opts: ["Give them all your savings", "Ask questions, research it, and only invest what you can afford to lose", "Say no to everything always", "Borrow money to invest more"], correct: 1, skill: "investing", explain: "Smart investors ask questions, research, and never invest more than they can lose." },
  { q: "You have $50 left for the week. A concert ticket costs $45. What do you do?", opts: ["Buy the ticket — you'll figure it out", "Skip it — $5 left for the week is too risky", "Borrow money from someone", "Sell your belongings to go"], correct: 1, skill: "budgeting", explain: "Spending almost everything leaves no room for food or emergencies." },
  { q: "What's the difference between a debit card and a credit card?", opts: ["They're the same thing", "Debit uses your money; credit is borrowed money you pay back later", "Credit cards are always better", "Debit cards charge more fees"], correct: 1, skill: "responsibility", explain: "Debit spends your own money. Credit borrows from the bank and charges interest." },
  { q: "Your phone breaks. You have $300 saved. A new phone costs $800. Best move?", opts: ["Buy the $800 phone on credit", "Get a cheaper phone or fix your current one", "Go without a phone for a year", "Borrow from everyone you know"], correct: 1, skill: "saving", explain: "Finding an affordable solution protects your savings and avoids debt." },
  { q: "What is compound interest?", opts: ["Interest that's hard to understand", "Earning interest on your interest over time", "A penalty from the bank", "A type of loan"], correct: 1, skill: "investing", explain: "Compound interest means your earnings generate more earnings over time." },
  { q: "You want to save $1,000 in 5 months. How much per month?", opts: ["$100", "$200", "$500", "$1,000"], correct: 1, skill: "budgeting", explain: "$1,000 ÷ 5 months = $200 per month. Breaking goals into steps makes them achievable." },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA — ADULTS
// ═══════════════════════════════════════════════════════════════
const ADULTS_QUIZZES = [
  { q: "How do you build a realistic monthly budget?", opts: ["Guess and hope for the best", "Track income, list fixed and variable expenses, then allocate savings and discretionary spending", "Only track big purchases", "Use last year's numbers without updating"], correct: 1, skill: "budgeting", explain: "A realistic budget starts with accurate income tracking and categorized expenses." },
  { q: "How do you compare risk and return on investments?", opts: ["Higher risk always means higher return", "Consider historical performance, diversification, and your timeline", "Avoid all risk entirely", "Pick whatever your friend recommends"], correct: 1, skill: "investing", explain: "Smart investing means weighing risk against potential returns relative to your goals and timeline." },
  { q: "What should happen before making an extra purchase?", opts: ["Check if it's on sale", "Confirm all essential bills and savings goals are covered first", "Ask social media for opinions", "Buy now, worry later"], correct: 1, skill: "responsibility", explain: "Essentials and savings come first. Extra spending uses what's left." },
  { q: "When should you increase your savings rate?", opts: ["Only when you feel like it", "After a raise, bonus, or when expenses decrease", "Never — your rate should stay fixed", "Only in January"], correct: 1, skill: "saving", explain: "Increases in income or decreases in expenses are opportunities to save more." },
  { q: "What money habit gives the best long-term result?", opts: ["Spending less than you earn and investing the difference consistently", "Timing the stock market perfectly", "Saving only in cash at home", "Waiting until you're older to start"], correct: 0, skill: "investing", explain: "Consistently spending less and investing the difference is the foundation of wealth building." },
  { q: "You receive a $5,000 bonus. Best allocation?", opts: ["Vacation immediately", "Pay high-interest debt, build emergency fund, then invest the rest", "Put it all in one stock", "Lend it to a family member"], correct: 1, skill: "budgeting", explain: "Prioritize: eliminate expensive debt, secure emergency savings, then invest." },
  { q: "Your car needs a $2,000 repair. You have $8,000 in savings. What do you do?", opts: ["Use a credit card and pay minimum payments", "Pay from savings and rebuild the fund over the next few months", "Ignore the problem", "Take out a personal loan"], correct: 1, skill: "saving", explain: "Using savings for emergencies is exactly what emergency funds are for. Then rebuild." },
  { q: "What is asset allocation?", opts: ["Putting all money in one place", "Dividing investments across stocks, bonds, and other assets based on goals and risk", "Only investing in real estate", "A banking fee"], correct: 1, skill: "investing", explain: "Diversifying across asset types reduces risk and aligns with your financial goals." },
  { q: "Your monthly income is $4,000. What percentage should go to housing?", opts: ["50% or more is fine", "Ideally 25-30% to leave room for other priorities", "It doesn't matter", "As little as possible, even if it means unsafe housing"], correct: 1, skill: "budgeting", explain: "The 25-30% guideline ensures housing doesn't crowd out savings, food, and other needs." },
  { q: "A co-worker suggests a 'can't-lose' investment opportunity. What do you do?", opts: ["Invest immediately before you miss out", "Research independently, verify credentials, and be skeptical of guaranteed returns", "Ask them to invest for you", "Ignore all investments"], correct: 1, skill: "responsibility", explain: "If it sounds too good to be true, it usually is. Always research independently." },
  { q: "What's the benefit of automating your savings?", opts: ["You don't have to think about money ever again", "Consistent saving happens before you can spend it, building discipline", "Banks give you extra interest for automating", "There's no real benefit"], correct: 1, skill: "saving", explain: "Automating removes the temptation to skip saving. Consistency builds wealth." },
  { q: "How should you handle multiple debts?", opts: ["Pay minimum on all and hope for the best", "Focus extra payments on highest-interest debt while maintaining minimums on others", "Ignore the smallest ones", "Consolidate everything into one bigger loan always"], correct: 1, skill: "responsibility", explain: "The avalanche method (highest interest first) saves the most money over time." },
];

// ═══════════════════════════════════════════════════════════════
// SCENARIO GAMES DATA
// ═══════════════════════════════════════════════════════════════
const KIDS_SCENARIOS = [
  { title: "🍦 Ice Cream Stand", story: "You have $6. Ice cream costs $3, and your friend asks to borrow $2. You also want to save for a book that costs $5.", question: "What should you do?", opts: [
    { text: "Buy ice cream and lend $2 (left: $1)", scores: { responsibility: 1, saving: 0, budgeting: 1 } },
    { text: "Buy ice cream and save $3 for the book", scores: { saving: 2, budgeting: 1, responsibility: 0 } },
    { text: "Save all $6 toward the book", scores: { saving: 3, budgeting: 0, responsibility: 0 } },
    { text: "Spend it all on ice cream for everyone", scores: { responsibility: 0, saving: 0, budgeting: 0 } },
  ], best: 1 },
  { title: "🎒 School Supply Shopping", story: "Mom gives you $15 for school supplies. You need a notebook ($3) and pencils ($2). You see a cool backpack for $12.", question: "What's the smartest choice?", opts: [
    { text: "Buy the backpack — it's so cool!", scores: { budgeting: 0, responsibility: 0, saving: 0 } },
    { text: "Buy supplies first, save the rest for later", scores: { budgeting: 2, responsibility: 2, saving: 1 } },
    { text: "Buy nothing and keep all the money", scores: { saving: 1, budgeting: 0, responsibility: 0 } },
    { text: "Buy supplies and the backpack by borrowing extra", scores: { responsibility: 0, budgeting: 0, saving: 0 } },
  ], best: 1 },
  { title: "🐕 Dog Walking Money", story: "You earn $4 each time you walk the neighbor's dog. After 3 walks, you have $12. Your goal is to save $20 for a game.", question: "How do you get there?", opts: [
    { text: "Spend $5 now and save the rest", scores: { saving: 1, budgeting: 1, responsibility: 0 } },
    { text: "Save all $12 and do 2 more walks to reach $20", scores: { saving: 3, responsibility: 2, budgeting: 1 } },
    { text: "Spend it all — you can earn more later", scores: { saving: 0, responsibility: 0, budgeting: 0 } },
    { text: "Ask your parents for the extra $8", scores: { responsibility: 0, saving: 0, budgeting: 0 } },
  ], best: 1 },
];

const TEENS_SCENARIOS = [
  { title: "💼 First Paycheck", story: "You just got your first paycheck: $280. Your phone bill is $40, you owe a friend $20, and you want new shoes ($90). You also want to start saving.", question: "How do you split it?", opts: [
    { text: "Pay bills ($60), shoes ($90), save the rest ($130)", scores: { budgeting: 2, responsibility: 2, saving: 1 } },
    { text: "Buy shoes first, deal with bills later", scores: { budgeting: 0, responsibility: 0, saving: 0 } },
    { text: "Save everything and skip the shoes", scores: { saving: 2, budgeting: 1, responsibility: 1 } },
    { text: "Pay bills, skip shoes, save $220", scores: { saving: 3, responsibility: 2, budgeting: 1 } },
  ], best: 0 },
  { title: "📱 Phone Upgrade Pressure", story: "Your phone works fine but everyone at school has the new model ($800). You have $500 saved for college. A friend says you can finance it for $50/month.", question: "What do you do?", opts: [
    { text: "Finance it — you'll figure out the payments", scores: { responsibility: 0, saving: 0, budgeting: 0 } },
    { text: "Keep your current phone — college savings matter more", scores: { responsibility: 3, saving: 2, budgeting: 1 } },
    { text: "Use college savings to buy it outright", scores: { responsibility: 0, saving: 0, budgeting: 0 } },
    { text: "Wait for a sale or buy a cheaper model", scores: { responsibility: 2, budgeting: 2, saving: 1 } },
  ], best: 1 },
  { title: "🎉 Prom vs Savings", story: "Prom is coming. Tickets ($60), outfit ($150), dinner ($40), photos ($30). Total: $280. You have $400 saved and earn $100/week at work.", question: "How do you handle it?", opts: [
    { text: "Spend from savings and rebuild over 3 weeks", scores: { budgeting: 2, responsibility: 1, saving: 1 } },
    { text: "Save up from paychecks over the next 3 weeks, don't touch savings", scores: { saving: 3, budgeting: 2, responsibility: 1 } },
    { text: "Skip prom to protect savings", scores: { saving: 2, budgeting: 0, responsibility: 0 } },
    { text: "Borrow money and deal with it later", scores: { responsibility: 0, saving: 0, budgeting: 0 } },
  ], best: 1 },
];

const ADULTS_SCENARIOS = [
  { title: "🏥 Medical Emergency", story: "Your car breaks down ($1,800 repair) the same week you get a $400 medical bill. You have $5,000 in emergency savings, earn $3,500/month, and your monthly expenses are $2,800.", question: "What's your plan?", opts: [
    { text: "Pay both from emergency fund ($2,200), rebuild over 4 months", scores: { responsibility: 3, saving: 2, budgeting: 2 } },
    { text: "Put everything on credit cards", scores: { responsibility: 0, saving: 0, budgeting: 0 } },
    { text: "Pay car repair, negotiate a payment plan for medical", scores: { responsibility: 2, budgeting: 2, saving: 1 } },
    { text: "Ignore the medical bill and only fix the car", scores: { responsibility: 0, budgeting: 0, saving: 0 } },
  ], best: 0 },
  { title: "📈 Investment Opportunity", story: "A colleague recommends a stock that doubled last year. You have $10,000 in investments (diversified) and $2,000 in extra savings. Your emergency fund is fully funded.", question: "What do you do?", opts: [
    { text: "Put all $2,000 into that one stock", scores: { investing: 0, responsibility: 0 } },
    { text: "Research it, invest $500 max as part of a diversified approach", scores: { investing: 3, responsibility: 2, budgeting: 1 } },
    { text: "Ignore it — all investments are too risky", scores: { investing: 0, responsibility: 1 } },
    { text: "Take money from emergency fund to invest more", scores: { investing: 0, responsibility: 0, saving: 0 } },
  ], best: 1 },
  { title: "💰 Raise Decision", story: "You get a 15% raise, adding $600/month to your income. Your current budget is balanced. You've been wanting to upgrade your apartment ($400/month more) and invest more.", question: "Best allocation of the extra $600?", opts: [
    { text: "Upgrade apartment ($400), spend the rest ($200)", scores: { budgeting: 0, saving: 0, investing: 0 } },
    { text: "Save $200, invest $300, add $100 to fun money", scores: { saving: 2, investing: 3, budgeting: 2, responsibility: 1 } },
    { text: "Invest all $600", scores: { investing: 2, saving: 0, budgeting: 1 } },
    { text: "Spend it all — you earned it", scores: { responsibility: 0, budgeting: 0, saving: 0 } },
  ], best: 1 },
];

// ═══════════════════════════════════════════════════════════════
// SORTING GAME DATA
// ═══════════════════════════════════════════════════════════════
const KIDS_SORT = {
  title: "Need, Want, Share",
  instruction: "Tap each item to sort it into the right group.",
  categories: ["Need", "Want", "Share"],
  items: [
    { text: "Warm coat", cat: "Need", icon: "🧥" },
    { text: "Video game", cat: "Want", icon: "🎮" },
    { text: "Lunch food", cat: "Need", icon: "🥪" },
    { text: "Toy robot", cat: "Want", icon: "🤖" },
    { text: "Help a friend", cat: "Share", icon: "🤝" },
    { text: "School books", cat: "Need", icon: "📚" },
    { text: "Candy", cat: "Want", icon: "🍬" },
    { text: "Donate to charity", cat: "Share", icon: "💝" },
    { text: "Water bottle", cat: "Need", icon: "💧" },
    { text: "Stickers", cat: "Want", icon: "⭐" },
    { text: "Give old toys", cat: "Share", icon: "🧸" },
    { text: "Shoes that fit", cat: "Need", icon: "👟" },
  ],
};

const TEENS_SORT = {
  title: "Smart vs Risky Spending",
  instruction: "Sort each money decision as Smart or Risky.",
  categories: ["Smart", "Risky"],
  items: [
    { text: "Save 20% of each paycheck", cat: "Smart", icon: "✅" },
    { text: "Max out a credit card on clothes", cat: "Risky", icon: "💳" },
    { text: "Build an emergency fund", cat: "Smart", icon: "🛡️" },
    { text: "Lend all savings to a friend", cat: "Risky", icon: "⚠️" },
    { text: "Compare prices before buying", cat: "Smart", icon: "🔍" },
    { text: "Buy now, think later", cat: "Risky", icon: "🛒" },
    { text: "Track monthly expenses", cat: "Smart", icon: "📊" },
    { text: "Ignore bills until they're overdue", cat: "Risky", icon: "📬" },
    { text: "Set a weekly spending limit", cat: "Smart", icon: "🎯" },
    { text: "Invest money you need for rent", cat: "Risky", icon: "🏠" },
  ],
};

const ADULTS_SORT = {
  title: "Invest vs Avoid",
  instruction: "Sort each opportunity as Worth Investing or Avoid.",
  categories: ["Worth Investing", "Avoid"],
  items: [
    { text: "Diversified index fund", cat: "Worth Investing", icon: "📈" },
    { text: "'Guaranteed' 50% returns", cat: "Avoid", icon: "🚩" },
    { text: "401k with employer match", cat: "Worth Investing", icon: "🏢" },
    { text: "Crypto tip from stranger online", cat: "Avoid", icon: "⚠️" },
    { text: "High-yield savings account", cat: "Worth Investing", icon: "🏦" },
    { text: "MLM 'business opportunity'", cat: "Avoid", icon: "🔴" },
    { text: "Roth IRA contributions", cat: "Worth Investing", icon: "📋" },
    { text: "Borrowing to invest in meme stocks", cat: "Avoid", icon: "🎰" },
    { text: "Real estate with research", cat: "Worth Investing", icon: "🏡" },
    { text: "Pyramid scheme disguised as investing", cat: "Avoid", icon: "🚫" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// TIMED CHALLENGE DATA
// ═══════════════════════════════════════════════════════════════
const KIDS_TIMED = [
  { q: "Is a raincoat a need or a want?", a: "Need", opts: ["Need", "Want"], skill: "responsibility" },
  { q: "You have $3. A toy costs $5. Can you buy it?", a: "No", opts: ["Yes", "No"], skill: "budgeting" },
  { q: "Saving money means keeping it for ___.", a: "Later", opts: ["Later", "Never"], skill: "saving" },
  { q: "If you put $1 in a jar every day for a week, how much do you have?", a: "$7", opts: ["$5", "$7"], skill: "saving" },
  { q: "Should you spend money you're saving for something important?", a: "No", opts: ["Yes", "No"], skill: "responsibility" },
  { q: "What grows when you leave money in a savings account?", a: "Interest", opts: ["Interest", "Nothing"], skill: "investing" },
  { q: "Is electricity for your house a need?", a: "Yes", opts: ["Yes", "No"], skill: "responsibility" },
  { q: "You have $10 and spend $4. How much is left?", a: "$6", opts: ["$6", "$4"], skill: "budgeting" },
];

const TEENS_TIMED = [
  { q: "You earn $500/month. 50% to needs, 30% to wants, 20% to savings. How much do you save?", a: "$100", opts: ["$100", "$150"], skill: "budgeting" },
  { q: "Credit card interest is money you ___ the bank.", a: "Owe", opts: ["Owe", "Earn"], skill: "responsibility" },
  { q: "Emergency fund should cover ___ months of expenses.", a: "3–6", opts: ["1", "3–6"], skill: "saving" },
  { q: "Compound interest earns interest on your ___.", a: "Interest", opts: ["Principal only", "Interest"], skill: "investing" },
  { q: "A 10% return on $100 after 1 year gives you ___.", a: "$110", opts: ["$110", "$100"], skill: "investing" },
  { q: "Should you invest your emergency fund?", a: "No", opts: ["Yes", "No"], skill: "responsibility" },
  { q: "Inflation means prices go ___ over time.", a: "Up", opts: ["Up", "Down"], skill: "investing" },
  { q: "Paying only minimum on credit cards is ___.", a: "Expensive", opts: ["Smart", "Expensive"], skill: "budgeting" },
];

const ADULTS_TIMED = [
  { q: "The 50/30/20 rule: 50% needs, 30% wants, 20% ___.", a: "Savings", opts: ["Savings", "Taxes"], skill: "budgeting" },
  { q: "Dollar-cost averaging means investing ___ amounts regularly.", a: "Fixed", opts: ["Fixed", "Random"], skill: "investing" },
  { q: "High-yield savings accounts are best for ___ goals.", a: "Short-term", opts: ["Short-term", "30-year"], skill: "saving" },
  { q: "Diversification means spreading risk across ___ investments.", a: "Multiple", opts: ["Multiple", "One"], skill: "investing" },
  { q: "Net worth = assets minus ___.", a: "Liabilities", opts: ["Liabilities", "Income"], skill: "budgeting" },
  { q: "An emergency fund should be in a ___ account.", a: "Liquid", opts: ["Liquid", "Locked"], skill: "saving" },
  { q: "Employer 401k match is essentially ___ money.", a: "Free", opts: ["Free", "Borrowed"], skill: "investing" },
  { q: "Lifestyle creep happens when spending rises with ___.", a: "Income", opts: ["Income", "Debt"], skill: "responsibility" },
];

// ═══════════════════════════════════════════════════════════════
// MATCHING GAME DATA
// ═══════════════════════════════════════════════════════════════
const KIDS_MATCHES = [
  { term: "Budget", def: "A plan for your money" },
  { term: "Saving", def: "Keeping money for later" },
  { term: "Need", def: "Something you must have" },
  { term: "Want", def: "Something nice but not required" },
  { term: "Earn", def: "Getting money for work" },
  { term: "Spend", def: "Using money to buy things" },
];

const TEENS_MATCHES = [
  { term: "Interest", def: "Money paid for borrowing or saving" },
  { term: "Credit Score", def: "A number showing how reliable you are with money" },
  { term: "Inflation", def: "Prices going up over time" },
  { term: "Debt", def: "Money you owe someone" },
  { term: "Investment", def: "Putting money into something to grow it" },
  { term: "Diversify", def: "Spreading money across different options" },
];

const ADULTS_MATCHES = [
  { term: "Asset Allocation", def: "Dividing investments by type and risk" },
  { term: "Compound Interest", def: "Earning returns on your returns" },
  { term: "Liquidity", def: "How quickly an asset becomes cash" },
  { term: "Net Worth", def: "Total assets minus total debts" },
  { term: "Dollar-Cost Averaging", def: "Investing fixed amounts at regular intervals" },
  { term: "Emergency Fund", def: "Savings reserved for unexpected expenses" },
];

// ═══════════════════════════════════════════════════════════════
// BADGE DATA
// ═══════════════════════════════════════════════════════════════
const BADGES = [
  { id: "first_quiz", icon: "🌟", name: "First Quiz", desc: "Complete your first quiz", check: s => s.quizzesCompleted >= 1 },
  { id: "five_quizzes", icon: "📝", name: "Quiz Pro", desc: "Complete 5 quizzes", check: s => s.quizzesCompleted >= 5 },
  { id: "first_game", icon: "🎮", name: "Game On", desc: "Complete your first game", check: s => s.gamesCompleted >= 1 },
  { id: "perfect_score", icon: "💯", name: "Perfect Round", desc: "Get 100% on any activity", check: s => s.perfectRounds >= 1 },
  { id: "all_skills", icon: "🏆", name: "Well Rounded", desc: "Score points in all 4 skill areas", check: s => s.responsibility > 0 && s.budgeting > 0 && s.saving > 0 && s.investing > 0 },
  { id: "pro_rank", icon: "⭐", name: "Pro Status", desc: "Reach Pro rank overall", check: s => getGrade(calcOverallPct(s)).label === "Pro" || getGrade(calcOverallPct(s)).min >= 75 },
  { id: "streak_3", icon: "🔥", name: "On Fire", desc: "Complete 3 activities in a row", check: s => s.streak >= 3 },
  { id: "guru", icon: "🧠", name: "Guru Mind", desc: "Reach Guru rank", check: s => calcOverallPct(s) >= 86 },
];

function calcOverallPct(scores) {
  const maxPossible = Math.max((scores.quizzesCompleted || 0) * 3 + (scores.gamesCompleted || 0) * 3, 1) * 4;
  const total = (scores.responsibility || 0) + (scores.budgeting || 0) + (scores.saving || 0) + (scores.investing || 0);
  return Math.min(Math.round((total / Math.max(maxPossible, 1)) * 100), 100) || 0;
}

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

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

function ProgressBar({ pct, color = "#b47aff", h = 8 }) {
  return <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: h, height: h, overflow: "hidden", width: "100%" }}><div style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, height: "100%", borderRadius: h, background: `linear-gradient(90deg,${color},${color}88)`, transition: "width 0.6s" }} /></div>;
}

// ═══════════════════════════════════════════════════════════════
// QUIZ SCREEN
// ═══════════════════════════════════════════════════════════════
function QuizScreen({ quizzes, onComplete, ageColor }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const q = quizzes[idx];
  const done = idx >= quizzes.length;

  const pick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.correct;
    setResults(prev => [...prev, { correct, skill: q.skill }]);
    setTimeout(() => { setSelected(null); setIdx(idx + 1); }, 1400);
  };

  if (done) {
    const correctCount = results.filter(r => r.correct).length;
    const pct = Math.round((correctCount / quizzes.length) * 100);
    const grade = getGrade(pct);
    const skillScores = {};
    results.forEach(r => { if (r.correct) skillScores[r.skill] = (skillScores[r.skill] || 0) + 2; });
    return (
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{grade.icon}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Quiz Complete!</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: grade.color, marginBottom: 4 }}>{grade.label}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#fbbf24", marginBottom: 16 }}>{correctCount}/{quizzes.length} correct ({pct}%)</div>
        <ProgressBar pct={pct} color={grade.color} h={12} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, margin: "20px 0" }}>
          {SKILL_AREAS.map(s => (
            <div key={s.key} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{skillScores[s.key] || 0}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "12px 0" }}>
          {pct >= 80 ? "Outstanding work! You really know your stuff." : pct >= 60 ? "Good foundation! Review the ones you missed to level up." : "Keep practicing — every question teaches you something new."}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setIdx(0); setResults([]); }} style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(180,122,255,0.3)", background: "rgba(180,122,255,0.1)", color: "#d4b4ff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry Quiz</button>
          <button onClick={() => onComplete(skillScores, pct === 100)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue</button>
        </div>
      </G>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Question {idx + 1} of {quizzes.length}</span>
        <span style={{ fontSize: 11, color: ageColor, fontWeight: 600 }}>{SKILL_AREAS.find(s => s.key === q.skill)?.icon} {q.skill}</span>
      </div>
      <ProgressBar pct={(idx / quizzes.length) * 100} color={ageColor} />
      <G glow>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e0c3ff", marginBottom: 18, lineHeight: 1.6 }}>{q.q}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.opts.map((opt, i) => {
            let bg = "rgba(255,255,255,0.03)", border = "rgba(255,255,255,0.08)", color = "rgba(255,255,255,0.75)";
            if (selected !== null) {
              if (i === q.correct) { bg = "rgba(74,222,128,0.12)"; border = "rgba(74,222,128,0.3)"; color = "#4ade80"; }
              else if (i === selected) { bg = "rgba(248,113,113,0.12)"; border = "rgba(248,113,113,0.3)"; color = "#f87171"; }
            }
            return (
              <button key={i} onClick={() => pick(i)} style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 14, fontWeight: 500, textAlign: "left", cursor: selected === null ? "pointer" : "default", transition: "all 0.2s", lineHeight: 1.5, width: "100%" }}>
                <span style={{ fontWeight: 700, marginRight: 8, color: "rgba(255,255,255,0.3)" }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 10, background: selected === q.correct ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${selected === q.correct ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)"}` }}>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>💡 {q.explain}</p>
          </div>
        )}
      </G>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCENARIO GAME SCREEN
// ═══════════════════════════════════════════════════════════════
function ScenarioScreen({ scenarios, onComplete, ageColor }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalScores, setTotalScores] = useState({});
  const sc = scenarios[idx];
  const done = idx >= scenarios.length;

  const pick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const scores = sc.opts[i].scores;
    setTotalScores(prev => {
      const n = { ...prev };
      Object.entries(scores).forEach(([k, v]) => { n[k] = (n[k] || 0) + v; });
      return n;
    });
    setTimeout(() => { setSelected(null); setIdx(idx + 1); }, 1800);
  };

  if (done) {
    const total = Object.values(totalScores).reduce((a, b) => a + b, 0);
    const maxPossible = scenarios.length * 8;
    const pct = Math.round((total / maxPossible) * 100);
    const grade = getGrade(pct);
    return (
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Scenarios Complete!</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: grade.color }}>{grade.label} — {pct}%</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, margin: "20px 0" }}>
          {SKILL_AREAS.map(s => (
            <div key={s.key} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{totalScores[s.key] || 0}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "12px 0" }}>
          {pct >= 80 ? "Excellent decision-making! You handled those scenarios like a pro." : pct >= 50 ? "Good instincts. Review the tougher scenarios to sharpen your skills." : "Real-world choices are tricky. Practice makes progress!"}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setIdx(0); setSelected(null); setTotalScores({}); }} style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(180,122,255,0.3)", background: "rgba(180,122,255,0.1)", color: "#d4b4ff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
          <button onClick={() => onComplete(totalScores, pct === 100)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue</button>
        </div>
      </G>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Scenario {idx + 1} of {scenarios.length}</span>
      </div>
      <ProgressBar pct={(idx / scenarios.length) * 100} color={ageColor} />
      <G style={{ borderLeft: `3px solid ${ageColor}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e0c3ff", marginBottom: 8 }}>{sc.title}</div>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{sc.story}</p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fbbf24" }}>{sc.question}</p>
      </G>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sc.opts.map((opt, i) => {
          let bg = "rgba(255,255,255,0.03)", border = "rgba(255,255,255,0.08)", color = "rgba(255,255,255,0.75)";
          if (selected !== null) {
            if (i === sc.best) { bg = "rgba(74,222,128,0.12)"; border = "rgba(74,222,128,0.3)"; color = "#4ade80"; }
            else if (i === selected && i !== sc.best) { bg = "rgba(248,113,113,0.08)"; border = "rgba(248,113,113,0.2)"; color = "#f87171"; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ padding: "14px 18px", borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 13, fontWeight: 500, textAlign: "left", cursor: selected === null ? "pointer" : "default", transition: "all 0.2s", lineHeight: 1.5, width: "100%" }}>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SORTING GAME SCREEN
// ═══════════════════════════════════════════════════════════════
function SortingScreen({ data, onComplete, ageColor }) {
  const [items, setItems] = useState(() => [...data.items].sort(() => Math.random() - 0.5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sorted, setSorted] = useState({});
  const [flash, setFlash] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const done = currentIdx >= items.length;

  const sortItem = (cat) => {
    if (done) return;
    const item = items[currentIdx];
    const correct = item.cat === cat;
    if (correct) setCorrectCount(c => c + 1);
    setFlash(correct ? "correct" : "wrong");
    setSorted(prev => ({ ...prev, [currentIdx]: { cat, correct } }));
    setTimeout(() => { setFlash(null); setCurrentIdx(currentIdx + 1); }, 600);
  };

  if (done) {
    const pct = Math.round((correctCount / items.length) * 100);
    const grade = getGrade(pct);
    const skillScores = { responsibility: Math.round(correctCount * 0.8), budgeting: Math.round(correctCount * 0.6), saving: Math.round(correctCount * 0.4) };
    return (
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Sorting Complete!</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: grade.color }}>{grade.label} — {correctCount}/{items.length} ({pct}%)</div>
        <ProgressBar pct={pct} color={grade.color} h={12} />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "16px 0" }}>
          {pct >= 80 ? "Great sorting skills! You clearly know the difference." : "Keep practicing — knowing the difference is the first step to smart money decisions."}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setItems([...data.items].sort(() => Math.random() - 0.5)); setCurrentIdx(0); setSorted({}); setCorrectCount(0); }} style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(180,122,255,0.3)", background: "rgba(180,122,255,0.1)", color: "#d4b4ff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
          <button onClick={() => onComplete(skillScores, pct === 100)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue</button>
        </div>
      </G>
    );
  }

  const item = items[currentIdx];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 4 }}>{data.title}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{data.instruction}</div>
      </div>
      <ProgressBar pct={(currentIdx / items.length) * 100} color={ageColor} />
      <G glow style={{ textAlign: "center", borderColor: flash === "correct" ? "rgba(74,222,128,0.3)" : flash === "wrong" ? "rgba(248,113,113,0.3)" : undefined, transition: "border-color 0.2s" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>{item.icon}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{item.text}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Item {currentIdx + 1} of {items.length}</div>
      </G>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.categories.length}, 1fr)`, gap: 10 }}>
        {data.categories.map(cat => (
          <button key={cat} onClick={() => sortItem(cat)} style={{ padding: "18px 12px", borderRadius: 14, border: "2px solid rgba(180,122,255,0.2)", background: "rgba(18,10,32,0.8)", color: "#d4b4ff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMED CHALLENGE SCREEN
// ═══════════════════════════════════════════════════════════════
function TimedScreen({ questions, onComplete, ageColor }) {
  const [idx, setIdx] = useState(0);
  const [timer, setTimer] = useState(45);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("ready");
  const [flash, setFlash] = useState(null);
  const timerRef = useRef(null);
  const done = idx >= questions.length || timer <= 0;

  const start = () => { setPhase("playing"); setIdx(0); setScore(0); setTimer(45); };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { setPhase("done"); clearInterval(timerRef.current); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && idx >= questions.length) { setPhase("done"); clearInterval(timerRef.current); }
  }, [idx, phase, questions.length]);

  const pick = (opt) => {
    if (phase !== "playing") return;
    const q = questions[idx];
    if (opt === q.a) { setScore(s => s + 1); setFlash("correct"); }
    else { setFlash("wrong"); }
    setTimeout(() => { setFlash(null); setIdx(i => i + 1); }, 500);
  };

  if (phase === "ready") return (
    <G glow style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#e0c3ff", marginBottom: 8 }}>Timed Challenge</div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>Answer as many questions as you can before time runs out. Quick thinking, smart choices!</p>
      <button onClick={start} style={{ padding: "14px 36px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 15, fontWeight: 700 }}>Start Challenge</button>
    </G>
  );

  if (phase === "done") {
    const pct = Math.round((score / questions.length) * 100);
    const grade = getGrade(pct);
    const skillScores = {};
    questions.slice(0, idx).forEach((q, i) => { if (i < score) skillScores[q.skill] = (skillScores[q.skill] || 0) + 1; });
    return (
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{grade.icon}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>Time's Up!</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>{score}/{questions.length}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: grade.color }}>{grade.label} ({pct}%)</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={start} style={{ padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(180,122,255,0.3)", background: "rgba(180,122,255,0.1)", color: "#d4b4ff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
          <button onClick={() => onComplete(skillScores, pct === 100)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue</button>
        </div>
      </G>
    );
  }

  const q = questions[idx];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>{score} pts</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: timer <= 10 ? "#f87171" : "rgba(255,255,255,0.6)" }}>⏱ {timer}s</div>
      </div>
      <ProgressBar pct={(timer / 45) * 100} color={timer <= 10 ? "#f87171" : ageColor} />
      <G style={{ borderLeft: `3px solid ${flash === "correct" ? "#4ade80" : flash === "wrong" ? "#f87171" : ageColor}`, transition: "border-color 0.2s" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#e0c3ff", lineHeight: 1.6 }}>{q.q}</div>
      </G>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.opts.map(opt => (
          <button key={opt} onClick={() => pick(opt)} style={{ padding: "18px 14px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.08)", background: "rgba(18,10,32,0.8)", color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MATCHING GAME SCREEN
// ═══════════════════════════════════════════════════════════════
function MatchingScreen({ pairs, onComplete, ageColor }) {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const shuffledDefs = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), [pairs]);
  const done = matched.length === pairs.length;

  const pickDef = (def, defIdx) => {
    if (selectedTerm === null || done) return;
    const pair = pairs[selectedTerm];
    if (pair.def === def) {
      setMatched(prev => [...prev, selectedTerm]);
      setSelectedTerm(null);
    } else {
      setWrong(defIdx);
      setTimeout(() => { setWrong(null); setSelectedTerm(null); }, 600);
    }
  };

  if (done) {
    const skillScores = { responsibility: 2, budgeting: 2, saving: 2, investing: 2 };
    return (
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#e0c3ff", marginBottom: 6 }}>All Matched!</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "12px 0" }}>Great work connecting terms to their definitions!</p>
        <button onClick={() => onComplete(skillScores, true)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#b47aff,#f59e0b)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue</button>
      </G>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff" }}>Match the Term</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Tap a term, then tap its definition</div>
      </div>
      <ProgressBar pct={(matched.length / pairs.length) * 100} color={ageColor} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Terms</div>
          {pairs.map((p, i) => (
            <button key={i} onClick={() => !matched.includes(i) && setSelectedTerm(i)} style={{
              padding: "12px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: "left", cursor: matched.includes(i) ? "default" : "pointer", width: "100%", transition: "all 0.2s",
              background: matched.includes(i) ? "rgba(74,222,128,0.08)" : selectedTerm === i ? "rgba(180,122,255,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${matched.includes(i) ? "rgba(74,222,128,0.2)" : selectedTerm === i ? "rgba(180,122,255,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: matched.includes(i) ? "#4ade80" : selectedTerm === i ? "#d4b4ff" : "rgba(255,255,255,0.7)",
              opacity: matched.includes(i) ? 0.5 : 1,
            }}>{p.term}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Definitions</div>
          {shuffledDefs.map((p, i) => {
            const isMatched = matched.some(mi => pairs[mi].def === p.def);
            return (
              <button key={i} onClick={() => pickDef(p.def, i)} style={{
                padding: "12px 14px", borderRadius: 10, fontSize: 12, fontWeight: 500, textAlign: "left", cursor: isMatched ? "default" : "pointer", width: "100%", transition: "all 0.2s", lineHeight: 1.4,
                background: isMatched ? "rgba(74,222,128,0.08)" : wrong === i ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isMatched ? "rgba(74,222,128,0.2)" : wrong === i ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: isMatched ? "#4ade80" : wrong === i ? "#f87171" : "rgba(255,255,255,0.6)",
                opacity: isMatched ? 0.5 : 1,
              }}>{p.def}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCORE DASHBOARD
// ═══════════════════════════════════════════════════════════════
function ScoreDashboard({ scores, age }) {
  const overallPct = calcOverallPct(scores);
  const grade = getGrade(overallPct);
  const maxSkill = Math.max(...SKILL_AREAS.map(s => scores[s.key] || 0), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <G glow style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{grade.icon}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Overall Rank</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: grade.color, marginBottom: 4 }}>{grade.label}</div>
        <div style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #e0c3ff, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{overallPct}%</div>
        <ProgressBar pct={overallPct} color={grade.color} h={12} />
      </G>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {SKILL_AREAS.map(s => {
          const val = scores[s.key] || 0;
          const skillPct = maxSkill > 0 ? Math.round((val / maxSkill) * 100) : 0;
          return (
            <G key={s.key} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{val}</div>
              <ProgressBar pct={skillPct} color={s.color} h={6} />
            </G>
          );
        })}
      </div>

      <G>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 4 }}>Activity Stats</div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>{scores.quizzesCompleted || 0}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Quizzes</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#b47aff" }}>{scores.gamesCompleted || 0}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Games</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>{scores.perfectRounds || 0}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Perfect</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{scores.streak || 0}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Streak</div>
          </div>
        </div>
      </G>

      <G>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 14 }}>Badges</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {BADGES.map(b => {
            const earned = b.check(scores);
            return (
              <div key={b.id} style={{ textAlign: "center", padding: 10, borderRadius: 10, background: earned ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${earned ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)"}`, opacity: earned ? 1 : 0.35 }}>
                <div style={{ fontSize: 22, marginBottom: 4, filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: earned ? "#fbbf24" : "rgba(255,255,255,0.3)", lineHeight: 1.3 }}>{b.name}</div>
              </div>
            );
          })}
        </div>
      </G>

      <G>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c3ff", marginBottom: 10 }}>Grade Scale</div>
        {GRADE_SCALE.map(g => (
          <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 16 }}>{g.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: g.color, flex: 1 }}>{g.label}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{g.min}%+</span>
          </div>
        ))}
      </G>

      <G style={{ borderLeft: "3px solid #4ade80" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>What you're doing well</div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
          {(() => {
            const best = SKILL_AREAS.reduce((a, b) => (scores[b.key] || 0) > (scores[a.key] || 0) ? b : a);
            return scores[best.key] > 0 ? `Your strongest area is ${best.label}. Keep building on that foundation.` : "Complete some activities to see your strengths!";
          })()}
        </p>
      </G>
      <G style={{ borderLeft: "3px solid #f59e0b" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>Where to improve</div>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
          {(() => {
            const worst = SKILL_AREAS.reduce((a, b) => (scores[b.key] || 0) < (scores[a.key] || 0) ? b : a);
            return scores[worst.key] >= 0 ? `Focus on ${worst.label} activities to round out your skills. Every practice session counts.` : "Start playing to discover your growth areas!";
          })()}
        </p>
      </G>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function GameCenter() {
  const [age, setAge] = useState(null);
  const [screen, setScreen] = useState("hub");
  const [scores, setScores] = useState({ responsibility: 0, budgeting: 0, saving: 0, investing: 0, quizzesCompleted: 0, gamesCompleted: 0, perfectRounds: 0, streak: 0 });

  const addScores = (newScores, isPerfect, isQuiz = true) => {
    setScores(prev => {
      const n = { ...prev };
      Object.entries(newScores).forEach(([k, v]) => { n[k] = (n[k] || 0) + v; });
      if (isQuiz) n.quizzesCompleted = (n.quizzesCompleted || 0) + 1;
      else n.gamesCompleted = (n.gamesCompleted || 0) + 1;
      if (isPerfect) n.perfectRounds = (n.perfectRounds || 0) + 1;
      n.streak = (n.streak || 0) + 1;
      return n;
    });
    setScreen("hub");
  };

  const ageData = age ? AGE_GROUPS[age] : null;
  const ageColor = ageData?.color || "#b47aff";

  const quizzes = age === "kids" ? KIDS_QUIZZES : age === "teens" ? TEENS_QUIZZES : ADULTS_QUIZZES;
  const scenarios = age === "kids" ? KIDS_SCENARIOS : age === "teens" ? TEENS_SCENARIOS : ADULTS_SCENARIOS;
  const sortData = age === "kids" ? KIDS_SORT : age === "teens" ? TEENS_SORT : ADULTS_SORT;
  const timedQs = age === "kids" ? KIDS_TIMED : age === "teens" ? TEENS_TIMED : ADULTS_TIMED;
  const matchPairs = age === "kids" ? KIDS_MATCHES : age === "teens" ? TEENS_MATCHES : ADULTS_MATCHES;

  const activities = [
    { id: "quiz", icon: "📝", name: "Knowledge Quiz", desc: `${quizzes.length} questions across all skill areas`, color: "#b47aff" },
    { id: "scenario", icon: "🎬", name: "Story Scenarios", desc: `${scenarios.length} real-life money decisions`, color: "#f59e0b" },
    { id: "sort", icon: "🗂️", name: sortData.title, desc: `Sort ${sortData.items.length} items into categories`, color: "#4ade80" },
    { id: "timed", icon: "⚡", name: "Timed Challenge", desc: `${timedQs.length} rapid-fire questions`, color: "#38bdf8" },
    { id: "match", icon: "🎯", name: "Match the Terms", desc: `${matchPairs.length} pairs to connect`, color: "#e879f9" },
  ];

  if (!age) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a0514 0%, #110a24 40%, #0d0820 100%)", color: "#fff", fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
        <Starfield />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#b47aff", textTransform: "uppercase", marginBottom: 8 }}>Club FLE</div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #e0c3ff, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Financial Literacy Game Center</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, maxWidth: 460, marginInline: "auto", lineHeight: 1.6 }}>Learn money skills through games, quizzes, and real-world challenges. Pick your age group to begin.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {Object.entries(AGE_GROUPS).map(([key, g]) => (
              <G key={key} onClick={() => setAge(key)} style={{ textAlign: "center", cursor: "pointer", padding: 28 }} accent={`${g.color}33`}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{g.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: g.color, marginBottom: 4 }}>{g.label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{g.desc}</div>
              </G>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Club FLE · Financial Literacy Extraordinaire</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a0514 0%, #110a24 40%, #0d0820 100%)", color: "#fff", fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
      <Starfield />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#b47aff", textTransform: "uppercase", marginBottom: 8 }}>Club FLE</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #e0c3ff, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Game Center</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 18 }}>{ageData.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: ageColor }}>{ageData.label}</span>
            <button onClick={() => { setAge(null); setScreen("hub"); }} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Change</button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, margin: "20px 0" }}>
          {SKILL_AREAS.map(s => (
            <G key={s.key} style={{ padding: 12, textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{scores[s.key] || 0}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            </G>
          ))}
        </div>

        {/* NAV TABS */}
        <div style={{ display: "flex", gap: 3, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 3 }}>
          {[
            { id: "hub", label: "Activities" },
            { id: "scores", label: "My Scores" },
          ].map(t => (
            <button key={t.id} onClick={() => setScreen(t.id)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: screen === t.id ? "rgba(180,122,255,0.2)" : "transparent",
              color: screen === t.id ? "#d4b4ff" : "rgba(255,255,255,0.4)",
            }}>{t.label}</button>
          ))}
        </div>

        {/* HUB */}
        {screen === "hub" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <G style={{ borderLeft: `3px solid ${ageColor}` }}>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Choose an activity below. Each one tests different money skills and adds to your overall score. The more you play, the higher your rank.
              </p>
            </G>
            {activities.map(a => (
              <G key={a.id} onClick={() => setScreen(a.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: 20 }} accent={`${a.color}22`}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${a.color}15`, border: `1px solid ${a.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{a.desc}</div>
                </div>
                <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 18 }}>→</div>
              </G>
            ))}
          </div>
        )}

        {/* ACTIVITY SCREENS */}
        {screen === "quiz" && <QuizScreen quizzes={quizzes} onComplete={(s, p) => addScores(s, p, true)} ageColor={ageColor} />}
        {screen === "scenario" && <ScenarioScreen scenarios={scenarios} onComplete={(s, p) => addScores(s, p, false)} ageColor={ageColor} />}
        {screen === "sort" && <SortingScreen data={sortData} onComplete={(s, p) => addScores(s, p, false)} ageColor={ageColor} />}
        {screen === "timed" && <TimedScreen questions={timedQs} onComplete={(s, p) => addScores(s, p, false)} ageColor={ageColor} />}
        {screen === "match" && <MatchingScreen pairs={matchPairs} onComplete={(s, p) => addScores(s, p, false)} ageColor={ageColor} />}
        {screen === "scores" && <ScoreDashboard scores={scores} age={age} />}

        {/* BACK BUTTON */}
        {screen !== "hub" && screen !== "scores" && (
          <button onClick={() => setScreen("hub")} style={{ display: "block", margin: "20px auto 0", padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Back to Activities</button>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Club FLE · Financial Literacy Extraordinaire</div>
        </div>
      </div>
    </div>
  );
}
