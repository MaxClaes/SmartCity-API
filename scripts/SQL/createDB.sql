DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    country varchar(255) NOT NULL,
    postal_code integer NOT NULL,
    city varchar(255) NOT NULL,
    street varchar(255) NOT NULL,
    number varchar NOT NULL
);


DROP TABLE IF EXISTS client CASCADE;
CREATE TABLE client (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(255) NOT NULL,
    firstname varchar(255) NOT NULL,
    birthdate timestamp NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    registration_date timestamp NOT NULL,
    height integer NOT NULL,
    weight float NOT NULL,
    gsm varchar(255),
    role varchar(255) NOT NULL,
    address integer NOT NULL REFERENCES address(id) DEFERRABLE INITIALLY IMMEDIATE
);

DROP TABLE IF EXISTS drink CASCADE;
CREATE TABLE drink (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label varchar(255) NOT NULL,
    prc_alcohol float NOT NULL,
    quantity float NOT NULL,
    nb_reports integer default 0,
    popularity integer default 0,
    created_by integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE
);

DROP TABLE IF EXISTS band CASCADE;
CREATE TABLE band (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label varchar(255) NOT NULL,
    creation_date timestamp NOT NULL
);

DROP TABLE IF EXISTS band_client CASCADE;
CREATE TABLE band_client (
    client_id integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
    band_id integer REFERENCES band(id) DEFERRABLE INITIALLY IMMEDIATE,
    creation_date timestamp,
    status char(1) NOT NULL,
    role varchar(255) NOT NULL,
    invited_by integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
    PRIMARY KEY(client_id, band_id)
);

DROP TABLE IF EXISTS drink_consumed CASCADE;
CREATE TABLE drink_consumed (
    client_id integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
    drink_id integer REFERENCES drink(id) DEFERRABLE INITIALLY IMMEDIATE,
    "date" timestamp NOT NULL,
    PRIMARY KEY(client_id, drink_id)
);
