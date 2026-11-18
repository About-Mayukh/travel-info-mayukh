-- ==============================================================================
-- WanderSpot Database Schema (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID generation extension if not already enabled
create extension if not exists "pgcrypto";

-- 1. PROFILES TABLE
-- Extends Supabase auth.users with app-specific profile info and authorization role
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- 2. SPOTS TABLE
-- Tourist spots catalog categorized by area with geolocation and pricing
create table if not exists spots (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  name text not null,
  description text,
  category text, -- 'beach', 'hill', 'heritage', 'wildlife', 'religious'
  latitude double precision not null,
  longitude double precision not null,
  adult_price numeric default 0,
  child_price numeric default 0,
  best_time text,
  cover_image text,
  cover_credit_name text,
  cover_credit_url text,
  created_at timestamptz default now()
);

-- 3. REVIEWS TABLE
-- User ratings and comments for tourist spots
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references spots on delete cascade,
  user_id uuid references profiles on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- 4. PHOTOS TABLE
-- Real community photos uploaded by visitors with moderation status
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references spots on delete cascade,
  user_id uuid references profiles on delete cascade,
  image_url text not null,
  approved boolean default true,
  likes int default 0,
  created_at timestamptz default now()
);

-- 5. BOOKINGS TABLE
-- Itinerary spot reservations and estimated ticket prices
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references spots on delete cascade,
  user_id uuid references profiles on delete cascade,
  visit_date date,
  adults int default 1,
  children int default 0,
  total_price numeric,
  created_at timestamptz default now()
);

-- 6. FAVORITES TABLE
-- Wishlist linking users to their saved tourist spots
create table if not exists favorites (
  user_id uuid references profiles on delete cascade,
  spot_id uuid references spots on delete cascade,
  primary key (user_id, spot_id)
);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    'user' -- New users are strictly 'user' by default
  );
  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table spots enable row level security;
alter table reviews enable row level security;
alter table photos enable row level security;
alter table bookings enable row level security;
alter table favorites enable row level security;

-- Helper function: Check if current authenticated user has 'admin' role
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
-- Authenticated users can read any profile (needed for author display)
create policy "Profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

-- Users can update only their own profile, but cannot change their own role
create policy "Users can update own profile except role"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id and
    (role = (select role from profiles where id = auth.uid()) or is_admin())
  );

-- Admins can update any profile
create policy "Admins can update any profile"
  on profiles for update
  to authenticated
  using (is_admin());

-- ------------------------------------------------------------------------------
-- Spots Policies
-- ------------------------------------------------------------------------------
-- Any authenticated user can read tourist spots
create policy "Spots are readable by authenticated users"
  on spots for select
  to authenticated
  using (true);

-- Anonymous users can also read spots (e.g. for landing preview if needed)
create policy "Spots are readable by anon"
  on spots for select
  to anon
  using (true);

-- Only admins can create, modify, or delete spots
create policy "Admins can insert spots"
  on spots for insert
  to authenticated
  with check (is_admin());

create policy "Admins can update spots"
  on spots for update
  to authenticated
  using (is_admin());

create policy "Admins can delete spots"
  on spots for delete
  to authenticated
  using (is_admin());

-- ------------------------------------------------------------------------------
-- Reviews Policies
-- ------------------------------------------------------------------------------
-- Any authenticated user can view reviews
create policy "Reviews viewable by authenticated"
  on reviews for select
  to authenticated
  using (true);

-- Authenticated users can create reviews for themselves
create policy "Users can insert own reviews"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can edit their own reviews
create policy "Users can update own reviews"
  on reviews for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own reviews; Admins can delete any review (spam moderation)
create policy "Users or admins can delete reviews"
  on reviews for delete
  to authenticated
  using (auth.uid() = user_id or is_admin());

-- ------------------------------------------------------------------------------
-- Photos Policies
-- ------------------------------------------------------------------------------
-- View approved photos, own photos, or any photo if admin
create policy "Approved photos or own photos viewable"
  on photos for select
  to authenticated
  using (approved = true or auth.uid() = user_id or is_admin());

-- Authenticated users can upload photos linked to their user_id
create policy "Users can insert own photos"
  on photos for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Photo updates: users can toggle like count; Admins can approve/reject
create policy "Photos update policy"
  on photos for update
  to authenticated
  using (auth.uid() = user_id or is_admin() or true);

-- Users can delete their own photos; Admins can delete any photo
create policy "Users or admins can delete photos"
  on photos for delete
  to authenticated
  using (auth.uid() = user_id or is_admin());

-- ------------------------------------------------------------------------------
-- Bookings Policies
-- ------------------------------------------------------------------------------
-- Users can view their own bookings; Admins can view all bookings
create policy "Users view own bookings"
  on bookings for select
  to authenticated
  using (auth.uid() = user_id or is_admin());

-- Users can insert their own bookings
create policy "Users insert own bookings"
  on bookings for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can delete their own bookings
create policy "Users delete own bookings"
  on bookings for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Favorites Policies
-- ------------------------------------------------------------------------------
-- Users can view their own favorites
create policy "Users view own favorites"
  on favorites for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own favorites
create policy "Users insert own favorites"
  on favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can delete their own favorites
create policy "Users delete own favorites"
  on favorites for delete
  to authenticated
  using (auth.uid() = user_id);

-- ==============================================================================
-- ROLE PERMISSIONS (Required for PostgREST / Supabase Client)
-- ==============================================================================
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
grant all on all routines in schema public to postgres, anon, authenticated, service_role;

