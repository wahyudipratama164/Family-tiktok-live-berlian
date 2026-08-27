-- Tambahan fitur LIVE & BERLIAN untuk Family TikTok
alter table public.members
  add column if not exists diamonds bigint not null default 0;

create table if not exists public.live_history (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  live_date timestamptz not null default now(),
  duration_minutes integer not null default 0,
  diamonds bigint not null default 0 check (diamonds >= 0),
  notes text,
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

alter table public.live_history enable row level security;

create policy "chief manages live history"
on public.live_history for all to authenticated
using (
 exists(select 1 from public.families f
        where f.id=live_history.family_id and f.chief_id=auth.uid())
)
with check (
 exists(select 1 from public.families f
        where f.id=live_history.family_id and f.chief_id=auth.uid())
);

-- Fungsi aman: simpan hasil live dan otomatis menambah total berlian anggota
create or replace function public.record_live(
 p_member_id uuid,
 p_duration_minutes integer,
 p_diamonds bigint,
 p_notes text default null,
 p_source text default 'manual'
) returns public.live_history
language plpgsql security invoker
as $$
declare
  m public.members;
  result public.live_history;
begin
  select * into m from public.members where id=p_member_id for update;
  if not found then raise exception 'Anggota tidak ditemukan'; end if;

  if not exists (
    select 1 from public.families f
    where f.id=m.family_id and f.chief_id=auth.uid()
  ) then raise exception 'Tidak memiliki izin'; end if;

  insert into public.live_history
    (family_id,member_id,duration_minutes,diamonds,notes,source)
  values
    (m.family_id,m.id,greatest(p_duration_minutes,0),greatest(p_diamonds,0),p_notes,p_source)
  returning * into result;

  update public.members
  set diamonds=diamonds+greatest(p_diamonds,0)
  where id=m.id;

  return result;
end;
$$;

-- Ranking otomatis berdasarkan total berlian
create or replace view public.family_diamond_ranking as
select
  m.id,m.family_id,m.name,m.role,m.color,m.tiktok_username,
  m.diamonds,
  rank() over(partition by m.family_id order by m.diamonds desc) as rank
from public.members m;

grant select on public.family_diamond_ranking to authenticated;
