insert into equipment_types (name, description, deposit_price, hourly_price, daily_price, weekly_price)
values (
    'Carrera Vengeance Mens Mountain Bike',
    '',
    15000,
    1000,
    3000,
    10000
),
(
    'Carrera Vengeance E Mens Electric Mountain Bike',
    '',
    15000,
    1000,
    3000,
    10000
);

insert into equipment (equipment_type_id, notes)
values (
    (select id from equipment_types where name = 'Carrera Vengeance Mens Mountain Bike'),
    ''
),
(
    (select id from equipment_types where name = 'Carrera Vengeance E Mens Electric Mountain Bike'),
    'Slighly marked frame'
);

insert into products (name, description, price, stock)
values (
    'Lazer CityZen KinetiCore Helmet',
    '',
    5900,
    10
),
(
    'Lazer Jackal KinetiCore Helmet',
    '',
    15900,
    5
)