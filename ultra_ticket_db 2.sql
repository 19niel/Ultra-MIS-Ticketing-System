-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2026 at 09:23 AM
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
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `attachment_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `message_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `created_at`, `updated_at`) VALUES
(1, 'Hardware', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(2, 'Software', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(3, 'Network', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(4, 'Account Access', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(5, 'Other', '2026-01-09 03:58:31', '2026-01-09 03:58:31');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `created_at`, `updated_at`) VALUES
(1, 'MIS', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(2, 'HR', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(3, 'Sales', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(4, 'Finance', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(5, 'Manager', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(6, 'FSD', '2026-01-09 03:58:31', '2026-01-09 03:58:31');

-- --------------------------------------------------------

--
-- Table structure for table `priorities`
--

CREATE TABLE `priorities` (
  `priority_id` int(11) NOT NULL,
  `priority_name` varchar(50) NOT NULL,
  `sla_hours` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `priorities`
--

INSERT INTO `priorities` (`priority_id`, `priority_name`, `sla_hours`, `created_at`, `updated_at`) VALUES
(1, 'Low', 72, '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(2, 'Medium', 48, '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(3, 'High', 24, '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(4, 'Critical', 4, '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(5, 'Emergency', 1, '2026-01-09 03:58:31', '2026-01-09 03:58:31');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(2, 'tech_support', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(3, 'employee', '2026-01-09 03:58:31', '2026-01-09 03:58:31');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL,
  `ticket_number` varchar(30) NOT NULL,
  `created_by` varchar(11) NOT NULL,
  `assigned_to` varchar(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status_id` int(11) NOT NULL,
  `priority_id` int(11) NOT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `ticket_number`, `created_by`, `assigned_to`, `category_id`, `subject`, `description`, `status_id`, `priority_id`, `closed_at`, `created_at`, `updated_at`) VALUES
(11, 'TKT-0000001', '02223325', NULL, 1, 'Rice Cooker need power cable gutom na kami', 'need ng power cable padala dito', 1, 2, NULL, '2026-01-13 02:10:37', '2026-01-13 02:10:37'),
(12, 'TKT-0000002', '02223325', NULL, 1, 'Rice Cooker need power cable gutom na kami', 'erwty5', 1, 1, NULL, '2026-01-13 03:28:50', '2026-01-13 03:28:50'),
(13, 'TKT-0000003', '00000003', NULL, 3, 'xcvbn', 'dsfdgfnhjyrueyt', 1, 3, NULL, '2026-01-13 03:30:48', '2026-01-13 03:30:48'),
(15, 'TKT-0000005', '02223325', NULL, 1, 'Testing dapat meron na', 'need na namin ng type c lowbatt na phone ko', 1, 2, NULL, '2026-01-19 10:02:54', '2026-02-04 05:16:09'),
(16, 'TKT-0000006', '00000003', NULL, 2, 'gawa ng HR', 'DApat gawa ng HR to', 1, 1, NULL, '2026-01-30 08:57:31', '2026-02-04 05:16:16'),
(17, 'TKT-0000007', '02223325', NULL, 2, 'Testing dapat meron na', 'sadfdgfhkut7564834efd', 1, 2, NULL, '2026-02-04 01:20:42', '2026-02-04 01:20:42'),
(18, 'TKT-0000008', '02223325', '00000001', 1, 'pang 8 na ticket', '1234567890-1234567890-', 1, 1, NULL, '2026-02-04 01:21:05', '2026-02-04 08:17:19'),
(19, 'TKT-0000009', '02223325', '000000011', 1, 'Pang 9 na', 'sdfgrtrhyj', 2, 2, NULL, '2026-02-04 02:09:42', '2026-02-05 01:10:23'),
(20, 'TKT-0000010', '02223325', NULL, 2, '10', 'fdghjjkhgkfj', 1, 2, NULL, '2026-02-05 05:47:39', '2026-02-05 05:47:39'),
(21, 'TKT-0000011', '02223325', NULL, 2, '11', 'dgfhgj.jk/;o8o7r6e57ryf', 1, 2, NULL, '2026-02-05 05:47:45', '2026-02-05 05:47:45'),
(22, 'TKT-0000012', '02223325', '00000001', 2, 'q21212', 'gghj,./lpoup6e46w3wetsdxg', 5, 2, '2026-02-10 05:20:07', '2026-02-05 05:47:51', '2026-02-10 05:20:07'),
(23, 'TKT-0000013', '00000003', '000000011', 4, 'gawa ng HR Feb 5 2026', 'wag kang susuko\n', 2, 3, NULL, '2026-02-05 09:41:09', '2026-02-10 05:17:11'),
(24, 'TKT-0000014', '00000002', '000000011', 1, 'gawa ng Accounting ', 'sana gawa nga ng accounting to ', 1, 2, NULL, '2026-02-10 06:10:23', '2026-02-10 06:10:44'),
(25, 'TKT-0000015', '00000003', NULL, 2, 'need cable', 'dfghkgyfryvuhij34567890-', 3, 3, NULL, '2026-02-10 06:52:32', '2026-02-10 06:53:28'),
(26, 'TKT-0000016', '00000003', NULL, 4, 'Netsuite reset pass', 'pareset account ko', 1, 1, NULL, '2026-02-10 07:00:06', '2026-02-10 07:12:43');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_history`
--

CREATE TABLE `ticket_history` (
  `history_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `changed_by` int(11) NOT NULL,
  `old_status_id` int(11) NOT NULL,
  `new_status_id` int(11) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_messages`
--

CREATE TABLE `ticket_messages` (
  `message_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_message_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_messages`
--

INSERT INTO `ticket_messages` (`message_id`, `ticket_id`, `user_id`, `parent_message_id`, `message`, `created_at`) VALUES
(8, 19, 1, NULL, 'boom', '2026-02-04 03:39:45'),
(9, 19, 1, NULL, 'boom', '2026-02-04 03:39:48'),
(10, 19, 1, NULL, 'boom', '2026-02-04 03:39:51'),
(11, 18, 1, NULL, 'close na po', '2026-02-04 05:11:45'),
(12, 19, 1, NULL, 'test', '2026-02-04 06:54:40'),
(13, 19, 1, NULL, 'boom', '2026-02-04 09:16:40'),
(14, 19, 1, NULL, 'bago to', '2026-02-04 09:20:57'),
(15, 19, 4, NULL, 'hr dapat', '2026-02-04 09:28:39'),
(16, 19, 4, NULL, 'boom', '2026-02-04 09:28:46'),
(17, 19, 4, NULL, 'hi', '2026-02-04 09:38:11'),
(18, 19, 1, NULL, 'hi', '2026-02-04 09:38:16'),
(19, 19, 1, NULL, 'hu', '2026-02-04 09:38:19'),
(20, 19, 1, NULL, 'no', '2026-02-04 09:39:33'),
(21, 19, 4, NULL, 'wag', '2026-02-04 09:39:38'),
(22, 19, 1, NULL, 'hello', '2026-02-04 09:42:10'),
(23, 19, 4, NULL, 'hey', '2026-02-04 09:43:29'),
(24, 19, 1, NULL, 'hello test', '2026-02-04 09:43:37'),
(25, 19, 1, NULL, 'real', '2026-02-04 09:46:11'),
(26, 19, 4, NULL, 'hey', '2026-02-04 09:46:17'),
(27, 19, 4, NULL, 'hr', '2026-02-04 09:54:47'),
(28, 19, 1, NULL, 'admin', '2026-02-04 09:54:51'),
(29, 19, 4, NULL, 'nice', '2026-02-05 00:52:06'),
(30, 19, 4, NULL, 'boom', '2026-02-05 01:13:48'),
(31, 19, 4, NULL, 'hr again', '2026-02-05 01:14:05'),
(32, 19, 4, NULL, 'ako si nath', '2026-02-05 01:14:10'),
(33, 22, 1, NULL, 'hi', '2026-02-05 06:16:18'),
(34, 22, 4, NULL, 'hello', '2026-02-05 06:16:23'),
(35, 22, 4, NULL, 'hr to', '2026-02-05 06:27:08'),
(36, 22, 1, NULL, 'NT to', '2026-02-05 06:27:15'),
(37, 22, 4, NULL, 'asd', '2026-02-05 07:09:08'),
(38, 23, 1, NULL, 'gawa talaga ng hr to?', '2026-02-10 05:17:31'),
(39, 23, 4, NULL, 'oo yes', '2026-02-10 05:17:39'),
(40, 23, 1, NULL, 'di nga?', '2026-02-10 05:51:47'),
(41, 23, 1, NULL, 'wow', '2026-02-10 05:51:48'),
(42, 25, 4, NULL, 'need na namun now', '2026-02-10 06:52:53'),
(43, 25, 1, NULL, 'h khibjnoj', '2026-02-10 06:52:57'),
(44, 26, 1, NULL, 'anong email po', '2026-02-10 07:01:35'),
(45, 26, 4, NULL, 'yung email na to sample@ubix.com.ph', '2026-02-10 07:01:49'),
(46, 26, 1, NULL, 'ok po', '2026-02-10 07:01:54');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_status`
--

CREATE TABLE `ticket_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_status`
--

INSERT INTO `ticket_status` (`status_id`, `status_name`, `created_at`, `updated_at`) VALUES
(1, 'Open', '2026-01-09 03:58:31', '2026-01-13 03:54:51'),
(2, 'In Progress', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(3, 'On Hold', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(4, 'Resolved', '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(5, 'Closed', '2026-01-09 03:58:31', '2026-01-09 03:58:31');

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

INSERT INTO `users` (`user_id`, `employee_id`, `first_name`, `last_name`, `position`, `department_id`, `role_id`, `email`, `password_hash`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '02223325', 'Nathaniel', 'Talag', 'Programmer', 1, 1, 'admin@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-02-03 07:44:30'),
(2, '00000001', 'Tech', 'Support', 'IT Support', 1, 2, 'techsupport@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-01-09 03:58:31'),
(3, '00000002', 'Akahon', 'Ting', 'Accounting', 4, 3, 'accounting@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-01-12 07:12:43'),
(4, '00000003', 'Etch', 'Arr', 'Payroll', 2, 3, 'hr@ubix.com.ph', '1234', 1, '2026-01-09 05:58:36', '2026-01-26 09:48:22'),
(5, '00000004', 'Sey', 'Heyls', 'Head of Sales', 3, 3, 'sales@ubix.com.ph', '1234', 1, '2026-01-12 07:13:44', '2026-02-03 08:54:07'),
(10, '000000011', 'I Will', 'Support', 'IT Support', 1, 2, 'itsupport@ubix.com.ph', '1234', 1, '2026-02-04 01:51:07', '2026-02-04 01:51:07'),
(11, '000000012', 'I Can', 'Support', 'IT Support', 1, 2, 'itsupport1@ubix.com.ph', '1234', 1, '2026-02-04 01:51:24', '2026-02-04 01:51:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `priorities`
--
ALTER TABLE `priorities`
  ADD PRIMARY KEY (`priority_id`),
  ADD UNIQUE KEY `priority_name` (`priority_name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `priority_id` (`priority_id`);

--
-- Indexes for table `ticket_history`
--
ALTER TABLE `ticket_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `changed_by` (`changed_by`),
  ADD KEY `old_status_id` (`old_status_id`),
  ADD KEY `new_status_id` (`new_status_id`);

--
-- Indexes for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_message_id` (`parent_message_id`);

--
-- Indexes for table `ticket_status`
--
ALTER TABLE `ticket_status`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
