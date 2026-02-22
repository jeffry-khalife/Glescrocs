CREATE DATABASE cantine;
USE cantine;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  role ENUM('admin','employee'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  image VARCHAR(255),
  price DECIMAL(10,2),
  available BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number INT,
  status ENUM('pending','validated','ready') DEFAULT 'pending',
  menu_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);