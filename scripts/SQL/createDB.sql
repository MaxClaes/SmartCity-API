DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
    address_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    country VARCHAR(255) NOT NULL,
    postal_code INTEGER NOT NULL check (postal_code >= 0),
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR NOT NULL
);


DROP TABLE IF EXISTS client CASCADE;
CREATE TABLE client (
    client_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    birthdate TIMESTAMP NOT NULL check (birthdate <= now()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP NOT NULL,
    gender CHAR(1) NOT NULL,
    height INTEGER NOT NULL check (height >= 0),
    weight FLOAT NOT NULL check (height >= 0),
    gsm VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    address INTEGER REFERENCES address(address_id) DEFERRABLE INITIALLY IMMEDIATE
);

DROP TABLE IF EXISTS drink CASCADE;
CREATE TABLE drink (
    drink_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label VARCHAR(255) NOT NULL,
    prc_alcohol FLOAT NOT NULL,
    quantity FLOAT NOT NULL,
    nb_reports INTEGER default 0,
    popularity INTEGER default 0,
    disabled BOOLEAN default FALSE,
    created_by INTEGER REFERENCES client(client_id) DEFERRABLE INITIALLY IMMEDIATE
);

DROP TABLE IF EXISTS band CASCADE;
CREATE TABLE band (
    band_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS band_client CASCADE;
CREATE TABLE band_client (
    client_id INTEGER REFERENCES client(client_id) DEFERRABLE INITIALLY IMMEDIATE,
    band_id INTEGER REFERENCES band(band_id) DEFERRABLE INITIALLY IMMEDIATE,
    invitation_date TIMESTAMP,
    status CHAR(1) NOT NULL,
    role VARCHAR(255) NOT NULL,
    invited_by INTEGER REFERENCES client(client_id) DEFERRABLE INITIALLY IMMEDIATE,
    PRIMARY KEY(client_id, band_id)
);

DROP TABLE IF EXISTS consumption CASCADE;
CREATE TABLE consumption (
    consumption_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "date" TIMESTAMP NOT NULL,
    client_id INTEGER NOT NULL REFERENCES client(client_id) DEFERRABLE INITIALLY IMMEDIATE,
    drink_id INTEGER NOT NULL REFERENCES drink(drink_id) DEFERRABLE INITIALLY IMMEDIATE
);
