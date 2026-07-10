# Budget Tracker Spec

## Feature Goal
Create a `/budget-tracker` section inside the app that gives users a full financial snapshot, AI-driven spending feedback, goal tracking, habit analysis, investment monitoring, and secure account access controls.

This page should feel encouraging, specific, and helpful. It should help users understand:
- where they stand with weekly spending,
- whether they are on track for savings goals,
- what habits are helping or hurting them,
- what weeks are better than others,
- and whether any account activity needs attention.

---

## User Experience

When the user clicks **Budget Tracker**, they should go to a new page inside the app with a detailed dashboard.

The dashboard should include:
- AI tracking and capabilities.
- Goal updates.
- Spending updates.
- Habit monitoring.
- Weekly breakdowns.
- Event-based savings tracking like birthdays and vacations.
- Investment tracking.
- Accountant or shared-access controls.
- Notifications for unauthorized or unexpected account movement.

The tone should be supportive, realistic, and motivating.

Example messages:
- "Your birthday is coming up on the 24th and you've spent $200 this week. Your daily budget is $20 and your weekly budget is $140–$175. You went over this week. Let's shoot to budget better next week — no worries, you're still on track."
- "Your goal was to have $800 saved up for your birthday. Right now you're at $450. You have 3 more paychecks left before your birthday. You can do it."
- "At $10 a day spent on food and $10 spent on gas, you'll be over your budget."
- "Great job! You saved more than expected. Keep going."
- "You have vacation coming up next month. 34 days and counting. This extra saved money gives you an early start so rough weeks won't hurt as much."

---

## Main Sections

### 1. Snapshot
Show a top summary with:
- current balance,
- weekly budget range,
- amount spent this week,
- daily safe spend,
- savings progress,
- countdown to the next goal event,
- status label like on track, slightly over, or at risk.

### 2. AI Feed
Show a scrolling or stacked feed of AI-generated insights:
- encouragement,
- overspending warnings,
- savings reminders,
- goal progress updates,
- habit trend warnings,
- milestone celebrations,
- urgent account alerts.

### 3. Goals
Support goals such as:
- birthday,
- vacation,
- emergency fund,
- car repair,
- holiday spending,
- general savings.

Each goal should show:
- target amount,
- current amount saved,
- progress bar,
- remaining paychecks,
- recommended contribution,
- expected completion date.

### 4. Weekly Spending
Show a weekly chart that compares:
- actual spending,
- target budget,
- safe-spend range,
- best week,
- worst week,
- category breakdown.

### 5. Habits
Track spending habits such as:
- food,
- gas,
- subscriptions,
- shopping,
- entertainment,
- recurring overspend patterns.

The AI should identify:
- weeks that are better than others,
- categories causing budget stress,
- improvement streaks,
- recurring habits that need attention.

### 6. Investments
Let users enter or connect investment data so the app can monitor:
- portfolio growth,
- loss risk,
- goal impact,
- whether investments are helping or hurting overall finances.

### 7. Account Access
Include a feature where users can:
- connect an accountant or trusted helper,
- limit access to habit analytics only,
- set login monitoring,
- set an access expiration time,
- remove access completely.

This should protect the user from unnecessary access to bank accounts while still allowing review of AI-generated financial summaries.

### 8. Alerts
Show alerts for:
- overspending,
- budget risk,
- unusual transfers,
- joint account movement,
- goal completion,
- account access events.

---

## JSON Spec

```json
{
  "page": {
    "name": "Budget Tracker",
    "route": "/budget-tracker",
    "type": "dashboard",
    "tone": "supportive",
    "description": "AI-powered budget and financial tracking page with goals, spending updates, habits, investment monitoring, and secure access controls."
  },
  "sections": [
    {
      "id": "snapshot",
      "title": "Snapshot",
      "fields": [
        "currentBalance",
        "weeklyBudgetMin",
        "weeklyBudgetMax",
        "spentThisWeek",
        "dailySafeSpend",
        "goalProgress",
        "eventCountdown",
        "status"
      ]
    },
    {
      "id": "aiFeed",
      "title": "AI Feed",
      "fields": [
        "message",
        "tone",
        "category",
        "severity",
        "linkedGoal",
        "linkedTransaction",
        "timestamp"
      ]
    },
    {
      "id": "goals",
      "title": "Goals",
      "fields": [
        "goalName",
        "goalType",
        "targetAmount",
        "currentAmount",
        "dueDate",
        "remainingPaychecks",
        "recommendedContribution",
        "progressPercent",
        "status"
      ]
    },
    {
      "id": "weeklySpending",
      "title": "Weekly Spending",
      "fields": [
        "weeklyBudget",
        "actualSpent",
        "difference",
        "bestWeek",
        "worstWeek",
        "categoryBreakdown",
        "trend"
      ]
    },
    {
      "id": "habits",
      "title": "Habits",
      "fields": [
        "topCategories",
        "averageDailySpend",
        "habitTrend",
        "habitScore",
        "streakDays",
        "problemCategories"
      ]
    },
    {
      "id": "investments",
      "title": "Investments",
      "fields": [
        "portfolioValue",
        "gainLoss",
        "gainLossPercent",
        "allocation",
        "targetAllocation",
        "driftAlert",
        "riskLevel"
      ]
    },
    {
      "id": "accountAccess",
      "title": "Account Access",
      "fields": [
        "accessRole",
        "grantedTo",
        "grantedToEmail",
        "expiresAt",
        "lastLoginAt",
        "lastLoginIP",
        "lastLoginDevice",
        "active",
        "auditLog"
      ]
    },
    {
      "id": "alerts",
      "title": "Alerts",
      "fields": [
        "type",
        "severity",
        "message",
        "resolved",
        "createdAt",
        "actionUrl",
        "linkedGoalId"
      ]
    }
  ],
  "models": [
    {
      "name": "BudgetSummary",
      "fields": [
        "currentBalance",
        "weeklyBudgetMin",
        "weeklyBudgetMax",
        "spentThisWeek",
        "dailySafeSpend",
        "goalProgressPercent",
        "status",
        "savingsRate",
        "streakDays"
      ]
    },
    {
      "name": "FinancialGoal",
      "fields": [
        "id",
        "title",
        "goalType",
        "targetAmount",
        "currentAmount",
        "dueDate",
        "remainingPaychecks",
        "recommendedContribution",
        "status",
        "projectedCompletionDate",
        "priority"
      ]
    },
    {
      "name": "Transaction",
      "fields": [
        "id",
        "date",
        "merchant",
        "category",
        "amount",
        "accountId",
        "isRecurring",
        "notes",
        "recurringFrequency",
        "source",
        "flagged"
      ]
    },
    {
      "name": "Alert",
      "fields": [
        "id",
        "type",
        "severity",
        "message",
        "createdAt",
        "resolved",
        "actionUrl",
        "linkedGoalId"
      ]
    },
    {
      "name": "AccountAccess",
      "fields": [
        "id",
        "userRole",
        "grantedTo",
        "grantedToEmail",
        "scope",
        "expiresAt",
        "lastLoginAt",
        "lastLoginIP",
        "lastLoginDevice",
        "active",
        "auditLog"
      ]
    },
    {
      "name": "InvestmentHolding",
      "fields": [
        "id",
        "name",
        "symbol",
        "value",
        "costBasis",
        "gainLoss",
        "gainLossPercent",
        "allocation",
        "targetAllocation",
        "driftAlert",
        "riskLevel"
      ]
    },
    {
      "name": "HabitData",
      "fields": [
        "category",
        "averageDailySpend",
        "weeklyTrend",
        "habitScore",
        "streakDays",
        "problemFlag"
      ]
    },
    {
      "name": "AIMessage",
      "fields": [
        "id",
        "tone",
        "category",
        "message",
        "severity",
        "timestamp",
        "linkedGoalId",
        "linkedTransactionId"
      ]
    },
    {
      "name": "AuditEntry",
      "fields": [
        "id",
        "actor",
        "action",
        "target",
        "timestamp",
        "ipAddress",
        "device",
        "status"
      ]
    }
  ],
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/budget-tracker/summary",
      "description": "Get current budget summary and goal status."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/goals",
      "description": "List all savings and event-based goals."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/goals",
      "description": "Create a new goal."
    },
    {
      "method": "PUT",
      "path": "/api/budget-tracker/goals/:id",
      "description": "Update a goal."
    },
    {
      "method": "DELETE",
      "path": "/api/budget-tracker/goals/:id",
      "description": "Delete a goal."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/transactions",
      "description": "List transactions."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/transactions",
      "description": "Add a transaction."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/transactions/import",
      "description": "Bulk import transactions."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/alerts",
      "description": "List all alerts."
    },
    {
      "method": "PUT",
      "path": "/api/budget-tracker/alerts/:id",
      "description": "Mark alert as resolved."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/habits",
      "description": "Get habit analysis."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/habits/spending-cap",
      "description": "Set or update category spending caps."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/investments",
      "description": "Get investment holdings."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/investments",
      "description": "Add or update an investment holding."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/investments/check-drift",
      "description": "Check for portfolio drift and risk warnings."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/account-access/invite",
      "description": "Invite an accountant or trusted reviewer."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/account-access",
      "description": "List access records."
    },
    {
      "method": "POST",
      "path": "/api/budget-tracker/account-access/revoke",
      "description": "Remove access."
    },
    {
      "method": "GET",
      "path": "/api/budget-tracker/account-access/audit",
      "description": "Get audit history."
    }
  ],
  "events": [
    {
      "name": "QuizCompleted",
      "event_type": "quiz_completed",
      "description": "Fired when a child finishes a quiz. Used by the AI feed for praise/streak messages and by the parent dashboard for progress tracking.",
      "fields": [
        { "name": "child_id", "type": "string", "description": "UUID of the child who took the quiz" },
        { "name": "quiz_id", "type": "string", "description": "UUID of the quiz definition" },
        { "name": "subject", "type": "string", "description": "Topic area (e.g. Budgeting, Saving, Investing)" },
        { "name": "score", "type": "number", "description": "Score from 0–100" },
        { "name": "time_spent_seconds", "type": "number", "description": "How long the child spent on the quiz" },
        { "name": "timestamp", "type": "string", "description": "ISO 8601 datetime of completion" }
      ]
    }
    },
    {
      "name": "GoalReached",
      "event_type": "goal_reached",
      "description": "Fired when a child hits a reward goal. Triggers celebration messages in the AI feed, unlocks the reward, and notifies the parent dashboard.",
      "fields": [
        { "name": "child_id", "type": "string", "description": "UUID of the child who reached the goal" },
        { "name": "reward_id", "type": "string", "description": "UUID of the reward being unlocked" },
        { "name": "goal_rule", "type": "object", "description": "The rule that was satisfied", "fields": [
          { "name": "type", "type": "string", "description": "Rule type: quiz_count | score_threshold | streak | bundle" },
          { "name": "target", "type": "number", "description": "The target value needed to complete the goal" },
          { "name": "current", "type": "number", "description": "The child's current value at time of completion" }
        ]},
        { "name": "timestamp", "type": "string", "description": "ISO 8601 datetime of goal completion" }
      ]
    }
  ],
  "aiRules": [
    {
      "name": "Weekly Overspend",
      "trigger": "spentThisWeek > weeklyBudgetMax",
      "messageStyle": "encouraging"
    },
    {
      "name": "Goal Progress Update",
      "trigger": "currentAmount < targetAmount",
      "messageStyle": "motivational"
    },
    {
      "name": "Event Countdown",
      "trigger": "eventDateWithinDays <= 45",
      "messageStyle": "supportive"
    },
    {
      "name": "Goal Achieved",
      "trigger": "currentAmount >= targetAmount",
      "messageStyle": "celebratory"
    },
    {
      "name": "Habit Drift",
      "trigger": "habitScore drops over time",
      "messageStyle": "advisory"
    },
    {
      "name": "Streak Maintained",
      "trigger": "streakDays >= 7",
      "messageStyle": "praise"
    },
    {
      "name": "Security Alert",
      "trigger": "unknownTransferDetected == true",
      "messageStyle": "urgent"
    }
  ]
}
```
