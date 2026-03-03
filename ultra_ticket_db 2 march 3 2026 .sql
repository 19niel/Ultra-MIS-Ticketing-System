-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2026 at 04:29 AM
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
-- Database: `ultra_ticket_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `position` varchar(150) NOT NULL,
  `department_id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `employee_id`, `first_name`, `last_name`, `position`, `department_id`, `branch_id`, `role_id`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '02223325', 'Nathaniel', 'Talag', 'Programmer', 1, 1, 1, 'admin@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-02-24 09:28:18'),
(2, '00000001', 'Tech', 'Support', 'IT Support', 1, 1, 2, 'techsupport@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-02-10 09:01:35'),
(4, '00000003', 'Etch', 'Arr', 'Payroll', 2, 1, 3, 'hr@ubix.com.ph', '1234', NULL, '2026-01-09 05:58:36', '2026-02-24 09:22:26'),
(5, '00000004', 'Sey', 'Heyls', 'Head of Sales', 3, 1, 3, 'sales@ubix.com.ph', '1234', 1, '2026-01-12 07:13:44', '2026-02-10 09:01:35'),
(15, '012023326', 'Nathaniel', 'Talag', 'programmer', 1, 1, 3, 'nathanieltalag@gmail.com', '1234', 1, '2026-02-27 09:16:43', '2026-02-27 09:16:43'),
(16, '013045924', 'Bon', 'Bidan', 'IT MANAGER', 1, 1, 3, 'demetrio.bidan@ubix.com.ph', 'M1s@dm1n', 1, '2026-02-27 09:19:55', '2026-02-27 09:19:55'),
(29, '02223326', 'Test', 'Boom', 'asdfsdgnfb', 2, 1, 2, 'test@gmail.com', '1234', 1, '2026-03-02 08:47:49', '2026-03-02 08:47:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `users_ibfk_3` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
