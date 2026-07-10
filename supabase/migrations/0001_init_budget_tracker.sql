-- Budget Tracker schema — initial tables
-- Run against a Supabase project with auth.users already present.

-- ═══════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════

create table users (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  display_name text,
  avatar_url  text,
  role        text check (role in ('personal','family_member','student','business','accountant')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table budgets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  name         text,
  category     text,
  monthly_limit numeric,
  period_start date,
  period_end   date,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  budget_id   uuid references budgets(id) on delete set null,
  amount      numeric,
  type        text check (type in ('income','expense')),
  category    text,
  merchant    text,
  description text,
  occurred_at timestamptz,
  created_at  timestamptz default now()
);

create table goals (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references users(id) on delete cascade,
  title          text,
  target_amount  numeric,
  current_amount numeric default 0,
  target_date    date,
  status         text check (status in ('active','completed','paused')) default 'active',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table habits (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users(id) on delete cascade,
  habit_type        text,
  current_streak    int default 0,
  longest_streak    int default 0,
  last_completed_at timestamptz
);

create table alerts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  alert_type text,
  message    text,
  is_read    boolean default false,
  created_at timestamptz default now()
);

create table investments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references users(id) on delete cascade,
  asset_name     text,
  asset_type     text check (asset_type in ('stock','etf','simulated','crypto')),
  quantity       numeric,
  purchase_price numeric,
  current_value  numeric,
  is_simulated   boolean default true,
  created_at     timestamptz default now()
);

create table account_access_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  accessed_by uuid not null references users(id) on delete cascade,
  action      text check (action in ('view','edit','export','login')),
  ip_address  text,
  user_agent  text,
  created_at  timestamptz default now()
);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

alter table users enable row level security;
alter table budgets enable row level security;
alter table transactions enable row level security;
alter table goals enable row level security;
alter table habits enable row level security;
alter table alerts enable row level security;
alter table investments enable row level security;
alter table account_access_logs enable row level security;

-- users: own row only
create policy "users_select_own" on users for select using (id = auth.uid());
create policy "users_insert_own" on users for insert with check (id = auth.uid());
create policy "users_update_own" on users for update using (id = auth.uid());

-- budgets: own rows only
create policy "budgets_select_own" on budgets for select using (user_id = auth.uid());
create policy "budgets_insert_own" on budgets for insert with check (user_id = auth.uid());
create policy "budgets_update_own" on budgets for update using (user_id = auth.uid());

-- transactions: own rows only
create policy "transactions_select_own" on transactions for select using (user_id = auth.uid());
create policy "transactions_insert_own" on transactions for insert with check (user_id = auth.uid());
create policy "transactions_update_own" on transactions for update using (user_id = auth.uid());

-- goals: own rows only
create policy "goals_select_own" on goals for select using (user_id = auth.uid());
create policy "goals_insert_own" on goals for insert with check (user_id = auth.uid());
create policy "goals_update_own" on goals for update using (user_id = auth.uid());

-- habits: own rows only
create policy "habits_select_own" on habits for select using (user_id = auth.uid());
create policy "habits_insert_own" on habits for insert with check (user_id = auth.uid());
create policy "habits_update_own" on habits for update using (user_id = auth.uid());

-- alerts: own rows only
create policy "alerts_select_own" on alerts for select using (user_id = auth.uid());
create policy "alerts_insert_own" on alerts for insert with check (user_id = auth.uid());
create policy "alerts_update_own" on alerts for update using (user_id = auth.uid());

-- investments: own rows only
create policy "investments_select_own" on investments for select using (user_id = auth.uid());
create policy "investments_insert_own" on investments for insert with check (user_id = auth.uid());
create policy "investments_update_own" on investments for update using (user_id = auth.uid());

-- account_access_logs: insert for any authenticated user, select if you're the owner or the accessor
create policy "access_logs_insert_auth" on account_access_logs for insert with check (auth.uid() is not null);
create policy "access_logs_select_own" on account_access_logs for select using (user_id = auth.uid() or accessed_by = auth.uid());
