DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    country varchar,
    postal_code integer,
    city varchar,
    street varchar,
    number varchar
);


DROP TABLE IF EXISTS client CASCADE;
CREATE TABLE client (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom varchar,
    prenom varchar,
    date_naissance date,
    email varchar UNIQUE,
    password varchar,
    date_inscription date,
    taille integer,
    poids float,
    gsm integer,
    role varchar,
    address integer REFERENCES address(id) DEFERRABLE INITIALLY IMMEDIATE
);

DROP TABLE IF EXISTS drink CASCADE;
CREATE TABLE drink (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label varchar,
    prc_alcool float,
    quantite float,
    nb_reports integer default 0,
    created_by integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE
);

DROP TABLE IF EXISTS band CASCADE;
CREATE TABLE band (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    creation_date date,
    label varchar
);

DROP TABLE IF EXISTS client_band CASCADE;
CREATE TABLE client_band (
    client_id integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
    band_id integer REFERENCES band(id) DEFERRABLE INITIALLY IMMEDIATE,
    date_of_demand date,
    join_date date,
    role varchar,
    PRIMARY KEY(client_id, band_id)
);

DROP TABLE IF EXISTS drink_consumed CASCADE;
CREATE TABLE drink_consumed (
    client_id integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
    drink_id integer REFERENCES drink(id) DEFERRABLE INITIALLY IMMEDIATE,
    "date" date,
    PRIMARY KEY(client_id, drink_id)
);




--DROP TABLE IF EXISTS produit CASCADE;
--CREATE TABLE produit (
--    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--    nom varchar,
--    prix float
--);
--
--INSERT INTO produit (nom, prix) VALUES
--('Playstation 4', 400),
--('Xbox One', 399.99),
--('Nintendo Switch', 349.99);
--
--DROP TABLE IF EXISTS client CASCADE;
--
--CREATE TABLE client(
--    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--    nom varchar,
--    prenom varchar,
--    address varchar,
--    email varchar UNIQUE,
--    password varchar
--);
--
--INSERT INTO client (nom, prenom, address, email, password) VALUES ('Poirier', 'Tevin', '11, rue du Faubourg National 95150 TAVERNY', 'poirier@mail.com', '$2a$10$vQ1rrXjoPNYhualYPfWlFec41p3JpSQH33B4VwXEyeaUTKmoF4VSy');
----motdepasse
--
--DROP TABLE IF EXISTS manager CASCADE;
--
--CREATE TABLE manager(
--    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--    nom varchar,
--    email varchar UNIQUE,
--    password varchar
--);
--
--INSERT INTO manager (nom, email, password) VALUES ('John', 'john@mail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG');
----password
--
--DROP TABLE IF EXISTS achat CASCADE;
--
--CREATE TABLE achat (
--   id_produit integer REFERENCES produit(id) DEFERRABLE INITIALLY IMMEDIATE,
--   id_client integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
--   quantite integer,
--   "date" date,
--   PRIMARY KEY(id_client, id_produit, "date")
--);