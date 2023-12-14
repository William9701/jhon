-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS connect_dev_db;
CREATE USER IF NOT EXISTS 'connect_dev'@'localhost' IDENTIFIED BY 'connect_dev_pwd';
GRANT ALL PRIVILEGES ON `connect_dev_db`.* TO 'connect_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'connect_dev'@'localhost';
FLUSH PRIVILEGES;
