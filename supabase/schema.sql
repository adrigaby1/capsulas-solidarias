-- Cápsulas Solidarias — esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase (proyecto nuevo o existente).

create extension if not exists "pgcrypto";

-- Donaciones ---------------------------------------------------------------

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  amount_cents integer not null,
  currency text not null default 'eur',
  donor_email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists donations_status_idx on public.donations (status);

-- Submissions (formulario + resultado de la cápsula) ------------------------

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations (id) on delete set null,
  photo_url text not null,
  form_data jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'generating', 'ready', 'error')),
  image_url text,
  prompt text,
  error_message text,
  gallery_consent boolean not null default false,
  terremoto_theme boolean not null default false,
  show_donation_amount boolean not null default false,
  created_at timestamptz not null default now()
);

-- Migración: si la tabla ya existía de antes (sin estas columnas), esto las
-- añade sin tocar los datos existentes. Seguro de ejecutar varias veces.
alter table public.submissions add column if not exists gallery_consent boolean not null default false;
alter table public.submissions add column if not exists terremoto_theme boolean not null default false;
alter table public.submissions add column if not exists show_donation_amount boolean not null default false;

create index if not exists submissions_donation_id_idx on public.submissions (donation_id);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_gallery_idx on public.submissions (status, gallery_consent) where status = 'ready' and gallery_consent = true;

-- Row Level Security ---------------------------------------------------------
-- Todas las escrituras y lecturas sensibles pasan por los API routes de
-- Next.js usando la Service Role Key (que ignora RLS). Por eso dejamos RLS
-- activado sin políticas públicas: el cliente (clave anónima) no puede leer
-- ni escribir directamente estas tablas.

alter table public.donations enable row level security;
alter table public.submissions enable row level security;

-- Storage ---------------------------------------------------------------
-- Crea manualmente estos dos buckets desde el panel de Supabase > Storage
-- (o descomenta las siguientes líneas si tu plan lo permite vía SQL):
--
--   capsule-photos   -> fotos originales subidas por los usuarios (privado o público de solo lectura)
--   capsule-results  -> cápsulas generadas por IA, listas para compartir (público de solo lectura)
--
-- insert into storage.buckets (id, name, public) values ('capsule-photos', 'capsule-photos', true);
-- insert into storage.buckets (id, name, public) values ('capsule-results', 'capsule-results', true);
