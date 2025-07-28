-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 28, 2025 at 02:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'AB Power Engineering', '2025-07-15 17:13:51', '2025-07-15 17:13:51'),
(2, 'Renewable Energy for AB Applications', '2025-07-15 17:30:22', '2025-07-15 17:30:22'),
(3, 'AB Machinery and Mechanization', '2025-07-15 17:36:25', '2025-07-15 17:36:25'),
(4, 'Machine Design for AB Production', '2025-07-15 17:36:35', '2025-07-15 17:36:40'),
(5, 'AB Structures and Environment Engineering', '2025-07-15 17:36:48', '2025-07-15 17:36:48'),
(6, 'Plant and Livestock Environmental Engineering', '2025-07-15 17:36:56', '2025-07-15 17:36:56'),
(7, 'AB Electrification and Control Systems', '2025-07-15 17:37:01', '2025-07-15 17:37:01'),
(8, 'AB Waste Engineering', '2025-07-15 17:37:15', '2025-07-15 17:37:15'),
(9, 'Hydrometeorology', '2025-07-15 17:37:20', '2025-07-15 17:37:20'),
(10, 'Irrigation and Drainage Engineering', '2025-07-15 17:37:25', '2025-07-15 17:37:25'),
(11, 'Land and Water Conservation Engineering', '2025-07-15 17:37:38', '2025-07-15 17:37:38'),
(12, 'Aquaculture Engineering', '2025-07-15 17:37:44', '2025-07-15 17:37:44'),
(13, 'Properties of AB Materials', '2025-07-15 17:37:46', '2025-07-15 17:37:55'),
(14, 'AB Products Processing and Storage', '2025-07-15 17:38:06', '2025-07-15 17:38:06'),
(15, 'Food Process Engineering', '2025-07-15 17:38:16', '2025-07-15 17:38:16'),
(16, 'Design and Management of AB Processing Systems', '2025-07-15 17:38:22', '2025-07-15 17:38:22'),
(17, 'Other Materials/ Equipments Available in DABE', '2025-07-15 17:38:25', '2025-07-15 17:38:25');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `office_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `name`, `office_id`, `email`, `phone`, `created_at`, `updated_at`) VALUES
(1, 'Others', 1, NULL, NULL, '2025-07-15 17:14:30', '2025-07-15 17:14:30'),
(2, 'Aljon E. Bocobo', 2, 'create@carsu.edu.ph', NULL, '2025-07-20 17:06:08', '2025-07-20 21:01:24'),
(3, 'Neil Caesar M. Tado', 4, NULL, NULL, '2025-07-20 21:01:15', '2025-07-20 21:01:15'),
(4, 'May Rose B. Osoteo', 4, NULL, NULL, '2025-07-20 21:02:17', '2025-07-20 21:02:17'),
(5, 'Joan J. Sanchez', 4, NULL, NULL, '2025-07-20 21:03:26', '2025-07-20 21:03:26'),
(6, 'Cindy May Belivestre', 4, NULL, NULL, '2025-07-20 21:03:58', '2025-07-20 21:03:58'),
(7, 'Arnold D. Gemida Apdohan', 4, NULL, NULL, '2025-07-20 21:04:34', '2025-07-20 21:04:34'),
(8, 'Ana Marie Pondog Sajonia', 4, NULL, NULL, '2025-07-20 21:05:20', '2025-07-20 21:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `date_acquired` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `remarks` varchar(255) DEFAULT 'Functional',
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `office_id` bigint(20) UNSIGNED DEFAULT NULL,
  `faculty_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `equipment_name`, `serial_number`, `date_acquired`, `notes`, `remarks`, `category_id`, `office_id`, `faculty_id`, `created_at`, `updated_at`) VALUES
(1, 'Single Cylinder Diesel Engine', 'Yanmar: 572436', NULL, NULL, 'Functional', 1, 1, 1, NULL, '2025-07-27 16:47:29'),
(2, 'Single Cylinder Diesel Engine', 'Swan: 4/99', NULL, NULL, 'Functional', 1, 1, 1, NULL, '2025-07-27 16:47:33'),
(3, 'Single Cylinder Diesel Engine', 'Hakata: N/A', NULL, NULL, 'Functional', 1, 1, 1, NULL, '2025-07-22 00:22:17'),
(4, 'Single Cylinder Diesel Engine', 'KUWCO.N/A', NULL, NULL, 'Functional', 1, 1, 1, NULL, NULL),
(5, 'Single Cylinder Gasoline Engine', 'HM22023526', NULL, NULL, 'Functional', 1, 1, 1, NULL, NULL),
(6, 'Mechanic Tools', NULL, NULL, NULL, 'Non-Functional', 1, 1, 1, NULL, '2025-07-15 18:44:21'),
(7, 'Tachometer', 'N1036611-2', NULL, NULL, 'Non-Functional', 1, 2, 2, NULL, '2025-07-20 17:06:28'),
(8, 'Single Cylinder Gasoline Engine', NULL, NULL, NULL, 'Functional', 1, 1, 1, NULL, '2025-07-20 19:17:56'),
(9, 'Single Cylinder Diesel Engine', NULL, NULL, NULL, 'Functional', 1, 1, 1, NULL, '2025-07-20 19:18:16'),
(10, 'Two-wheel tractor', NULL, NULL, NULL, 'Functional', 1, 5, 1, NULL, '2025-07-20 19:18:21'),
(11, 'Four-wheel tractor', NULL, NULL, NULL, 'Functional', 1, 3, 1, NULL, '2025-07-20 19:18:45'),
(12, 'Electric motors', NULL, NULL, NULL, 'Functional', 1, 3, 1, NULL, NULL),
(13, 'Solar Meter', 'CEGS-22-76', NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(14, 'Digital anemometer', '028766', NULL, NULL, 'Functional', 2, 2, 1, NULL, '2025-07-20 21:14:17'),
(15, 'e Anemometer and Differential M4', '28766', NULL, NULL, 'Functional', 2, 10, 1, NULL, NULL),
(16, 'Digital Hot Wire Anemometer Kit', 'A.058332', '06/25/23', NULL, 'Functional', 2, 4, 3, NULL, '2025-07-21 22:09:52'),
(17, 'Desktop Computers', NULL, NULL, NULL, 'Functional', 2, 10, 1, NULL, NULL),
(18, 'Bomb Calorimeter', NULL, NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(19, 'Plastic Container 201', NULL, NULL, NULL, 'Functional', 2, 1, 1, NULL, NULL),
(20, 'Graduated Cylinder 500 ml', NULL, NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(21, 'Graduated Cylinder 250ml', NULL, NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(22, '2 Digital Balance', 'JN20220630001', NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(23, 'Analytical Balance', '220704075', NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(24, 'Top Loading Balance', 'CEIT-18-973', NULL, NULL, 'Functional', 2, 2, 1, NULL, NULL),
(25, 'Mechanic Tools', NULL, NULL, NULL, 'Functional', NULL, 1, 1, '2025-07-15 18:08:15', '2025-07-15 18:08:15'),
(26, 'Photo Digital Tachometer', '187501', NULL, NULL, 'Functional', NULL, 2, 1, '2025-07-15 18:10:04', '2025-07-15 18:10:04'),
(28, 'Top Loading Balance', 'D465531824', '6/26/2002', '09/10/2024 - Found at CREATE', 'Functional', NULL, 4, 3, '2025-07-20 21:18:10', '2025-07-21 17:54:24'),
(29, 'Laboratory Oven', NULL, '01/14/2021', NULL, 'Functional', NULL, 7, 3, '2025-07-20 21:23:34', '2025-07-20 21:23:34'),
(30, 'Thermocouple Extension Wire', 'CREATE-0032', '06/26/20', NULL, 'Functional', NULL, 2, 3, '2025-07-20 21:28:10', '2025-07-20 21:28:10'),
(31, 'Water Quality Testing Kit Biobase Model', '22A 106489', NULL, NULL, 'Functional', NULL, 2, 3, '2025-07-20 21:36:23', '2025-07-20 21:36:23');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_category`
--

CREATE TABLE `inventory_category` (
  `inventory_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_category`
--

INSERT INTO `inventory_category` (`inventory_id`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, NULL),
(1, 3, NULL, NULL),
(2, 1, NULL, NULL),
(2, 3, NULL, NULL),
(3, 1, NULL, NULL),
(3, 3, NULL, NULL),
(4, 1, NULL, NULL),
(4, 3, NULL, NULL),
(5, 1, NULL, NULL),
(5, 3, NULL, NULL),
(6, 1, NULL, NULL),
(7, 1, NULL, NULL),
(8, 1, NULL, NULL),
(9, 1, NULL, NULL),
(10, 1, NULL, NULL),
(11, 1, NULL, NULL),
(12, 1, NULL, NULL),
(13, 2, NULL, NULL),
(14, 2, NULL, NULL),
(15, 2, NULL, NULL),
(16, 2, NULL, NULL),
(17, 2, NULL, NULL),
(18, 2, NULL, NULL),
(19, 2, NULL, NULL),
(20, 2, NULL, NULL),
(20, 3, NULL, NULL),
(21, 2, NULL, NULL),
(22, 2, NULL, NULL),
(23, 2, NULL, NULL),
(24, 2, NULL, NULL),
(25, 3, NULL, NULL),
(26, 3, NULL, NULL),
(28, 2, NULL, NULL),
(29, 10, NULL, NULL),
(30, 15, NULL, NULL),
(31, 17, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_03_032312_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `offices`
--

CREATE TABLE `offices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `office_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offices`
--

INSERT INTO `offices` (`id`, `office_name`, `created_at`, `updated_at`) VALUES
(1, 'Old Farm Mech Laboratory', '2025-07-15 17:13:59', '2025-07-15 17:13:59'),
(2, 'Create', '2025-07-15 17:23:38', '2025-07-15 17:23:38'),
(3, 'New Farm Mech Building', '2025-07-15 17:23:46', '2025-07-15 17:23:46'),
(4, 'DABE', '2025-07-15 17:23:55', '2025-07-15 17:23:55'),
(5, 'CSU-ORGMS Production Area', '2025-07-15 17:24:16', '2025-07-15 17:24:16'),
(6, 'Hinang 101/Geomatics Lab/CREATE Center', '2025-07-15 17:34:42', '2025-07-15 17:34:42'),
(7, 'Hinang 109(Bioprocessing Lab)', '2025-07-15 17:34:49', '2025-07-15 17:34:49'),
(8, 'Hinang 307/ Drawing Room', '2025-07-15 17:34:56', '2025-07-15 17:34:56'),
(9, 'Hinang 301', '2025-07-15 17:35:00', '2025-07-15 17:35:00'),
(10, 'Hinang 101', '2025-07-15 17:35:18', '2025-07-15 17:35:18'),
(11, 'Geomatics Lab', '2025-07-15 17:35:41', '2025-07-15 17:35:41'),
(12, 'GE Dept.', '2025-07-15 17:35:50', '2025-07-15 17:35:50');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `inventory_id` bigint(20) UNSIGNED NOT NULL,
  `schedule_date` date NOT NULL,
  `status` enum('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `name`, `inventory_id`, `schedule_date`, `status`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Loyd N. Tagaro', 1, '2025-07-21', 'Completed', 'For Killing frog', '2025-07-21 19:10:17', '2025-07-27 16:35:25'),
(3, 'Jose Marie Chan', 23, '2025-07-21', 'Cancelled', 'For Christmas Party', '2025-07-21 19:12:54', '2025-07-22 22:11:30'),
(5, 'Loyd N. Tagaro', 29, '2025-07-23', 'Completed', 'For Lab', '2025-07-22 17:27:50', '2025-07-27 16:35:16'),
(7, 'Engr. Aljon E. Bocobo', 17, '2025-06-30', 'Scheduled', NULL, '2025-07-22 22:12:59', '2025-07-22 22:12:59');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('v1ScKh5RZlVqIUGDMaFIgTpZey77gKSHXug7JjQa', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWmJVODczWDF6RHNReDRKMTVtUVJaTFFaOU5OTGlGNGJVbm1WSVB2TSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9pbnZlbnRvcnkiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1753663578);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Create', 'create@carsu.edu.ph', NULL, '$2y$12$bwGWbfzJjQ7fqmoUMQmYI.4tAcqy7UjV.9YA.C492/vB6SGXYPF8q', NULL, '2025-07-15 17:04:58', '2025-07-15 17:04:58'),
(3, 'Admin', 'admin@carsu.edu.ph', '2025-07-21 17:27:37', '$2y$12$EIFYugj5o1GtWNzOm5T/eejfGqOSR6BzRBrNUnRaQzcm.Wf3xDcUS', 'J1owakIvrbUHswWeZFRLW3jrWCIsjK8oXefKtkHyPflk8pFMjVuw6i4bXTFE', '2025-07-21 17:27:37', '2025-07-22 18:10:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `office_id` (`office_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_inventory_office` (`office_id`),
  ADD KEY `fk_inventory_faculty` (`faculty_id`),
  ADD KEY `fk_inventory_categories` (`category_id`);

--
-- Indexes for table `inventory_category`
--
ALTER TABLE `inventory_category`
  ADD PRIMARY KEY (`inventory_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `office_name` (`office_name`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_inventory` (`inventory_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `offices`
--
ALTER TABLE `offices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `faculty`
--
ALTER TABLE `faculty`
  ADD CONSTRAINT `faculty_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inventory_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_inventory_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_inventory_office` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inventory_category`
--
ALTER TABLE `inventory_category`
  ADD CONSTRAINT `inventory_category_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventory_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `fk_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
