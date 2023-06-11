-- -- Set up the database -- --

-- create enum for employee roles
create type public.employee_role as enum ('admin', 'user');

-- create table for employees
create table public.employees (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  given_name text not null,
  family_name text not null,
  role public.employee_role not null default 'user',
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint given_name_length check (char_length(given_name) >= 2),
  constraint family_name_length check (char_length(family_name) >= 2)
);

-- create table for customers
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  given_name text,
  family_name text,
  address_line_1 text,
  address_line_2 text,
  city text,
  postcode text,
  country text,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint given_name_length check (char_length(given_name) >= 2),
  constraint family_name_length check (char_length(family_name) >= 2)
);

-- create table for orders
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customers on delete cascade not null,
  is_online boolean not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for equipment_types
create table public.equipment_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  image_url text,
  deposit_price int not null,
  hourly_price int not null,
  daily_price int not null,
  weekly_price int not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for equipment
create table public.equipment (
  id uuid primary key default uuid_generate_v4(),
  equipment_type_id uuid references public.equipment_types on delete cascade not null,
  notes text,
  is_available boolean not null default true,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for hires
create table public.hires (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders on delete cascade not null,
  equipment_id uuid references public.equipment on delete cascade not null,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  is_collected boolean not null default false,
  is_returned boolean not null default false,
  is_paid boolean not null default false,
  is_deposit_paid boolean not null default false,
  is_deposit_returned boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- create table for products
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  image_url text,
  price int not null,
  stock int not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- create table for purchases
create table purchases (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  quantity int not null,
  is_paid boolean not null default false,
  is_collected boolean not null default false,
  is_delivered boolean not null default false,
  is_refunded boolean not null default false,
  is_returned boolean not null default false,
  is_cancelled boolean not null default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS
FROM PUBLIC;

-- create a customer when a new user is created
create function public.handle_new_user() returns trigger as $$ begin if (new.raw_user_meta_data->>'employee') is not null then return new;
end if;
if (new.email) is null then raise exception 'Email is required';
end if;
if (new.raw_user_meta_data->>'given_name') is null then raise exception 'Given name is required';
end if;
if (new.raw_user_meta_data->>'family_name') is null then raise exception 'Family name is required';
end if;
insert into public.customers (
    email,
    given_name,
    family_name,
    address_line_1,
    address_line_2,
    city,
    postcode,
    country
  )
values (
    new.email,
    new.raw_user_meta_data->>'given_name',
    new.raw_user_meta_data->>'family_name',
    new.raw_user_meta_data->>'address_line_1',
    new.raw_user_meta_data->>'address_line_2',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'postcode',
    new.raw_user_meta_data->>'country'
  );
return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
GRANT execute ON FUNCTION public.handle_new_user() TO PUBLIC;

-- -- Set up storage -- --

-- create a bucket for media
insert into storage.buckets (id, name)
values ('media', 'media');
create policy "Anyone can view a piece of meida" on storage.objects for
select using (bucket_id = 'media');
create policy "Anyone authenticated can insert a piece of media" on storage.objects for
insert with check (
    (bucket_id = 'media')
    AND (auth.role() = 'authenticated')
  );