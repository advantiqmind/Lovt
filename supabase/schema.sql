-- Run this in your Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null default '',
  pair_code text unique not null default upper(substr(md5(random()::text), 1, 6)),
  couple_id uuid,
  created_at timestamptz default now()
);

-- Couples
create table public.couples (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references public.profiles(id) on delete cascade not null,
  user2_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- FK from profiles to couples
alter table public.profiles
  add constraint profiles_couple_id_fkey
  foreign key (couple_id) references public.couples(id) on delete set null;

-- RLS
alter table public.profiles enable row level security;
alter table public.couples enable row level security;

-- Helper: get current user's couple_id without recursive RLS
create or replace function public.my_couple_id()
returns uuid as $$
  select couple_id from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- Profile policies
create policy "read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "read partner profile"
  on public.profiles for select
  using (couple_id is not null and couple_id = public.my_couple_id());

create policy "insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Couple policies
create policy "read own couple"
  on public.couples for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Pairing function (bypasses RLS safely)
create or replace function public.pair_with_code(partner_code text)
returns json as $$
declare
  current_user_id uuid := auth.uid();
  partner record;
  new_couple_id uuid;
begin
  -- Must be logged in
  if current_user_id is null then
    return json_build_object('error', 'Not authenticated');
  end if;

  -- Already paired?
  if exists (select 1 from public.profiles where id = current_user_id and couple_id is not null) then
    return json_build_object('error', 'You are already paired');
  end if;

  -- Find partner by code
  select * into partner
  from public.profiles
  where pair_code = upper(partner_code)
    and id != current_user_id
    and couple_id is null;

  if not found then
    return json_build_object('error', 'Code not found or already taken');
  end if;

  -- Create couple
  insert into public.couples (user1_id, user2_id)
  values (current_user_id, partner.id)
  returning id into new_couple_id;

  -- Link both profiles
  update public.profiles
  set couple_id = new_couple_id
  where id in (current_user_id, partner.id);

  return json_build_object('success', true, 'couple_id', new_couple_id);
end;
$$ language plpgsql security definer;
