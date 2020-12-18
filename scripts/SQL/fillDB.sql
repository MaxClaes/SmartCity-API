INSERT INTO address (country, postal_code, city, street, number) VALUES
('Belgium', 1000, 'Bruxelles', 'par ici', '15'),
('Belgium', 2000, 'Anvers', 'par là', '123'),
('Belgium', 4000, 'Liège', 'par où', '10a'),
('Belgium', 4000, 'Liège', 'par où', '10a'),
('Belgium', 2250, 'Charleroi', 'quelque part', '119'),
('Belgium', 5340, 'Andenne', 'Lombaire', '1a'),
('Belgium', 3600, 'Ohey', 'Dorsal', '25b');

INSERT INTO client (name, firstname, birthdate, email, password, registration_date, gender, height, weight, gsm, role, address) VALUES
('Marshal', 'Admin', TO_DATE('17/12/1992', 'DD/MM/YYYY'), 'administrator@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'M', 170, 80.0, '+32475254163', 'ADMINISTRATOR', 1),
('Michelle', 'Modo', TO_DATE('01/01/1985', 'DD/MM/YYYY'), 'moderator@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'F', 159, 54.5, '+32479456525', 'MODERATOR', 2),
('Louise', 'Ranson', TO_DATE('23/10/1995', 'DD/MM/YYYY'), 'client@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'F', 162, 59.9, '+32475136479', 'CLIENT', 3),
('Thomas', 'Ranson', TO_DATE('14/06/1975', 'DD/MM/YYYY'), 'thomas.ranson@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'M', 168, 72, '+32476857463', 'CLIENT', 4),
('Roméo', 'Tubiz', TO_DATE('17/04/1991', 'DD/MM/YYYY'), 'romeo.tubiz@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'M', 192, 110.8, '+32472657832', 'CLIENT', 5),
('Issi', 'Féfroid', TO_DATE('18/06/1949', 'DD/MM/YYYY'), 'issi.fefroid@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'F', 185, 82.3, '+32476491737', 'CLIENT', 6),
('Marcus', 'Toussaint', TO_DATE('09/07/1998', 'DD/MM/YYYY'), 'marcus.toussaint@gmail.com', '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TO_DATE('01/10/2020', 'DD/MM/YYYY'), 'M', 173, 74.2, '+32475842612', 'CLIENT', 7);
--password

INSERT INTO drink (label, prc_alcohol, quantity, nb_reports, popularity, created_by) VALUES
('Jupiler', 5.2, 0.33, 0, 5, 1),
('Jack Daniel''s', 40, 0.025, 0, 2, 2),
('Kriek Bellevue', 5.2, 0.33, 0, 1, 3),
('Maes', 5, 0.33, 0, 2, 1),
('Absinthe', 60, 0.025, 0, 2, 7),
('Grand Marnier', 60, 0.025, 0, 3, 5),
('Chimay Bleue', 9, 0.33, 0, 2, 1),
('Chimay Triple', 8, 0.33, 0, 2, 5),
('Orval', 6.2, 0.33, 0, 3, 2),
('Triple Westmalle', 9.5, 0.025, 0, 1, 2),
('Abbaye de Villers V', 5, 0.33, 0, 2, 7),
('Barbare', 8, 0.33, 0, 2, 1);

INSERT INTO drink (label, prc_alcohol, quantity, nb_reports) VALUES
('Eau', 0, 0.25, 0);

INSERT INTO consumption("date", client_id, drink_id) VALUES
(TO_DATE('02/11/2020', 'DD/MM/YYYY'), 1, 10),
(TO_DATE('03/11/2020', 'DD/MM/YYYY'), 1, 1),
(TO_DATE('15/11/2020', 'DD/MM/YYYY'), 1, 1),
(TO_DATE('11/11/2020', 'DD/MM/YYYY'), 1, 1),
(TO_DATE('13/11/2020', 'DD/MM/YYYY'), 1, 5),
(TO_DATE('02/11/2020', 'DD/MM/YYYY'), 2, 4),
(TO_DATE('30/11/2020', 'DD/MM/YYYY'), 2, 7),
(TO_DATE('28/11/2020', 'DD/MM/YYYY'), 2, 8),
(TO_DATE('29/11/2020', 'DD/MM/YYYY'), 3, 4),
(TO_DATE('15/11/2020', 'DD/MM/YYYY'), 3, 2),
(TO_DATE('16/11/2020', 'DD/MM/YYYY'), 4, 6),
(TO_DATE('12/11/2020', 'DD/MM/YYYY'), 4, 12),
(TO_DATE('13/11/2020', 'DD/MM/YYYY'), 5, 11),
(TO_DATE('08/11/2020', 'DD/MM/YYYY'), 5, 9),
(TO_DATE('05/11/2020', 'DD/MM/YYYY'), 5, 8),
(TO_DATE('04/11/2020', 'DD/MM/YYYY'), 6, 7),
(TO_DATE('01/11/2020', 'DD/MM/YYYY'), 6, 6),
(TO_DATE('25/11/2020', 'DD/MM/YYYY'), 6, 3),
(TO_DATE('25/11/2020', 'DD/MM/YYYY'), 6, 1),
(TO_DATE('25/11/2020', 'DD/MM/YYYY'), 6, 9),
(TO_DATE('26/11/2020', 'DD/MM/YYYY'), 7, 12),
(TO_DATE('26/11/2020', 'DD/MM/YYYY'), 7, 2),
(TO_DATE('14/11/2020', 'DD/MM/YYYY'), 7, 1),
(TO_DATE('13/11/2020', 'DD/MM/YYYY'), 7, 6),
(TO_DATE('06/11/2020', 'DD/MM/YYYY'), 7, 9),
(TO_DATE('07/11/2020', 'DD/MM/YYYY'), 7, 11),
(TO_DATE('07/11/2020', 'DD/MM/YYYY'), 7, 5);

INSERT INTO band (label, creation_date) VALUES
('Les buveurs fous', TO_DATE('18/11/2020', 'DD/MM/YYYY')),
('Les buveurs calmes', TO_DATE('24/11/2020', 'DD/MM/YYYY')),
('Les jeunes alcooliques', TO_DATE('22/11/2020', 'DD/MM/YYYY')),
('Ce soir on se met une mine', TO_DATE('01/12/2020', 'DD/MM/YYYY')),
('Le premier qui boit paye la tournée', TO_DATE('19/11/2020', 'DD/MM/YYYY')),
('Gryffondor', TO_DATE('10/12/2020', 'DD/MM/YYYY')),
('Serpentard', TO_DATE('05/12/2020', 'DD/MM/YYYY'));

INSERT INTO band_client (client_id, band_id, invitation_date, status, role, invited_by) VALUES
(1, 1, null, 'A', 'ADMINISTRATOR', null),
(2, 2, null, 'A', 'ADMINISTRATOR', null),
(3, 3, null, 'A', 'ADMINISTRATOR', null),
(4, 4, null, 'A', 'ADMINISTRATOR', null),
(5, 5, null, 'A', 'ADMINISTRATOR', null),
(4, 6, null, 'A', 'ADMINISTRATOR', null),
(2, 7, null, 'A', 'ADMINISTRATOR', null),
(3, 2, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'ADMINISTRATOR', 2),
(4, 2, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 3),
(7, 7, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 2),
(5, 1, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'A', 'CLIENT', 1),
(7, 6, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'A', 'CLIENT', 4),
(2, 5, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'A', 'ADMINISTRATOR', 5),
(3, 6, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 7),
(5, 4, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 4),
(6, 1, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'A', 'CLIENT', 5),
(7, 3, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'A', 'CLIENT', 3),
(1, 7, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 2),
(1, 4, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'W', 'CLIENT', 4),
(1, 5, TO_DATE('01/12/2020', 'DD/MM/YYYY'), 'A', 'ADMINISTRATOR', 2);