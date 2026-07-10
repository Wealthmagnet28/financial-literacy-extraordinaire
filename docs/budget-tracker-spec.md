# Budget Tracker — Full Product Spec

> **App:** Club FLE Budget Tracker
> **Version:** 1.0.0
> **Route:** `/budget-tracker`
> **Status:** UI-only demo with mock data (live at `/budget-tracker`)
> **Description:** AI-powered budget tracker with goals, spending insights, habit monitoring, investment tracking, and secure account/accountant access controls.

---

## Page Structure

| Section | Purpose |
|---------|---------|
| **Header** | Current balances, quick actions (Add Transaction, Set Goal, Connect Account) |
| **Snapshot Cards** | Today's safe spend, Week vs. budget, Goal progress, Alerts summary |
| **AI Feed / Timeline** | Color-coded AI messages (alert, suggestion, praise), recent transactions, flagged items |
| **Goals** | Create/track financial goals with paycheck-based projections |
| **Weekly Spending** | Bar chart — actual vs. budget range over 4 weeks |
| **Habits** | Category cards (food, gas, subscriptions) with weekly averages and trend data |
| **Investments / Portfolio** | Holdings summary, gain/loss, risk level, AI drift alerts |
| **Account & Accountant Access** | Connect/disconnect banks, RBAC controls, audit logs |
| **Alerts & Notifications** | Overspend warnings, unusual transfers, goal-at-risk, accountant login alerts |
| **Settings & Security** | Link/unlink accounts, notification preferences, encryption controls |

---

## AI Features & Behavior

### What the AI Does

1. **Real-time spending analysis** — categorizes receipts, bank imports, and manual entries automatically
2. **Daily & weekly progress messages** — encouragement + concrete numbers, not generic motivational filler
3. **Predictive goal projections** — uses upcoming paychecks and current saving rate to forecast goal completion
4. **Habit monitoring** — tracks average daily spending per category, identifies better/worse weeks, spots patterns
5. **Security alerts** — flags unusual account movement (joint accounts), overspending, accountant login/logout events
6. **Investment monitoring** — portfolio snapshot with alerts when performance or allocations drift from targets
7. **Event-aware planning** — countdowns for birthdays, vacations, and other milestone events tied to goals

### AI Message Rules

| Rule | Trigger | Style |
|------|---------|-------|
| Weekly Overspend | `spentThisWeek > weeklyBudgetMax` | Encouraging — acknowledge the overspend, reframe positively, give next-week target |
| Goal Projection | `goalCurrentAmount < goalTargetAmount` | Motivational — show concrete math (remaining ÷ paychecks), express confidence |
| Event Countdown | `eventDateWithinDays <= 45` | Supportive — surface the deadline, show runway, suggest contribution amount |
| Account Security | `unknownTransferDetected == true` | Urgent — immediate alert with action buttons (review, freeze) |
| Habit Drift | `categorySpend > categoryAvg * 1.2` | Advisory — name the category, quantify the drift, suggest a specific trim |
| Goal Achieved | `goalCurrentAmount >= goalTargetAmount` | Celebratory — big congratulations, link to next goal or upcoming event |
| Streak Maintained | `consecutiveDaysOnBudget >= 7` | Praise — acknowledge consistency, show the streak visually |

---

## UX Copy Examples (Production-Ready)

### Weekly Feedback (Friendly, Actionable)
> "Your birthday is coming up on the 24th and you've spent $200 this week. Your daily budget is $20 and weekly budget is $140–$175; you went over this week. Let's aim to budget better next week — no worries, you're still on track."

### Goal Projection (Concrete Math + Motivation)
> "Goal: $800 for your birthday. Current: $450. Paychecks left: 3. If you save $117 per paycheck (or $16.71/day), you'll hit your goal — let's do it!"

### Habit Warning (Scenario-Based)
> "At $10/day on food and $10/day on gas, you'll exceed this week's budget — consider trimming $5/day on food to stay within limits."

### Celebration (Earned, Not Generic)
> "GREAT JOB!! You saved more than expected for your birthday — keep going. Vacation coming up in 34 days; this extra saved money gives you an early buffer."

### Security / Accountant Control
> "Your accountant logged in 2 hours ago. They have access to habit analytics only. Revoke access or schedule access windows anytime."

### Encouragement (Overspend but On Track)
> "Your birthday is on the 24th and you've spent $200 this week. Weekly budget: $140–$175, so you went over — no worries, you're still on track for your goal of $800; current: $450. With 3 paychecks left, save $117/paycheck and you'll make it — I believe in you!"

### Alert (Joint Account Movement)
> "Alert: $250 moved from your joint account at 09:12 AM without a matching shared approval. Tap to review or freeze the account."

### Streak Praise
> "7 days on budget — that's a full week of discipline. You're building a habit that compounds. Keep it going."

### New Goal Created
> "Vacation fund created: $1,500 target by October 5. That's 6 paychecks away — saving $200 per paycheck gets you there. I'll track your progress and remind you along the way."

---

## Budget Math & Calculations

### Formulas to Display

| Metric | Formula |
|--------|---------|
| **Daily Safe Spend** | `(remainingWeeklyBudget - plannedBillsThisWeek) / daysLeftInWeek` |
| **Goal Runway** | `(goalTarget - currentSaved) / remainingPaychecks` |
| **Habit Trend** | `avgSpendPerCategory(last4Weeks) vs avgSpendPerCategory(previous4Weeks)` |
| **Weekly Variance** | `actualSpent - weeklyBudgetMax` (positive = over, negative = under) |
| **Goal Progress %** | `(currentAmount / targetAmount) * 100` |
| **Projected Goal Date** | `today + ((goalTarget - currentSaved) / avgWeeklySaving) * 7` |
| **Savings Rate** | `(income - totalSpend) / income * 100` |

### Data Inputs Required

- Bank connections (OAuth or CSV upload)
- Manual transaction entries
- Receipt photo uploads (for AI categorization)
- Paycheck dates and amounts
- Regular/recurring bills
- Investment holdings
- Joint account flags
- Goal definitions (name, target, deadline, priority)

---

## Component & Section Specs

### Snapshot Cards (Tap to Expand)

| Card | Primary Display | Expanded Detail |
|------|----------------|-----------------|
| Today's Safe Spend | Dollar amount + color indicator | Calculation breakdown, daily history |
| Week vs Budget | Bar showing actual vs. range ($140–$175) | Day-by-day spending, category breakdown |
| Goal Progress | Progress ring + next action | All goals, contribution schedule |
| Status | One-line AI summary | Full AI feed link |

### Goals Page

- **Create goal:** name, target amount, due date, priority level
- **Auto-suggestions:** recommended contribution per paycheck
- **Dual projections:** optimistic (save more) vs. conservative (current rate)
- **Visual:** progress ring, timeline, paycheck countdown

### Habits Page

- **Habit cards:** food, gas, subscriptions — each with weekly averages
- **Quick actions:** pause subscription, lower weekly target, set spending cap
- **Trend display:** 4-week rolling average with up/down/flat indicators

### Investments / Portfolio

- **Holdings summary:** name, symbol, current value, cost basis, gain/loss
- **Time views:** 1W / 1M / 1Y performance
- **AI flag:** alert if investment performance threatens an upcoming goal
- **Risk badge:** Low / Moderate / High per holding

### Account & Accountant Access

- **Connect/Disconnect:** bank OAuth + manual CSV import
- **Accountant controls:** grant/revoke access, set time windows, see last login
- **Scope limits:** accountant sees habit analytics only — no bank credentials
- **Audit log:** timestamps, IP/device info, actions taken
- **Time-limited tokens:** auto-expire access after set window

---

## Privacy & Security

- Default: encrypt locally, require re-auth for linking accounts
- Show timestamps and IP/device for all accountant access events
- Minimal shared view for accountants: analytics and habit notes only, never transaction-level bank credentials
- Time-limited tokens for access windows — auto-revoke on expiration
- Joint account alerts: flag any transfer without matching shared approval
- No third-party data sharing without explicit user consent

---

## UI Microcopy

### Buttons
- "Add Spending"
- "Set Goal"
- "Link Account"
- "Invite Accountant"
- "Revoke Access"
- "Pause Subscription"
- "Review Transfer"
- "Freeze Account"

### Informational Notes
- "This view shows only habit analytics — no bank credentials shared."
- "Your accountant has read-only access to spending patterns. No personal banking data is visible."
- "All data is encrypted on your device. We never store your bank login."

---

## Data Models

### BudgetSummary
```json
{
  "currentBalance": "number",
  "weeklyBudgetMin": "number",
  "weeklyBudgetMax": "number",
  "dailySafeSpend": "number",
  "spentThisWeek": "number",
  "remainingToGoal": "number",
  "goalProgressPercent": "number",
  "status": "string",
  "savingsRate": "number",
  "streakDays": "number"
}
```

### FinancialGoal
```json
{
  "id": "string",
  "title": "string",
  "goalType": "string (Celebration | Travel | Savings | Emergency | Education | Custom)",
  "targetAmount": "number",
  "currentAmount": "number",
  "dueDate": "string (ISO 8601)",
  "remainingPaychecks": "number",
  "recommendedContribution": "number",
  "projectedCompletionDate": "string (ISO 8601)",
  "priority": "string (high | medium | low)",
  "status": "string (on track | needs attention | at risk | completed)"
}
```

### Transaction
```json
{
  "id": "string",
  "date": "string (ISO 8601)",
  "merchant": "string",
  "category": "string (Food | Gas | Subscriptions | Entertainment | Bills | Income | Transfer | Other)",
  "amount": "number",
  "accountId": "string",
  "isRecurring": "boolean",
  "recurringFrequency": "string (weekly | biweekly | monthly | null)",
  "source": "string (bank_sync | manual | receipt_scan)",
  "notes": "string",
  "flagged": "boolean"
}
```

### Alert
```json
{
  "id": "string",
  "type": "string (Overspend | Unusual Transfer | Milestone | Goal At Risk | Accountant Login | Habit Drift | Streak)",
  "severity": "string (info | warning | urgent | success)",
  "message": "string",
  "createdAt": "string (ISO 8601)",
  "resolved": "boolean",
  "actionUrl": "string | null",
  "linkedGoalId": "string | null",
  "linkedTransactionId": "string | null"
}
```

### AccountAccess
```json
{
  "id": "string",
  "userRole": "string (Owner | Accountant | Co-Owner | Viewer)",
  "grantedTo": "string",
  "grantedToEmail": "string",
  "scope": "string (full | analytics_only | read_only)",
  "expiresAt": "string (ISO 8601 | never)",
  "lastLoginAt": "string (ISO 8601)",
  "lastLoginIP": "string",
  "lastLoginDevice": "string",
  "active": "boolean",
  "auditLog": "AuditEntry[]"
}
```

### AuditEntry
```json
{
  "timestamp": "string (ISO 8601)",
  "action": "string (login | logout | view_report | export_data)",
  "ip": "string",
  "device": "string"
}
```

### InvestmentHolding
```json
{
  "id": "string",
  "name": "string",
  "symbol": "string",
  "value": "number",
  "costBasis": "number",
  "gainLoss": "number",
  "gainLossPercent": "number",
  "riskLevel": "string (Low | Moderate | High)",
  "allocation": "number (percentage of total portfolio)",
  "targetAllocation": "number (percentage)",
  "driftAlert": "boolean"
}
```

### HabitData
```json
{
  "category": "string",
  "icon": "string",
  "avgDaily": "number",
  "avgWeekly": "number",
  "trend": "string (up | down | flat)",
  "trendPercent": "number",
  "trendLabel": "string",
  "weeklyHistory": "number[] (last 8 weeks)",
  "spendingCap": "number | null"
}
```

### AIMessage
```json
{
  "id": "string",
  "tone": "string (encouraging | motivational | supportive | success | urgent | advisory | celebratory)",
  "category": "string (Weekly Spending | Goal Projection | Habit Watch | Milestone | Security | Streak)",
  "message": "string",
  "createdAt": "string (ISO 8601)",
  "linkedGoalId": "string | null",
  "linkedTransactionId": "string | null",
  "read": "boolean",
  "actionable": "boolean",
  "actionLabel": "string | null",
  "actionUrl": "string | null"
}
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/budget-tracker/summary` | Current budget status, goal progress, safe-to-spend, savings rate, streak |
| `GET` | `/api/budget-tracker/goals` | List all financial goals with projections |
| `POST` | `/api/budget-tracker/goals` | Create a new goal (birthday, vacation, savings, custom) |
| `PUT` | `/api/budget-tracker/goals/:id` | Update goal target, deadline, or priority |
| `DELETE` | `/api/budget-tracker/goals/:id` | Remove a goal |
| `GET` | `/api/budget-tracker/transactions` | Recent spending and income activity (filterable by date, category) |
| `POST` | `/api/budget-tracker/transactions` | Add a manual transaction |
| `POST` | `/api/budget-tracker/transactions/import` | Bulk import from CSV or receipt scan |
| `GET` | `/api/budget-tracker/alerts` | Overspend, unusual activity, milestone, and security alerts |
| `PUT` | `/api/budget-tracker/alerts/:id` | Mark alert as resolved |
| `GET` | `/api/budget-tracker/habits` | Category spending trends and averages |
| `PUT` | `/api/budget-tracker/habits/:category` | Set a spending cap or weekly target for a category |
| `GET` | `/api/budget-tracker/ai-feed` | AI-generated messages and recommendations |
| `GET` | `/api/budget-tracker/weekly-spending` | Week-over-week spending data with budget range |
| `POST` | `/api/budget-tracker/account-link` | Connect or disconnect a bank account |
| `GET` | `/api/budget-tracker/account-access` | Who has access, login history, scope, expiration |
| `POST` | `/api/budget-tracker/account-access/invite` | Invite an accountant or co-owner |
| `PUT` | `/api/budget-tracker/account-access/:id` | Update scope, extend or shorten access window |
| `DELETE` | `/api/budget-tracker/account-access/:id` | Revoke access immediately |
| `GET` | `/api/budget-tracker/account-access/:id/audit` | Audit log for a specific access grant |
| `GET` | `/api/budget-tracker/investments` | Portfolio holdings and performance |
| `POST` | `/api/budget-tracker/investments` | Add or update investment holdings |
| `GET` | `/api/budget-tracker/investments/drift` | Check if allocations have drifted from targets |

---

## UI Fields by Section

### Snapshot
`todaySafeSpend` · `spentThisWeek` · `goalProgress` · `daysUntilEvent` · `remainingPaychecks` · `streakDays` · `savingsRate`

### AI Feed
`message` · `tone` · `category` · `linkedGoal` · `linkedTransaction` · `actionable` · `actionLabel` · `read`

### Goals
`goalName` · `goalAmount` · `goalDeadline` · `currentSaved` · `recommendedWeeklyContribution` · `projectedDate` · `priority` · `status`

### Weekly Spending
`weeklyBudget` · `actualSpent` · `difference` · `bestWeek` · `worstWeek` · `budgetRangeMin` · `budgetRangeMax`

### Habits
`topCategories` · `averageDailySpend` · `habitTrend` · `habitScore` · `spendingCap` · `weeklyHistory`

### Account Access
`connectedAccount` · `accessRole` · `accessScope` · `accessExpires` · `loginHistory` · `lastLoginIP` · `lastLoginDevice` · `revokeAccessButton` · `auditLog`

### Investments
`holdingName` · `symbol` · `currentValue` · `costBasis` · `gainLoss` · `riskLevel` · `allocation` · `targetAllocation` · `driftAlert`

---

## Build Priority

| Phase | What to Build | Why First |
|-------|---------------|-----------|
| **1** | Transactions import & categorization + manual entry | Foundation — everything else reads from this |
| **2** | Budgets, weekly safe-spend calculation, simple AI messages | Core value — users see immediate feedback |
| **3** | Goals with paycheck-based projection math | High engagement — ties spending to motivation |
| **4** | Notifications for overspend and unusual transfers | Trust & safety — users need to feel protected |
| **5** | Accountant role + RBAC access controls + audit logs | Enterprise readiness — unlocks professional users |
| **6** | Investment tracking and portfolio AI drift flags | Advanced tier — appeals to serious financial users |
| **7** | Receipt scanning and AI auto-categorization | Convenience — reduces manual entry friction |
| **8** | Habit analytics with spending caps and trend predictions | Behavioral — long-term retention feature |

---

## Implementation Notes

### Data Layer
- Separate tables for: raw transactions, categorized tags, goals, paychecks, access logs, audit entries, investment holdings, habit snapshots
- Immutable transaction log — never delete, only soft-archive
- Goal snapshots at each paycheck for historical tracking

### AI / ML
- **Rules engine** for alerts (threshold-based, immediate)
- **ML model** for transaction categorization (merchant → category mapping)
- **Forecasting** for goal projections (linear + seasonal adjustment)
- **Personalized suggestions** based on spending patterns and stated priorities

### Sync
- Direct bank connections via OAuth (Plaid or similar)
- Manual CSV upload with column mapping
- Receipt photo upload with OCR → transaction creation

### RBAC for Accountants
- Role-limited JWT tokens with:
  - Scope field (full | analytics_only | read_only)
  - Expiration timestamp
  - Device binding (optional)
- Audit log on every access event
- Auto-revoke on token expiration
- Email notification to owner on accountant login

### Security Defaults
- All financial data encrypted at rest
- Re-authentication required for: linking accounts, granting access, changing security settings
- Session timeout: 15 minutes inactive
- 2FA recommended for owner accounts
