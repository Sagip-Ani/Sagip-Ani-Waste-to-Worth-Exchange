-- ============================================================
-- SAGIP-ANI
-- Complete Supabase / PostgreSQL Database Schema
-- ============================================================
--
-- Supports:
--   Authentication profiles
--   Buyer profiles
--   Supplier profiles
--   Buyer demands
--   Supplier material listings
--   Geographic locations / PostGIS
--   Matching records
--   Buyer/supplier requests
--   Row Level Security
--
-- Designed for the current Sagip-Ani React/Vite application.
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

create extension if not exists pgcrypto;

create extension if not exists postgis;


-- ============================================================
-- 2. ENUM TYPES
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'user_role'
  ) then
    create type public.user_role as enum (
      'buyer',
      'supplier'
    );
  end if;
end
$$;


-- ============================================================
-- 3. PROFILES
-- ============================================================
--
-- One profile per Supabase Auth user.
--
-- id MUST equal auth.users.id.
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text not null,

  role public.user_role not null,

  contact_number text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 4. SUPPLIER PROFILES
-- ============================================================

create table if not exists public.supplier_profiles (
  user_id uuid primary key
    references public.profiles(id)
    on delete cascade,

  farm_or_coop_name text not null,

  barangay text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 5. BUYER PROFILES
-- ============================================================

create table if not exists public.buyer_profiles (
  user_id uuid primary key
    references public.profiles(id)
    on delete cascade,

  business_name text not null,

  business_type text not null default 'other',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 6. BUYER DEMANDS
-- ============================================================
--
-- A buyer can create multiple demand posts.
--
-- location:
--   PostGIS POINT using SRID 4326.
--
-- Example:
--   POINT(124.8688 8.3597)
--
-- IMPORTANT:
--   PostGIS uses:
--     longitude = X
--     latitude  = Y
-- ============================================================

create table if not exists public.buyer_demands (
  id uuid primary key default gen_random_uuid(),

  buyer_id uuid not null
    references public.profiles(id)
    on delete cascade,

  material_type text not null,

  quantity_needed_kg numeric(12,2) not null,

  location geometry(Point, 4326) not null,

  max_distance_km numeric(10,2) not null,

  status text not null default 'active',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint buyer_demands_quantity_positive
    check (quantity_needed_kg > 0),

  constraint buyer_demands_distance_nonnegative
    check (max_distance_km >= 0),

  constraint buyer_demands_status_check
    check (
      status in (
        'active',
        'paused',
        'fulfilled',
        'cancelled',
        'expired'
      )
    )
);


-- ============================================================
-- 7. SUPPLIER MATERIAL LISTINGS
-- ============================================================
--
-- A supplier can have multiple material listings.
-- ============================================================

create table if not exists public.material_listings (
  id uuid primary key default gen_random_uuid(),

  supplier_id uuid not null
    references public.profiles(id)
    on delete cascade,

  material_type text not null,

  quantity_kg numeric(12,2) not null,

  location geometry(Point, 4326) not null,

  available_from date not null,

  available_until date not null,

  status text not null default 'listed',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint material_listings_quantity_positive
    check (quantity_kg > 0),

  constraint material_listings_dates_valid
    check (available_until >= available_from),

  constraint material_listings_status_check
    check (
      status in (
        'listed',
        'paused',
        'sold',
        'expired',
        'cancelled'
      )
    )
);


-- ============================================================
-- 8. MATCHES
-- ============================================================
--
-- A match connects:
--
--   buyer_demands
--        +
--   material_listings
--
-- score:
--   0.00 - 1.00
--
-- distance_km:
--   calculated distance between buyer and supplier.
--
-- The matching engine can populate/update this table.
-- ============================================================

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),

  demand_id uuid not null
    references public.buyer_demands(id)
    on delete cascade,

  listing_id uuid not null
    references public.material_listings(id)
    on delete cascade,

  score numeric(6,5) not null,

  distance_km numeric(10,2) not null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint matches_score_range
    check (
      score >= 0
      and score <= 1
    ),

  constraint matches_distance_nonnegative
    check (
      distance_km >= 0
    ),

  constraint matches_unique_pair
    unique (demand_id, listing_id)
);


-- ============================================================
-- 9. REQUESTS
-- ============================================================
--
-- A request is created from a match.
--
-- initiated_by:
--   auth.users.id of the user who initiated it.
-- ============================================================

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),

  match_id uuid not null
    references public.matches(id)
    on delete cascade,

  initiated_by uuid not null
    references public.profiles(id)
    on delete cascade,

  status text not null default 'pending',

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint requests_status_check
    check (
      status in (
        'pending',
        'accepted',
        'rejected',
        'cancelled',
        'completed'
      )
    )
);


-- ============================================================
-- 10. INDEXES
-- ============================================================


-- Profiles

create index if not exists profiles_role_idx
  on public.profiles(role);


-- Buyer demands

create index if not exists buyer_demands_buyer_id_idx
  on public.buyer_demands(buyer_id);

create index if not exists buyer_demands_material_type_idx
  on public.buyer_demands(material_type);

create index if not exists buyer_demands_status_idx
  on public.buyer_demands(status);

create index if not exists buyer_demands_location_idx
  on public.buyer_demands
  using gist(location);


-- Material listings

create index if not exists material_listings_supplier_id_idx
  on public.material_listings(supplier_id);

create index if not exists material_listings_material_type_idx
  on public.material_listings(material_type);

create index if not exists material_listings_status_idx
  on public.material_listings(status);

create index if not exists material_listings_location_idx
  on public.material_listings
  using gist(location);


-- Matches

create index if not exists matches_demand_id_idx
  on public.matches(demand_id);

create index if not exists matches_listing_id_idx
  on public.matches(listing_id);

create index if not exists matches_score_idx
  on public.matches(score desc);

create index if not exists matches_distance_idx
  on public.matches(distance_km);


-- Requests

create index if not exists requests_match_id_idx
  on public.requests(match_id);

create index if not exists requests_initiated_by_idx
  on public.requests(initiated_by);

create index if not exists requests_status_idx
  on public.requests(status);


-- ============================================================
-- 11. UPDATED_AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 12. UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists profiles_set_updated_at
on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();


drop trigger if exists supplier_profiles_set_updated_at
on public.supplier_profiles;

create trigger supplier_profiles_set_updated_at
before update on public.supplier_profiles
for each row
execute function public.set_updated_at();


drop trigger if exists buyer_profiles_set_updated_at
on public.buyer_profiles;

create trigger buyer_profiles_set_updated_at
before update on public.buyer_profiles
for each row
execute function public.set_updated_at();


drop trigger if exists buyer_demands_set_updated_at
on public.buyer_demands;

create trigger buyer_demands_set_updated_at
before update on public.buyer_demands
for each row
execute function public.set_updated_at();


drop trigger if exists material_listings_set_updated_at
on public.material_listings;

create trigger material_listings_set_updated_at
before update on public.material_listings
for each row
execute function public.set_updated_at();


drop trigger if exists matches_set_updated_at
on public.matches;

create trigger matches_set_updated_at
before update on public.matches
for each row
execute function public.set_updated_at();


drop trigger if exists requests_set_updated_at
on public.requests;

create trigger requests_set_updated_at
before update on public.requests
for each row
execute function public.set_updated_at();


-- ============================================================
-- 13. HELPER FUNCTIONS FOR RLS
-- ============================================================
--
-- SECURITY DEFINER prevents RLS recursion when checking whether
-- a user participates in a match.
-- ============================================================


create or replace function public.is_match_participant(
  p_match_id uuid,
  p_user_id uuid
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.matches m
    join public.buyer_demands d
      on d.id = m.demand_id
    join public.material_listings l
      on l.id = m.listing_id
    where m.id = p_match_id
      and (
        d.buyer_id = p_user_id
        or l.supplier_id = p_user_id
      )
  );
$$;


create or replace function public.can_view_listing(
  p_listing_id uuid,
  p_user_id uuid
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.material_listings l
    where l.id = p_listing_id
      and (
        l.supplier_id = p_user_id
        or exists (
          select 1
          from public.matches m
          join public.buyer_demands d
            on d.id = m.demand_id
          where m.listing_id = l.id
            and d.buyer_id = p_user_id
        )
      )
  );
$$;


create or replace function public.can_view_demand(
  p_demand_id uuid,
  p_user_id uuid
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.buyer_demands d
    where d.id = p_demand_id
      and (
        d.buyer_id = p_user_id
        or exists (
          select 1
          from public.matches m
          join public.material_listings l
            on l.id = m.listing_id
          where m.demand_id = d.id
            and l.supplier_id = p_user_id
        )
      )
  );
$$;


-- ============================================================
-- 14. ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles
enable row level security;

alter table public.supplier_profiles
enable row level security;

alter table public.buyer_profiles
enable row level security;

alter table public.buyer_demands
enable row level security;

alter table public.material_listings
enable row level security;

alter table public.matches
enable row level security;

alter table public.requests
enable row level security;


-- ============================================================
-- 15. PROFILES POLICIES
-- ============================================================

drop policy if exists "profiles_select_own"
on public.profiles;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);


drop policy if exists "profiles_insert_own"
on public.profiles;

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);


drop policy if exists "profiles_update_own"
on public.profiles;

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);


-- ============================================================
-- 16. SUPPLIER PROFILE POLICIES
-- ============================================================

drop policy if exists "supplier_profiles_select_own"
on public.supplier_profiles;

create policy "supplier_profiles_select_own"
on public.supplier_profiles
for select
to authenticated
using (
  user_id = auth.uid()
);


drop policy if exists "supplier_profiles_insert_own"
on public.supplier_profiles;

create policy "supplier_profiles_insert_own"
on public.supplier_profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
);


drop policy if exists "supplier_profiles_update_own"
on public.supplier_profiles;

create policy "supplier_profiles_update_own"
on public.supplier_profiles
for update
to authenticated
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
);


-- ============================================================
-- 17. BUYER PROFILE POLICIES
-- ============================================================

drop policy if exists "buyer_profiles_select_own"
on public.buyer_profiles;

create policy "buyer_profiles_select_own"
on public.buyer_profiles
for select
to authenticated
using (
  user_id = auth.uid()
);


drop policy if exists "buyer_profiles_insert_own"
on public.buyer_profiles;

create policy "buyer_profiles_insert_own"
on public.buyer_profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
);


drop policy if exists "buyer_profiles_update_own"
on public.buyer_profiles;

create policy "buyer_profiles_update_own"
on public.buyer_profiles
for update
to authenticated
using (
  user_id = auth.uid()
)
with check (
  user_id = auth.uid()
);


-- ============================================================
-- 18. BUYER DEMANDS POLICIES
-- ============================================================
--
-- Buyers:
--   SELECT/INSERT/UPDATE/DELETE their own demands.
--
-- Suppliers:
--   SELECT demands only when a match exists for one of their
--   listings.
-- ============================================================

drop policy if exists "buyer_demands_select"
on public.buyer_demands;

create policy "buyer_demands_select"
on public.buyer_demands
for select
to authenticated
using (
  public.can_view_demand(id, auth.uid())
);


drop policy if exists "buyer_demands_insert_own"
on public.buyer_demands;

create policy "buyer_demands_insert_own"
on public.buyer_demands
for insert
to authenticated
with check (
  buyer_id = auth.uid()
);


drop policy if exists "buyer_demands_update_own"
on public.buyer_demands;

create policy "buyer_demands_update_own"
on public.buyer_demands
for update
to authenticated
using (
  buyer_id = auth.uid()
)
with check (
  buyer_id = auth.uid()
);


drop policy if exists "buyer_demands_delete_own"
on public.buyer_demands;

create policy "buyer_demands_delete_own"
on public.buyer_demands
for delete
to authenticated
using (
  buyer_id = auth.uid()
);


-- ============================================================
-- 19. MATERIAL LISTING POLICIES
-- ============================================================
--
-- Suppliers:
--   SELECT/INSERT/UPDATE/DELETE their own listings.
--
-- Buyers:
--   SELECT listings that have been matched to one of their
--   demands.
-- ============================================================

drop policy if exists "material_listings_select"
on public.material_listings;

create policy "material_listings_select"
on public.material_listings
for select
to authenticated
using (
  public.can_view_listing(id, auth.uid())
);


drop policy if exists "material_listings_insert_own"
on public.material_listings;

create policy "material_listings_insert_own"
on public.material_listings
for insert
to authenticated
with check (
  supplier_id = auth.uid()
);


drop policy if exists "material_listings_update_own"
on public.material_listings;

create policy "material_listings_update_own"
on public.material_listings
for update
to authenticated
using (
  supplier_id = auth.uid()
)
with check (
  supplier_id = auth.uid()
);


drop policy if exists "material_listings_delete_own"
on public.material_listings;

create policy "material_listings_delete_own"
on public.material_listings
for delete
to authenticated
using (
  supplier_id = auth.uid()
);


-- ============================================================
-- 20. MATCH POLICIES
-- ============================================================
--
-- A user can only see a match if they are either:
--
--   buyer of the demand
--        OR
--   supplier of the listing
--
-- Matches are normally generated by the matching engine.
-- ============================================================

drop policy if exists "matches_select_participant"
on public.matches;

create policy "matches_select_participant"
on public.matches
for select
to authenticated
using (
  public.is_match_participant(id, auth.uid())
);


-- Do NOT allow normal users to arbitrarily create matches.
--
-- The matching engine should insert them using a trusted
-- backend/service-role process.
--
-- Therefore there is intentionally no INSERT policy for
-- authenticated users here.


-- ============================================================
-- 21. REQUEST POLICIES
-- ============================================================
--
-- Both participants of a match can view requests belonging
-- to that match.
-- ============================================================

drop policy if exists "requests_select_participant"
on public.requests;

create policy "requests_select_participant"
on public.requests
for select
to authenticated
using (
  public.is_match_participant(match_id, auth.uid())
);


drop policy if exists "requests_insert_participant"
on public.requests;

create policy "requests_insert_participant"
on public.requests
for insert
to authenticated
with check (
  initiated_by = auth.uid()
  and public.is_match_participant(match_id, auth.uid())
);


drop policy if exists "requests_update_participant"
on public.requests;

create policy "requests_update_participant"
on public.requests
for update
to authenticated
using (
  public.is_match_participant(match_id, auth.uid())
)
with check (
  public.is_match_participant(match_id, auth.uid())
);


-- ============================================================
-- 22. GRANTS
-- ============================================================
--
-- Supabase normally grants these automatically, but explicitly
-- defining them makes the intended API access clear.
-- ============================================================

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.profiles
to authenticated;

grant select, insert, update
on public.supplier_profiles
to authenticated;

grant select, insert, update
on public.buyer_profiles
to authenticated;

grant select, insert, update, delete
on public.buyer_demands
to authenticated;

grant select, insert, update, delete
on public.material_listings
to authenticated;

grant select
on public.matches
to authenticated;

grant select, insert, update
on public.requests
to authenticated;


-- ============================================================
-- 23. OPTIONAL: MAP-FRIENDLY VIEW
-- ============================================================
--
-- This makes latitude/longitude easy for the React/Leaflet
-- frontend to consume without having to parse PostGIS values.
-- ============================================================

create or replace view public.buyer_demand_map_points
with (security_invoker = true)
as
select
  d.id,
  d.buyer_id,
  d.material_type,
  d.quantity_needed_kg,
  d.max_distance_km,
  st_y(d.location)::numeric as latitude,
  st_x(d.location)::numeric as longitude,
  d.status,
  d.created_at
from public.buyer_demands d;


create or replace view public.material_listing_map_points
with (security_invoker = true)
as
select
  l.id,
  l.supplier_id,
  l.material_type,
  l.quantity_kg,
  st_y(l.location)::numeric as latitude,
  st_x(l.location)::numeric as longitude,
  l.available_from,
  l.available_until,
  l.status,
  l.created_at
from public.material_listings l;


-- ============================================================
-- 24. OPTIONAL: MATCH MAP VIEW
-- ============================================================
--
-- Provides both buyer and supplier coordinates for matched
-- records.
-- ============================================================

create or replace view public.match_map_points
with (security_invoker = true)
as
select
  m.id as match_id,
  m.demand_id,
  m.listing_id,
  m.score,
  m.distance_km,

  d.buyer_id,
  d.material_type as demand_material_type,
  d.quantity_needed_kg,

  st_y(d.location)::numeric as buyer_latitude,
  st_x(d.location)::numeric as buyer_longitude,

  l.supplier_id,
  l.material_type as listing_material_type,
  l.quantity_kg,

  st_y(l.location)::numeric as supplier_latitude,
  st_x(l.location)::numeric as supplier_longitude,

  m.created_at

from public.matches m

join public.buyer_demands d
  on d.id = m.demand_id

join public.material_listings l
  on l.id = m.listing_id;


-- ============================================================
-- DONE
-- ============================================================