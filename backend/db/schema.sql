create extension if not exists pgcrypto;

create table if not exists stockists (
  id text primary key,
  name text not null,
  email text,
  phone text,
  area text not null default '',
  district text not null default '',
  fee_rate numeric(5,2) not null default 5,
  password_hash text not null default crypt('ascendia', gen_salt('bf')),
  active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table stockists add column if not exists email text;
alter table stockists add column if not exists phone text;
alter table stockists add column if not exists district text not null default '';
alter table stockists add column if not exists password_hash text not null default crypt('ascendia', gen_salt('bf'));
alter table stockists add column if not exists active boolean not null default true;
alter table stockists add column if not exists deleted_at timestamptz;

create table if not exists admins (
  id text primary key,
  name text not null,
  email text unique,
  phone text,
  role text not null check (role in ('Admin Pusat', 'Admin Cabang')),
  area text not null default '',
  password_hash text not null,
  active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table admins add column if not exists active boolean not null default true;
alter table admins add column if not exists deleted_at timestamptz;

create table if not exists announcements (
  id text primary key,
  title text not null,
  body text not null default '',
  audience text not null default 'Semua Member',
  status text not null default 'Aktif',
  published_at date not null default current_date,
  active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists members (
  id text primary key,
  name text not null,
  email text,
  phone text,
  sponsor_id text references members(id) on delete restrict,
  placement_parent_id text references members(id) on delete restrict,
  placement_side char(1) check (placement_side in ('L', 'R')),
  rank_name text not null default 'Member',
  manual_rank boolean not null default false,
  tupo_done boolean not null default false,
  tupo_blocked boolean not null default false,
  disable_bonus_performance boolean not null default false,
  disable_bonus_pair boolean not null default false,
  disable_bonus_leadership boolean not null default false,
  disable_bonus_mentoring boolean not null default false,
  disable_bonus_sharing boolean not null default false,
  stockist_id text not null references stockists(id) on delete restrict,
  joined_at date not null default current_date,
  password_hash text,
  active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint placement_side_unique unique (placement_parent_id, placement_side)
);

alter table members add column if not exists active boolean not null default true;
alter table members add column if not exists deleted_at timestamptz;
alter table members add column if not exists tupo_blocked boolean not null default false;
alter table members add column if not exists disable_bonus_performance boolean not null default false;
alter table members add column if not exists disable_bonus_pair boolean not null default false;
alter table members add column if not exists disable_bonus_leadership boolean not null default false;
alter table members add column if not exists disable_bonus_mentoring boolean not null default false;
alter table members add column if not exists disable_bonus_sharing boolean not null default false;

create table if not exists bonus_settings (
  bonus_type text primary key check (bonus_type in ('performance', 'pair', 'leadership', 'mentoring', 'sharing')),
  active boolean not null default true,
  updated_by text,
  updated_at timestamptz not null default now()
);

insert into bonus_settings (bonus_type, active)
values
  ('performance', true),
  ('pair', true),
  ('leadership', true),
  ('mentoring', true),
  ('sharing', true)
on conflict (bonus_type) do nothing;

create table if not exists sponsor_closure (
  ancestor_id text not null references members(id) on delete cascade,
  descendant_id text not null references members(id) on delete cascade,
  depth int not null check (depth >= 0),
  primary key (ancestor_id, descendant_id)
);

create table if not exists placement_closure (
  ancestor_id text not null references members(id) on delete cascade,
  descendant_id text not null references members(id) on delete cascade,
  depth int not null check (depth >= 0),
  primary key (ancestor_id, descendant_id)
);

create table if not exists pv_transactions (
  id bigserial primary key,
  period_key text not null,
  member_id text not null references members(id) on delete restrict,
  pv numeric(18,2) not null check (pv >= 0),
  source_type text not null default 'manual',
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists member_period_metrics (
  period_key text not null,
  member_id text not null references members(id) on delete cascade,
  ppv numeric(18,2) not null default 0,
  appv numeric(18,2) not null default 0,
  tnpv numeric(18,2) not null default 0,
  atnpv numeric(18,2) not null default 0,
  gpv numeric(18,2) not null default 0,
  left_pv numeric(18,2) not null default 0,
  right_pv numeric(18,2) not null default 0,
  carry_pv numeric(18,2) not null default 0,
  carry_age int not null default 0,
  rank_name text not null default 'Member',
  updated_at timestamptz not null default now(),
  primary key (period_key, member_id)
);

create table if not exists bonus_runs (
  id bigserial primary key,
  period_key text not null,
  status text not null check (status in ('queued', 'running', 'done', 'failed')),
  requested_by text not null,
  started_at timestamptz,
  finished_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists bonus_ledger (
  id bigserial primary key,
  period_key text not null,
  member_id text not null references members(id) on delete restrict,
  bonus_type text not null check (bonus_type in ('performance', 'pair', 'leadership', 'mentoring', 'sharing_profit')),
  source_member_id text references members(id) on delete restrict,
  generation int,
  bv numeric(18,2) not null default 0,
  rupiah numeric(18,2) generated always as (bv * 1000) stored,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists stockist_payouts (
  id bigserial primary key,
  period_key text not null,
  payment_month text not null default '',
  payment_period text not null default '',
  stockist_id text not null references stockists(id) on delete restrict,
  sales_rupiah numeric(18,2) not null default 0,
  fee_rupiah numeric(18,2) not null default 0,
  member_bonus_rupiah numeric(18,2) not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table stockist_payouts add column if not exists payment_month text not null default '';
alter table stockist_payouts add column if not exists payment_period text not null default '';

create table if not exists member_bonus_payments (
  period_key text not null,
  payment_month text not null,
  payment_period text not null,
  member_id text not null references members(id) on delete restrict,
  paid boolean not null default false,
  paid_by text,
  paid_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (period_key, payment_month, payment_period, member_id)
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor_id text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists members_sponsor_idx on members (sponsor_id, joined_at, id);
create index if not exists members_placement_idx on members (placement_parent_id, placement_side, joined_at, id);
create index if not exists members_rank_idx on members (rank_name);
create index if not exists members_stockist_idx on members (stockist_id);
create index if not exists members_active_idx on members (active, id);
create index if not exists members_search_idx on members using gin (to_tsvector('simple', id || ' ' || name || ' ' || rank_name));
create index if not exists stockists_area_idx on stockists (active, area, district, id);
create index if not exists admins_active_idx on admins (active, role, area, id);
create index if not exists announcements_active_idx on announcements (active, status, published_at desc, id);
create index if not exists sponsor_closure_desc_idx on sponsor_closure (descendant_id, ancestor_id, depth);
create index if not exists sponsor_closure_depth_idx on sponsor_closure (ancestor_id, depth, descendant_id);
create index if not exists placement_closure_depth_idx on placement_closure (ancestor_id, depth, descendant_id);
create index if not exists pv_transactions_period_member_idx on pv_transactions (period_key, member_id);
create index if not exists metrics_period_rank_idx on member_period_metrics (period_key, rank_name);
create index if not exists bonus_ledger_period_member_idx on bonus_ledger (period_key, member_id);
create index if not exists bonus_ledger_period_type_idx on bonus_ledger (period_key, bonus_type);
create unique index if not exists stockist_payouts_unique_idx on stockist_payouts (period_key, payment_month, payment_period, stockist_id);
create index if not exists member_bonus_payments_member_idx on member_bonus_payments (member_id, period_key, payment_month, payment_period);
