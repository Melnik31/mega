-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('goalie', 'coach');
create type checkin_status as enum ('pre_only', 'completed');
create type focus_area as enum (
  'tracking', 'skating', 'movement', 'positioning', 'rebound_control',
  'hands', 'stick', 'reads', 'recovery', 'compete', 'mental_game', 'other'
);

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'goalie')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- TEAMS
-- ============================================================
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

alter table teams enable row level security;

-- ============================================================
-- TEAM MEMBERSHIPS
-- ============================================================
create table team_memberships (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role user_role not null,
  joined_at timestamptz not null default now(),
  unique (team_id, profile_id)
);
create index team_memberships_profile_id_idx on team_memberships (profile_id);

alter table team_memberships enable row level security;

-- ============================================================
-- SEASONS
-- ============================================================
create table seasons (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  name text not null,
  starts_on date not null,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index one_active_season_per_team on seasons (team_id) where is_active;

alter table seasons enable row level security;

-- ============================================================
-- SEASON GOALS
-- ============================================================
create table season_goals (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  goalie_id uuid not null references profiles(id) on delete cascade,

  -- Part 1: self-rating (1-10) across 13 skill areas
  tracking_score smallint not null check (tracking_score between 1 and 10),
  skating_score smallint not null check (skating_score between 1 and 10),
  edge_control_score smallint not null check (edge_control_score between 1 and 10),
  movement_control_score smallint not null check (movement_control_score between 1 and 10),
  positioning_score smallint not null check (positioning_score between 1 and 10),
  rebound_control_score smallint not null check (rebound_control_score between 1 and 10),
  hands_score smallint not null check (hands_score between 1 and 10),
  stick_score smallint not null check (stick_score between 1 and 10),
  reads_score smallint not null check (reads_score between 1 and 10),
  recovery_score smallint not null check (recovery_score between 1 and 10),
  compete_score smallint not null check (compete_score between 1 and 10),
  confidence_score smallint not null check (confidence_score between 1 and 10),
  hockey_iq_score smallint not null check (hockey_iq_score between 1 and 10),

  -- Part 2: reflection
  holding_back text[] not null default '{}',
  strengths text[] not null default '{}',

  -- Part 3: MY YEAR (contract with yourself)
  become_statement text not null,
  biggest_goal text not null,
  season_target text not null,
  top_priorities text[] not null default '{}',
  priorities_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, goalie_id)
);

alter table season_goals enable row level security;

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger season_goals_set_updated_at
  before update on season_goals
  for each row execute function public.set_updated_at();

-- ============================================================
-- PRACTICE SESSIONS (pre + post check-in, one row per practice)
-- ============================================================
create table practice_sessions (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  goalie_id uuid not null references profiles(id) on delete cascade,
  practice_date date not null default current_date,
  status checkin_status not null default 'pre_only',

  pre_energy smallint check (pre_energy between 1 and 10),
  pre_confidence smallint check (pre_confidence between 1 and 10),
  pre_focus smallint check (pre_focus between 1 and 10),
  pre_body smallint check (pre_body between 1 and 10),
  pre_mental_readiness smallint check (pre_mental_readiness between 1 and 10),
  pre_focus_area focus_area,
  pre_one_thing text not null,
  pre_submitted_at timestamptz,

  -- Technical
  post_tracking smallint check (post_tracking between 1 and 10),
  post_skating_edges smallint check (post_skating_edges between 1 and 10),
  post_movement_control smallint check (post_movement_control between 1 and 10),
  post_positioning smallint check (post_positioning between 1 and 10),
  post_rebound_control smallint check (post_rebound_control between 1 and 10),
  post_hands smallint check (post_hands between 1 and 10),
  post_stick smallint check (post_stick between 1 and 10),
  -- Mental
  post_focus smallint check (post_focus between 1 and 10),
  post_confidence smallint check (post_confidence between 1 and 10),
  post_compete smallint check (post_compete between 1 and 10),
  -- IQ
  post_reads smallint check (post_reads between 1 and 10),
  post_decision_making smallint check (post_decision_making between 1 and 10),

  post_focus_hit boolean,
  post_note text,
  post_submitted_at timestamptz,

  created_at timestamptz not null default now()
);
create index practice_sessions_goalie_date_idx on practice_sessions (goalie_id, practice_date desc);
create index practice_sessions_season_idx on practice_sessions (season_id);

alter table practice_sessions enable row level security;

-- ============================================================
-- HELPER FUNCTIONS (security definer, used by RLS policies to
-- avoid recursive policy evaluation on team_memberships)
-- ============================================================
create function public.is_team_member(p_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from team_memberships
    where team_id = p_team_id and profile_id = auth.uid()
  );
$$;

create function public.is_team_coach(p_team_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from team_memberships
    where team_id = p_team_id and profile_id = auth.uid() and role = 'coach'
  );
$$;

create function public.team_id_for_season(p_season_id uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select team_id from seasons where id = p_season_id;
$$;

-- ============================================================
-- RPCs (team creation / invite-code join happen here, not via
-- direct client inserts, so membership rows can't be self-assigned
-- into an arbitrary team_id)
-- ============================================================
create function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- excludes 0/O/1/I/L
  code text := '';
  i int;
begin
  for i in 1..8 loop
    code := code || substr(chars, (floor(random() * length(chars)) + 1)::int, 1);
  end loop;
  return code;
end;
$$;

create function public.create_team_with_coach(team_name text)
returns teams
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team teams;
  v_code text;
begin
  if (select role from profiles where id = auth.uid()) is distinct from 'coach' then
    raise exception 'Only coaches can create a team';
  end if;

  loop
    v_code := public.generate_invite_code();
    exit when not exists (select 1 from teams where invite_code = v_code);
  end loop;

  insert into teams (name, invite_code, created_by)
  values (team_name, v_code, auth.uid())
  returning * into v_team;

  insert into team_memberships (team_id, profile_id, role)
  values (v_team.id, auth.uid(), 'coach');

  insert into seasons (team_id, name, starts_on, is_active)
  values (v_team.id, to_char(now(), 'YYYY') || ' Season', current_date, true);

  return v_team;
end;
$$;

create function public.join_team_by_invite_code(code text)
returns teams
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team teams;
begin
  if (select role from profiles where id = auth.uid()) is distinct from 'goalie' then
    raise exception 'Only goalies can join a team via invite code';
  end if;

  select * into v_team from teams where invite_code = upper(code);

  if v_team.id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into team_memberships (team_id, profile_id, role)
  values (v_team.id, auth.uid(), 'goalie')
  on conflict (team_id, profile_id) do nothing;

  return v_team;
end;
$$;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- profiles: no insert policy — rows are created only by handle_new_user()
create policy "profiles: read own or teammate" on profiles
  for select using (
    id = auth.uid()
    or exists (
      select 1 from team_memberships tm1
      join team_memberships tm2 on tm1.team_id = tm2.team_id
      where tm1.profile_id = auth.uid() and tm2.profile_id = profiles.id
    )
  );

create policy "profiles: update own" on profiles
  for update using (id = auth.uid());

-- teams: no insert policy — rows are created only via the
-- security definer create_team_with_coach() RPC above
create policy "teams: read as member" on teams
  for select using (public.is_team_member(id));

create policy "teams: coach can update" on teams
  for update using (public.is_team_coach(id));

-- team_memberships: no insert policy — rows are created only via the
-- security definer RPCs above
create policy "team_memberships: read own team" on team_memberships
  for select using (public.is_team_member(team_id));

create policy "team_memberships: coach can remove" on team_memberships
  for delete using (public.is_team_coach(team_id));

-- seasons
create policy "seasons: read as team member" on seasons
  for select using (public.is_team_member(team_id));

create policy "seasons: coach can insert" on seasons
  for insert with check (public.is_team_coach(team_id));

create policy "seasons: coach can update" on seasons
  for update using (public.is_team_coach(team_id));

-- season_goals
create policy "season_goals: goalie reads own, coach reads team" on season_goals
  for select using (
    goalie_id = auth.uid()
    or public.is_team_coach(public.team_id_for_season(season_id))
  );

create policy "season_goals: goalie inserts own" on season_goals
  for insert with check (
    goalie_id = auth.uid()
    and public.is_team_member(public.team_id_for_season(season_id))
  );

create policy "season_goals: goalie updates own" on season_goals
  for update using (goalie_id = auth.uid());

-- practice_sessions
create policy "practice_sessions: goalie reads own, coach reads team" on practice_sessions
  for select using (
    goalie_id = auth.uid()
    or public.is_team_coach(public.team_id_for_season(season_id))
  );

create policy "practice_sessions: goalie inserts own" on practice_sessions
  for insert with check (
    goalie_id = auth.uid()
    and public.is_team_member(public.team_id_for_season(season_id))
  );

create policy "practice_sessions: goalie updates own" on practice_sessions
  for update using (goalie_id = auth.uid());

-- ============================================================
-- COACH WEEKLY RATINGS
-- ============================================================
create type rating_category as enum (
  'tracking', 'skating_edges', 'movement_control', 'positioning', 'rebound_control',
  'hands', 'stick', 'focus', 'confidence', 'compete', 'reads', 'decision_making'
);

create table coach_weekly_ratings (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references profiles(id) on delete cascade,
  goalie_id uuid not null references profiles(id) on delete cascade,
  week_start date not null,
  category_id rating_category not null,
  score smallint not null check (score between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (goalie_id, week_start, category_id)
);
create index coach_weekly_ratings_goalie_week_idx on coach_weekly_ratings (goalie_id, week_start);

alter table coach_weekly_ratings enable row level security;

create trigger coach_weekly_ratings_set_updated_at
  before update on coach_weekly_ratings
  for each row execute function public.set_updated_at();

-- team_id_for_season()/is_team_coach() don't apply here (no season_id on
-- this table), so a dedicated helper checks coach/goalie share a team.
create function public.is_teammate_coach(p_goalie_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from team_memberships coach_tm
    join team_memberships goalie_tm on coach_tm.team_id = goalie_tm.team_id
    where coach_tm.profile_id = auth.uid()
      and coach_tm.role = 'coach'
      and goalie_tm.profile_id = p_goalie_id
      and goalie_tm.role = 'goalie'
  );
$$;

create policy "coach_weekly_ratings: goalie reads own, coach reads teammate" on coach_weekly_ratings
  for select using (
    goalie_id = auth.uid()
    or public.is_teammate_coach(goalie_id)
  );

create policy "coach_weekly_ratings: coach inserts for teammate" on coach_weekly_ratings
  for insert with check (
    coach_id = auth.uid()
    and public.is_teammate_coach(goalie_id)
  );

create policy "coach_weekly_ratings: coach updates own submissions" on coach_weekly_ratings
  for update using (coach_id = auth.uid());

-- ============================================================
-- GRANTS
-- ============================================================
-- Postgres denies table access at the privilege layer before RLS is even
-- evaluated; new tables grant nothing to anon/authenticated by default, so
-- each needs an explicit grant matching exactly what its policies above
-- allow. Team/team_membership/season *creation* happens only inside the
-- security definer RPCs (which run as the function owner and so don't need
-- a grant here) — direct client inserts of those rows are intentionally
-- left ungranted.
grant select, update on profiles to authenticated;
grant select, update on teams to authenticated;
grant select, delete on team_memberships to authenticated;
grant select, insert, update on seasons to authenticated;
grant select, insert, update on season_goals to authenticated;
grant select, insert, update on practice_sessions to authenticated;
grant select, insert, update on coach_weekly_ratings to authenticated;
