create type "public"."employee_role" as enum ('admin', 'user');

create table "public"."customers" (
    "id" uuid not null default uuid_generate_v4(),
    "email" text not null,
    "given_name" text,
    "family_name" text,
    "address_line_1" text,
    "address_line_2" text,
    "city" text,
    "postcode" text,
    "country" text,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."employees" (
    "id" uuid not null default uuid_generate_v4(),
    "email" text not null,
    "given_name" text not null,
    "family_name" text not null,
    "role" employee_role not null default 'user'::employee_role,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."equipment" (
    "id" uuid not null default uuid_generate_v4(),
    "equipment_type_id" uuid not null,
    "notes" text,
    "is_available" boolean not null default true,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."equipment_types" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text not null,
    "image_url" text,
    "deposit_price" integer not null,
    "hourly_price" integer not null,
    "daily_price" integer not null,
    "weekly_price" integer not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."hires" (
    "id" uuid not null default uuid_generate_v4(),
    "order_id" uuid not null,
    "equipment_id" uuid not null,
    "start_at" timestamp with time zone not null,
    "end_at" timestamp with time zone not null,
    "is_collected" boolean not null default false,
    "is_returned" boolean not null default false,
    "is_paid" boolean not null default false,
    "is_deposit_paid" boolean not null default false,
    "is_deposit_returned" boolean not null default false,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."orders" (
    "id" uuid not null default uuid_generate_v4(),
    "customer_id" uuid not null,
    "is_online" boolean not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."products" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text not null,
    "image_url" text,
    "price" integer not null,
    "stock" integer not null,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


create table "public"."purchases" (
    "id" uuid not null default uuid_generate_v4(),
    "order_id" uuid not null,
    "product_id" uuid not null,
    "quantity" integer not null,
    "is_paid" boolean not null default false,
    "is_collected" boolean not null default false,
    "is_delivered" boolean not null default false,
    "is_refunded" boolean not null default false,
    "is_returned" boolean not null default false,
    "is_cancelled" boolean not null default false,
    "inserted_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX customers_email_key ON public.customers USING btree (email);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);

CREATE UNIQUE INDEX employees_pkey ON public.employees USING btree (id);

CREATE UNIQUE INDEX equipment_pkey ON public.equipment USING btree (id);

CREATE UNIQUE INDEX equipment_types_pkey ON public.equipment_types USING btree (id);

CREATE UNIQUE INDEX hires_pkey ON public.hires USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX purchases_pkey ON public.purchases USING btree (id);

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."employees" add constraint "employees_pkey" PRIMARY KEY using index "employees_pkey";

alter table "public"."equipment" add constraint "equipment_pkey" PRIMARY KEY using index "equipment_pkey";

alter table "public"."equipment_types" add constraint "equipment_types_pkey" PRIMARY KEY using index "equipment_types_pkey";

alter table "public"."hires" add constraint "hires_pkey" PRIMARY KEY using index "hires_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."purchases" add constraint "purchases_pkey" PRIMARY KEY using index "purchases_pkey";

alter table "public"."customers" add constraint "customers_email_key" UNIQUE using index "customers_email_key";

alter table "public"."customers" add constraint "family_name_length" CHECK ((char_length(family_name) >= 2)) not valid;

alter table "public"."customers" validate constraint "family_name_length";

alter table "public"."customers" add constraint "given_name_length" CHECK ((char_length(given_name) >= 2)) not valid;

alter table "public"."customers" validate constraint "given_name_length";

alter table "public"."employees" add constraint "employees_email_key" UNIQUE using index "employees_email_key";

alter table "public"."employees" add constraint "family_name_length" CHECK ((char_length(family_name) >= 2)) not valid;

alter table "public"."employees" validate constraint "family_name_length";

alter table "public"."employees" add constraint "given_name_length" CHECK ((char_length(given_name) >= 2)) not valid;

alter table "public"."employees" validate constraint "given_name_length";

alter table "public"."equipment" add constraint "equipment_equipment_type_id_fkey" FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id) ON DELETE CASCADE not valid;

alter table "public"."equipment" validate constraint "equipment_equipment_type_id_fkey";

alter table "public"."hires" add constraint "hires_equipment_id_fkey" FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE not valid;

alter table "public"."hires" validate constraint "hires_equipment_id_fkey";

alter table "public"."hires" add constraint "hires_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."hires" validate constraint "hires_order_id_fkey";

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."purchases" add constraint "purchases_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."purchases" validate constraint "purchases_order_id_fkey";

alter table "public"."purchases" add constraint "purchases_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."purchases" validate constraint "purchases_product_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin if (new.raw_user_meta_data->>'employee') is not null then return new;
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
$function$
;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

create policy "Anyone authenticated can insert a piece of media"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'media'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Anyone can view a piece of meida"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'media'::text));



