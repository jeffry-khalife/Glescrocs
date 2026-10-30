-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 29 oct. 2026 à 08:00
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `cantine`;
USE `cantine`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cantine`
--

-- --------------------------------------------------------

--
-- Structure de la table `menus`
--

DROP TABLE IF EXISTS `menus`;
CREATE TABLE IF NOT EXISTS `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `menus`
--

INSERT INTO `menus` (`id`, `name`, `description`, `image`, `price`, `available`, `created_at`) VALUES
(1, 'Poulet', 'Curry', 'https://png.pngtree.com/png-vector/20230423/ourmid/pngtree-food-bake-chicken-png-image_6724814.png', 6.99, 1, '2026-02-18 17:29:49'),
(2, 'Pate ', '', 'https://png.pngtree.com/png-vector/20230418/ourmid/pngtree-pasta-food-noodles-transparent-png-image_6708841.png', 10.99, 1, '2026-02-21 09:41:47'),
(3, 'Tenders', '', 'https://png.pngtree.com/png-vector/20250415/ourmid/pngtree-crispy-fried-chicken-tenders-isolated-for-fast-food-and-meal-design-png-image_15984574.png', 6.50, 1, '2026-02-21 10:51:46');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` int DEFAULT NULL,
  `status` enum('pending','validated','ready') DEFAULT 'pending',
  `menu_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `status`, `menu_id`, `created_at`) VALUES
(2, 1, 'ready', 3, '2026-02-22 08:45:59'),
(3, 2, 'ready', 3, '2026-02-22 10:02:08'),
(4, 6, 'validated', 1, '2026-02-23 08:42:16'),
(5, 3, 'ready', 3, '2026-02-23 09:20:25'),
(6, 4, 'ready', 1, '2026-02-23 09:21:32'),
(7, NULL, 'pending', 1, '2026-02-23 09:21:54'),
(8, 5, 'ready', 2, '2026-02-23 09:22:03'),
(9, NULL, 'pending', 1, '2026-09-01 06:35:59');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','employee') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(2, 'admin', '$2b$10$N3DvKv3qNqoSCakP3b84Yet5Oo7CLyKtRs/n8lYSn9mMq2zn9jctu', 'admin', '2026-02-21 07:43:30'),
(4, 'Test', '$2b$10$VtUHCEaK/931b1M69NJd..T2APe39i874CMi1iyJP1TFsznVxInui', 'employee', '2026-02-22 10:02:47');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
