INSERT INTO address (country, postal_code, city, street, number) VALUES
('Belgium', 1000, 'Bruxelles', 'par ici', '15'),
('Belgium', 2000, 'Anvers', 'par là', '123'),
('Belgium', 4000, 'Liège', 'par où', '10a');

INSERT INTO client (name, firstname, birthdate, email, password, registration_date, sexe, height, weight, gsm, role, address) VALUES
('AdminName', 'AdminFirstname', TO_DATE('17/12/1992', 'DD/MM/YYYY'), 'administrator@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 'H', 178, 80.0, '+32475254163', 'ADMINISTRATOR', 1),
('ModoName', 'ModoFirstname', TO_DATE('01/01/1985', 'DD/MM/YYYY'), 'moderator@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 'H', 195, 110.5, '+32479456525', 'MODERATOR', 2),
('ClientName', 'ClientFirstname', TO_DATE('10/09/1995', 'DD/MM/YYYY'), 'client@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('04/10/2020', 'DD/MM/YYYY'), 'H', 162, 59.9, '+32475136479', 'CLIENT', 3);
--password

INSERT INTO drink (label, prc_alcohol, quantity, nb_reports, created_by) VALUES
('Jupiler', 5.2, 0.33, 0, 1),
('Jack Daniel''s', 40, 0.70, 0, 2),
('Kriek Bellevue', 5.2, 0.33, 0, 3);

INSERT INTO drink (label, prc_alcohol, quantity, nb_reports) VALUES
('Eau', 0, 0.25, 0);

--INSERT INTO band (label, creation_date) VALUES
--('Les buveurs fous', TO_DATE('18/07/2020', 'DD/MM/YYYY')),
--('Les buveurs calmes', TO_DATE('24/05/2020', 'DD/MM/YYYY'));
--
--INSERT INTO band_client (client_id, band_id, creation_date, status, role, invited_by) VALUES
--(3, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), null, 'ADMINISTRATOR', null),
--(2, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), null, 'ADMINISTRATOR', null),
--(2, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 3),
--(1, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'A', 'ADMINISTRATOR', 2),
--(1, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 3),
--(3, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'R', 'CLIENT', 1);

--INSERT INTO band_client (client_id, band_id, creation_date, role) VALUES
--(2, 1, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'CLIENT');
--(3, 2, TO_DATE('17/11/2020', 'DD/MM/YYYY'), 'ADMINISTRATOR'
