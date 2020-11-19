INSERT INTO address (country, postal_code, city, street, number) VALUES
('Belgique', 1000, 'Bruxelles', 'Par ici', '15'),
('Belgique', 2000, 'Anvers', 'Par là', '123'),
('Belgique', 4000, 'Liège', 'Par où', '10a');

INSERT INTO client (nom, prenom, date_naissance, email, password, date_inscription, taille, poids, gsm, permission, address) VALUES
('Admin', 'Admin', TO_DATE('17/12/1992', 'DD/MM/YYYY'), 'admin@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 178, 80.0, 0475254163, 'ADMINISTRATOR', 1),
('Modo', 'Modo', TO_DATE('01/01/1985', 'DD/MM/YYYY'), 'modo@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 195, 110.5, 0479456525, 'MODERATOR', 2),
('Client', 'Client', TO_DATE('10/09/1995', 'DD/MM/YYYY'), 'client@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 162, 59.9, 0475136479, 'CLIENT', 3);

INSERT INTO drink (label, prc_alcool, quantite, nb_reports, created_by) VALUES
('Jupiler', 5.2, 0.33, 0, 1),
('Jack Daniels', 40, 0.70, 0, 2);

INSERT INTO drink (label, prc_alcool, quantite, nb_reports) VALUES
('Eau', 0, 0.25, 0);

INSERT INTO band (creation_date, label) VALUES
(TO_DATE('18/07/2020', 'DD/MM/YYYY'), 'Les buveurs fous'),
(TO_DATE('24/05/2020', 'DD/MM/YYYY'), 'Les buveurs calmes');

INSERT INTO client_band (client_id, band_id, date_of_demand, join_date, permission) VALUES
(1, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'ADMINISTRATOR'),
(3, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'ADMINISTRATOR'),
(1, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), TO_DATE('18/11/2020', 'DD/MM/YYYY'), 'CLIENT');

INSERT INTO client_band (client_id, band_id, date_of_demand, permission) VALUES
(2, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'CLIENT');
