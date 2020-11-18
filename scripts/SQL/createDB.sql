DROP TABLE IF EXISTS produit CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TABLE IF EXISTS achat CASCADE;

CREATE TABLE produit (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom varchar,
    prix float
);

CREATE TABLE client(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom varchar,
    prenom varchar,
    adresse varchar
);

CREATE TABLE achat (
   id_produit integer REFERENCES produit(id) DEFERRABLE INITIALLY IMMEDIATE,
   id_client integer REFERENCES client(id) DEFERRABLE INITIALLY IMMEDIATE,
   quantite integer,
   "date" date,
   PRIMARY KEY(id_client, id_produit, "date")
);

INSERT INTO produit (nom, prix) VALUES
('Playstation 4', 400),
('Xbox One', 399.99),
('Nintendo Switch', 349.99);

INSERT INTO client (nom, prenom, adresse) VALUES 
('Poirier', 'Tevin', '11, rue du Faubourg National 95150 TAVERNY');
