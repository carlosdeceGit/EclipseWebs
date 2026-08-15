-- Esquema de la red de webs del eclipse 2027.
-- Aplicar con: supabase db push, o pegándolo en el editor SQL del proyecto.

-- ---------------------------------------------------------------------------
-- Anuncios: directorio de negocios y clasificados
-- ---------------------------------------------------------------------------

create type listing_kind as enum ('directory', 'classified');
create type listing_status as enum ('pending', 'approved', 'rejected', 'expired');
create type listing_tier as enum ('free', 'featured', 'sponsor');

create table listings (
  id uuid primary key default gen_random_uuid(),
  kind listing_kind not null,
  status listing_status not null default 'pending',
  tier listing_tier not null default 'free',

  -- Ordenar por un enum no es estable, así que materializamos el rango numérico
  -- y ordenamos por él. Se mantiene con un trigger.
  tier_rank smallint not null default 0,

  -- Ciudad a la que pertenece el anuncio; coincide con City.slug del código.
  city_slug text not null,
  category text not null,

  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 4000),
  price numeric(10, 2),

  contact_email text,
  contact_phone text,
  website text,
  image_url text,

  -- Dueño del anuncio cuando se ha creado desde una cuenta. Los anuncios enviados
  -- sin registro tienen owner nulo y se moderan igual.
  owner uuid references auth.users (id) on delete set null,

  -- Datos de moderación, nunca visibles para el público.
  moderation_note text,
  ip_hash text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

create index listings_public_idx
  on listings (kind, city_slug, status, tier_rank desc, created_at desc);
create index listings_owner_idx on listings (owner);
create index listings_expiry_idx on listings (expires_at) where status = 'approved';

create or replace function listings_before_write() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  new.tier_rank := case new.tier
    when 'sponsor' then 2
    when 'featured' then 1
    else 0
  end;

  -- Los clasificados caducan solos a los 60 días o el día después del eclipse,
  -- lo que llegue antes. El directorio no caduca.
  if new.kind = 'classified' and new.expires_at is null then
    new.expires_at := least(now() + interval '60 days', timestamptz '2027-08-03 00:00:00+02');
  end if;

  return new;
end;
$$;

create trigger listings_before_write
  before insert or update on listings
  for each row execute function listings_before_write();

alter table listings enable row level security;

-- Cualquiera puede leer lo aprobado y no caducado.
create policy "anuncios aprobados son públicos" on listings
  for select using (
    status = 'approved' and (expires_at is null or expires_at > now())
  );

-- Un usuario registrado ve y edita los suyos, en cualquier estado.
create policy "el dueño ve los suyos" on listings
  for select to authenticated using (owner = auth.uid());

create policy "el dueño crea los suyos" on listings
  for insert to authenticated with check (
    owner = auth.uid()
    -- Nadie se autoasigna un nivel de pago ni se autoaprueba: eso solo lo hace el
    -- backend con service role tras confirmar el cobro.
    and status = 'pending'
    and tier = 'free'
  );

create policy "el dueño edita los suyos" on listings
  for update to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid() and tier = 'free');

-- ---------------------------------------------------------------------------
-- Eventos: los alimenta el agente de eventos y la gente desde el formulario
-- ---------------------------------------------------------------------------

create table events (
  id uuid primary key default gen_random_uuid(),
  city_slug text not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  address text,
  lat double precision,
  lon double precision,
  is_free boolean not null default true,
  organizer text,
  -- URL de la convocatoria original. Sin fuente no se publica.
  source_url text not null,
  source_name text,
  status listing_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_public_idx on events (city_slug, status, starts_at);
-- Evita que el agente duplique el mismo acto en cada pasada diaria.
create unique index events_dedupe_idx on events (city_slug, lower(title), starts_at);

alter table events enable row level security;
create policy "eventos aprobados son públicos" on events
  for select using (status = 'approved');

-- ---------------------------------------------------------------------------
-- Registro de ejecuciones de los agentes
-- ---------------------------------------------------------------------------

create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  ok boolean,
  -- Resumen legible de lo que cambió, para poder auditar sin leer diffs.
  summary text,
  items_created int not null default 0,
  items_updated int not null default 0,
  error text
);

create index agent_runs_recent_idx on agent_runs (agent, started_at desc);

alter table agent_runs enable row level security;
-- Solo el backend lo lee y lo escribe; no hay política pública a propósito.

-- ---------------------------------------------------------------------------
-- Propuestas de cambio en datos astronómicos
--
-- El agente de datos no escribe directamente sobre las cifras del eclipse: deja
-- una propuesta con la fuente y un humano la aprueba. Un error aquí puede hacer
-- que alguien se quite el filtro solar a destiempo.
-- ---------------------------------------------------------------------------

create table data_proposals (
  id uuid primary key default gen_random_uuid(),
  city_slug text not null,
  field text not null,
  current_value text,
  proposed_value text not null,
  source_url text not null,
  source_name text,
  agent text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  reviewed_by text,
  created_at timestamptz not null default now()
);

create index data_proposals_pending_idx on data_proposals (status, created_at desc);

alter table data_proposals enable row level security;
