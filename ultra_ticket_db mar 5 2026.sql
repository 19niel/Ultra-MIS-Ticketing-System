-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2026 at 06:37 AM
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
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `branch_id` int(11) NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`branch_id`, `branch_name`, `created_at`) VALUES
(1, 'Head Office (Angono)', '2026-02-10 09:01:34'),
(2, 'Pet Plans (Guadalupe)', '2026-02-10 09:01:34'),
(3, 'Sucat Office', '2026-02-10 09:01:34');

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
(4, 'NetSuite', '2026-01-09 03:58:31', '2026-03-02 05:26:26'),
(5, 'Accounts', '2026-01-09 03:58:31', '2026-03-02 05:26:49'),
(6, 'Others', '2026-03-02 05:24:27', '2026-03-02 05:24:27');

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
(5, 'E-Commerce', '2026-01-09 03:58:31', '2026-02-11 02:48:42'),
(6, 'Managers', '2026-01-09 03:58:31', '2026-02-11 02:48:58');

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
  `department_id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status_id` int(11) NOT NULL,
  `priority_id` int(11) NOT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_resolved` tinyint(1) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_id`, `ticket_number`, `created_by`, `assigned_to`, `department_id`, `branch_id`, `category_id`, `subject`, `description`, `status_id`, `priority_id`, `closed_at`, `created_at`, `updated_at`, `is_resolved`, `remarks`) VALUES
(102, 'TKT-0000001', '00000003', '00000001', 2, 1, 2, 'Need HDMI ', 'now na ', 4, 1, '2026-03-02 05:33:47', '2026-03-02 01:32:22', '2026-03-02 05:33:47', 1, NULL),
(103, 'TKT-0000002', '00000003', '00000001', 1, 1, 1, 'need namin ng rice cooker ', 'ngjjytyrstdfzvcxbn', 4, 3, '2026-03-02 08:24:40', '2026-03-02 05:34:50', '2026-03-02 08:24:40', 1, NULL),
(104, 'TKT-0000003', '00000004', '00000001', 3, 1, 3, 'ubos na pera ko ', 'sales pero walang profit ', 4, 3, '2026-03-02 08:03:24', '2026-03-02 07:34:42', '2026-03-02 08:03:24', 1, NULL),
(114, 'TKT-0000005', '00000004', '00000001', 1, 1, 1, 'new Ticket to ', 'pa close nalang', 4, 1, '2026-03-03 02:41:42', '2026-03-03 02:40:49', '2026-03-03 02:41:42', 1, NULL),
(115, 'TKT-0000006', '00000004', '00000001', 1, 1, 1, 'dapat failed to ', 'failed dapat to ', 4, 3, '2026-03-03 02:48:45', '2026-03-03 02:48:09', '2026-03-03 02:48:45', 0, NULL),
(116, 'TKT-0000007', '00000004', '00000001', 2, 1, 1, 'close mo ulit bagong template', 'boom', 4, 1, '2026-03-03 02:58:41', '2026-03-03 02:58:03', '2026-03-03 02:58:41', 1, NULL),
(117, 'TKT-0000008', '00000004', '00000001', 1, 1, 1, 'new ulit to ', 'boom', 4, 2, '2026-03-03 03:04:00', '2026-03-03 03:03:20', '2026-03-03 03:04:00', 1, NULL),
(118, 'TKT-0000009', '00000004', '00000001', 1, 1, 1, 'dapat ayos na yung categ, priority, at assignee', 'boom boom boom ', 4, 1, '2026-03-03 03:14:51', '2026-03-03 03:14:31', '2026-03-03 03:14:51', 1, NULL),
(119, 'TKT-0000010', '00000004', '00000001', 2, 1, 1, 'new ulit email sending ', 'boom bom boom ', 4, 1, '2026-03-03 03:18:37', '2026-03-03 03:17:56', '2026-03-03 03:18:37', 1, NULL),
(120, 'TKT-0000011', '00000004', '00000001', 1, 1, 1, 'may remarks na dapat ', 'boom', 4, 1, '2026-03-03 03:52:30', '2026-03-03 03:35:44', '2026-03-03 07:27:22', 1, 'remarks to'),
(121, 'TKT-0000012', '00000004', '00000001', 1, 1, 1, 'new remarks ulit to ', 'boom boom boom \n', 4, 2, '2026-03-03 07:52:37', '2026-03-03 07:49:52', '2026-03-03 07:52:37', 1, 'pinuntahan ko lang umayos na agad'),
(140, 'TKT-0000013', '00000004', '02223326', 1, 1, 1, 'boom ', '123123', 1, 1, NULL, '2026-03-04 06:49:45', '2026-03-04 06:50:13', NULL, NULL),
(141, 'TKT-0000014', '00000004', '00000001', 1, 1, 6, 'Pabili isang LV Imagination', '100ML sana kaso bente lang budget ko ', 4, 2, '2026-03-04 07:17:06', '2026-03-04 07:16:26', '2026-03-04 07:17:06', 1, 'mag max yellow ka nalang boss'),
(142, 'TKT-0000015', '00000004', '00000001', 1, 1, 6, 'pabili naman ADG', 'bente ulit budget', 4, 1, '2026-03-04 07:20:12', '2026-03-04 07:19:46', '2026-03-04 07:20:12', 0, 'pass'),
(143, 'TKT-0000016', '00000004', '00000001', 3, 1, 2, 'saan aabot bente ko?', 'dasdssda', 4, 2, '2026-03-04 07:24:25', '2026-03-04 07:23:34', '2026-03-04 07:24:25', 1, 'punta ka kila ian sniff sesh ka muna'),
(144, 'TKT-0000017', '00000004', '00000001', 2, 1, 1, 'New Email format', 'eweqwrewr', 4, 1, '2026-03-04 07:26:36', '2026-03-04 07:26:12', '2026-03-04 07:26:36', 1, 'rewrerw'),
(145, 'TKT-0000018', '00000004', NULL, 1, 1, 1, 'dapat ayos na close email template ', 'sdfdssdffdsfdsfs', 4, 1, '2026-03-04 07:32:29', '2026-03-04 07:32:10', '2026-03-04 07:32:29', 1, 'asdafsdf'),
(146, 'TKT-0000019', '00000004', NULL, 1, 1, 1, 'close na maayos', 'sfsdfdsffsd', 4, 1, '2026-03-04 07:34:37', '2026-03-04 07:34:16', '2026-03-04 07:34:37', 1, 'dsfsdffsdf'),
(147, 'TKT-0000020', '00000004', '00000001', 3, 1, 1, 'NEW ulit', 'dassaa', 4, 3, '2026-03-04 07:39:50', '2026-03-04 07:39:16', '2026-03-04 07:39:50', 1, 'ssfssff'),
(148, 'TKT-0000021', '00000004', '00000001', 1, 1, 1, 'oks na dapat', 'dsadas', 4, 3, '2026-03-04 07:56:59', '2026-03-04 07:56:21', '2026-03-04 07:56:59', 1, 'ok na'),
(149, 'TKT-0000022', '00000004', '00000001', 2, 1, 1, 'new ulit ', 'dasd', 4, 2, '2026-03-04 08:04:37', '2026-03-04 08:04:19', '2026-03-04 08:04:37', 1, 'gdfgfdgdf'),
(150, 'TKT-0000023', '00000004', '02223326', 3, 1, 1, 'gfdgd', 'gdfgfd', 4, 3, '2026-03-04 08:05:09', '2026-03-04 08:04:46', '2026-03-04 08:05:09', 1, 'gdfgdfgfdgd'),
(151, 'TKT-0000024', '00000004', '00000001', 2, 1, 1, 'dsad', 'dsada', 1, 1, NULL, '2026-03-04 08:08:50', '2026-03-05 03:58:34', 1, 'dasdsa'),
(153, 'TKT-0000025', '00000003', '00000001', 1, 1, 1, 'boom ', 'boom', 4, 4, '2026-03-05 05:15:23', '2026-03-05 03:58:51', '2026-03-05 05:15:23', 1, 'asdghjk');

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
(52, 51, 1, NULL, 'tapos ana', '2026-02-20 10:23:50'),
(64, 102, 1, NULL, 'tapos na yan ', '2026-03-02 05:32:19'),
(65, 102, 1, NULL, 'oks na', '2026-03-02 05:32:41'),
(69, 104, 1, NULL, 'close ko na', '2026-03-02 08:03:22'),
(72, 114, 1, NULL, 'i close ko na', '2026-03-03 02:41:25'),
(73, 115, 1, NULL, 'failed ko to ah', '2026-03-03 02:48:20'),
(74, 117, 1, NULL, 'okk', '2026-03-03 03:03:57'),
(75, 119, 1, NULL, 'boom boom', '2026-03-03 03:18:35'),
(78, 140, 1, NULL, 'oy', '2026-03-04 06:59:07'),
(79, 140, 1, NULL, 'wag', '2026-03-04 06:59:12'),
(80, 140, 1, NULL, 'dsd', '2026-03-04 07:00:35'),
(81, 140, 5, NULL, 'dsd', '2026-03-04 07:00:37'),
(82, 140, 5, NULL, 'sad', '2026-03-04 07:01:28'),
(83, 140, 1, NULL, 'dasd', '2026-03-04 07:01:33'),
(84, 140, 1, NULL, 'sadsa', '2026-03-04 07:01:34'),
(85, 140, 1, NULL, 'dsads', '2026-03-04 07:01:35'),
(86, 140, 5, NULL, 'dsds', '2026-03-04 07:01:39'),
(87, 140, 5, NULL, 'wag', '2026-03-04 07:01:40'),
(88, 140, 5, NULL, 'po', '2026-03-04 07:01:41'),
(89, 140, 1, NULL, 'fsdf', '2026-03-04 07:04:52'),
(90, 140, 1, NULL, 'dsfs', '2026-03-04 07:04:54'),
(91, 140, 1, NULL, 'dsfs', '2026-03-04 07:04:55'),
(92, 140, 1, NULL, 'fsdf', '2026-03-04 07:04:55'),
(93, 140, 1, NULL, 'sdf', '2026-03-04 07:04:55'),
(94, 141, 5, NULL, 'das', '2026-03-04 07:17:14'),
(95, 143, 1, NULL, 'wala', '2026-03-04 07:24:07'),
(96, 148, 5, NULL, 'dsds', '2026-03-04 07:57:05'),
(97, 148, 5, NULL, 'ds', '2026-03-04 07:57:07'),
(104, 153, 1, NULL, 'yo', '2026-03-05 05:06:03'),
(105, 153, 4, NULL, 'yp din', '2026-03-05 05:06:08'),
(106, 153, 2, NULL, 'tech support to', '2026-03-05 05:07:00');

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
(4, 'Closed', '2026-01-09 03:58:31', '2026-02-18 06:31:02');

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
(1, '02223325', 'Nathaniel', 'Talag', 'Programmer', 1, 1, 1, 'admin@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-03-04 07:10:54'),
(2, '00000001', 'Tech', 'Support', 'IT Support', 1, 1, 2, 'techsupport@ubix.com.ph', '1234', 1, '2026-01-09 03:58:31', '2026-02-10 09:01:35'),
(4, '00000003', 'Etch', 'Arr', 'Payroll', 2, 1, 3, 'hr@ubix.com.ph', '1234', 1, '2026-01-09 05:58:36', '2026-03-04 07:11:20'),
(5, '00000004', 'Sey', 'Heyls', 'Head of Sales', 3, 1, 3, 'sales@ubix.com.ph', '1234', NULL, '2026-01-12 07:13:44', '2026-03-04 07:14:35'),
(15, '012023326', 'Nathaniel', 'Talag', 'programmer', 1, 1, 3, 'nathanieltalag@gmail.com', '1234', 1, '2026-02-27 09:16:43', '2026-02-27 09:16:43'),
(16, '013045924', 'Bon', 'Bidan', 'IT MANAGER', 1, 1, 3, 'demetrio.bidan@ubix.com.ph', 'M1s@dm1n', 1, '2026-02-27 09:19:55', '2026-02-27 09:19:55'),
(29, '02223326', 'Test', 'Boom', 'asdfsdgnfb', 2, 1, 2, 'test@gmail.com', '1234', 1, '2026-03-02 08:47:49', '2026-03-02 08:47:49');

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
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`);

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
  ADD KEY `priority_id` (`priority_id`),
  ADD KEY `tickets_ibfk_6` (`department_id`),
  ADD KEY `tickets_ibfk_7` (`branch_id`);

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
  ADD KEY `role_id` (`role_id`),
  ADD KEY `users_ibfk_3` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_6` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `tickets_ibfk_7` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
