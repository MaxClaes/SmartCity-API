INSERT INTO address (country, postal_code, city, street, number) VALUES
('belgique', 1000, 'bruxelles', 'par ici', '15'),
('belgique', 2000, 'anvers', 'par là', '123'),
('belgique', 4000, 'liège', 'par où', '10a');

INSERT INTO client (name, firstname, birthdate, email, password, registration_date, height, weight, gsm, access, address) VALUES
('adminName', 'adminFirstname', TO_DATE('17/12/1992', 'DD/MM/YYYY'), 'admin@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 178, 80.0, '+32475254163', 'ADMINISTRATOR', 1),
('modoName', 'modoFirstname', TO_DATE('01/01/1985', 'DD/MM/YYYY'), 'modo@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 195, 110.5, '+32479456525', 'MODERATOR', 2),
('clientName', 'clientFirstname', TO_DATE('10/09/1995', 'DD/MM/YYYY'), 'client@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 162, 59.9, '+32475136479', 'CLIENT', 3);
--password

INSERT INTO drink (label, prc_alcohol, quantity, nb_reports, created_by) VALUES
('Jupiler', 5.2, 0.33, 0, 1),
('Jack Daniel''s', 40, 0.70, 0, 2),
('Kriek Bellevue', 5.2, 0.33, 0, 3);

INSERT INTO drink (label, prc_alcohol, quantity, nb_reports) VALUES
('Eau', 0, 0.25, 0);

INSERT INTO band (creation_date, label) VALUES
(TO_DATE('18/07/2020', 'DD/MM/YYYY'), 'les buveurs fous'),
(TO_DATE('24/05/2020', 'DD/MM/YYYY'), 'les buveurs calmes');

INSERT INTO client_band (client_id, band_id, creation_date, join_date, access) VALUES
(1, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'ADMINISTRATOR'),
(3, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'ADMINISTRATOR'),
(1, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), TO_DATE('18/11/2020', 'DD/MM/YYYY'), 'CLIENT');

INSERT INTO client_band (client_id, band_id, creation_date, access) VALUES
(2, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'CLIENT');
