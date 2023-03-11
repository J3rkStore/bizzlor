INSERT INTO departments (dept_name)
VALUES ('Developers'),
('Janitorial'),
('Magic'),
('Accounting');

INSERT INTO roles (department_id, title, salary)
VALUES (1, 'nerd', 70000),
(2, 'CEO', 100000),
(3, 'magician', 666000),
(3, 'warlock', 777000),
(3, 'space wizard', 888000),
(4, 'mega nerd', 60000);

INSERT INTO employees (role_id, first_name, last_name, manager_id)
VALUES (1, 'Dave', 'A', NULL),
(4, 'Dave', 'B', NULL),
(6, 'Dave', 'C', NULL),
(5, 'H. Lorenzo', 'St. Magnifico', NULL),
(3, 'Dave', 'D', NULL),
(2, 'Dave', 'Just Dave', 4);

