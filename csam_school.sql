-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2026 at 08:32 AM
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
-- Database: `csam_school`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('super_admin','admin') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `full_name`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@csam.edu', '$2a$10$rZ5qKvXxGxJKGJKGJKGJKOqKvXxGxJKGJKGJKGJKGJKGJKGJKGJKGe', 'System Administrator', 'super_admin', '2025-10-20 14:35:29', '2025-10-20 14:35:29'),
(2, 'test', 'test@csam.edu', '$2a$10$Lxkb7qvMFMAnB7xvpynUPOLXvXOWoEgeOwqOjpQtia2RkWCc8GQae', 'test', 'admin', '2025-10-20 14:40:12', '2025-10-20 14:40:12'),
(3, 'manzi', 'manzi@example.com', '$2a$10$OftlC4aV7gWG87IjtDxdRORctn5GBeRzX9ViRvUNL.RFNGOdAssH2', 'besigye', 'admin', '2025-10-21 08:24:13', '2025-11-14 18:06:32'),
(4, 'xavier', 'xaviernsabimna60@gmail.com', '$2a$10$rhi0LcjeSb04zd2ZTrYdMuKAOQnUEuNUkZ75W6tPn7izzPzw0rKqe', 'nsabimana', 'admin', '2025-10-30 04:53:47', '2025-10-30 04:53:47'),
(5, 'test0', 'test@gmail.com', '$2a$10$t114eFgSDbpCXr1qiq3YqeHJM/D6FJk6Q/ZHJqLODKoNsVxHtY3nm', 'test0', 'admin', '2025-12-18 12:49:14', '2025-12-18 12:49:14'),
(6, 'manzi0', 'manzi0@gmail.com', '$2a$10$sAf4CjRv5lKYpNrrGPMSceXyqDQOnBt53s2.Z16jif4cMP.gGbtaa', 'manzi0', 'admin', '2025-12-25 14:37:12', '2025-12-25 14:37:12');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notification_settings`
--

CREATE TABLE `admin_notification_settings` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `email_notifications` tinyint(1) DEFAULT 1,
  `sms_notifications` tinyint(1) DEFAULT 0,
  `in_app_notifications` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_password_resets`
--

CREATE TABLE `admin_password_resets` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `trade` varchar(100) NOT NULL,
  `level` enum('L1','L2','L3','L4','L5') NOT NULL,
  `deadline` datetime NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `title`, `description`, `trade`, `level`, `deadline`, `teacher_id`, `file_path`, `created_at`, `updated_at`) VALUES
(1, 'weekly assessment', 'dont copy from ai', 'building constraction', 'L5', '2026-10-01 10:00:00', 4, 'uploads\\assignments\\materials\\1766994154457-150571990.docx', '2025-12-29 07:42:34', '2025-12-29 07:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late','excused') NOT NULL DEFAULT 'absent',
  `remarks` varchar(255) DEFAULT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` longtext NOT NULL,
  `cover_image` varchar(512) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `published_date` date NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `cover_image`, `author_id`, `published_date`, `is_published`, `created_at`, `updated_at`) VALUES
(3, 'Holiday Package', 'holiday-package', 'Tugiye gushyiraho system yuko abanyeshuri bazajya bakora ibizamini mu kiruhuko kuberako twasanze iyo batashye batiga bityo rero tukaba tugiye gushyiramo iyo system twavuze haruguru', 'Tugiye gushyiraho system yuko abanyeshuri bazajya bakora ibizamini mu kiruhuko kuberako twasanze iyo batashye batiga bityo rero tukaba tugiye gushyiramo iyo system twavuze haruguru', '/uploads/news-1763144896454-646825892.JPG', 3, '2025-11-14', 1, '2025-11-14 18:28:35', '2025-11-14 18:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `exam_code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `total_marks` int(11) NOT NULL DEFAULT 0,
  `teacher_id` int(11) DEFAULT NULL,
  `trade` varchar(100) DEFAULT NULL,
  `level` enum('L1','L2','L3','L4','L5') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `title`, `exam_code`, `description`, `total_marks`, `teacher_id`, `trade`, `level`, `created_at`, `updated_at`) VALUES
(1, 'mock test', 'ABC123', 'l4', 100, 2, 'software development', 'L3', '2025-11-17 14:25:47', '2025-11-17 14:40:40'),
(2, 'Quality Asuarance', 'GENQA402', 'dor lo1', 30, 2, 'software development', 'L5', '2025-12-28 15:15:10', '2025-12-28 15:15:10');

-- --------------------------------------------------------

--
-- Table structure for table `holiday_assessments`
--

CREATE TABLE `holiday_assessments` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `trade` varchar(100) DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `allow_multiple_attempts` tinyint(1) DEFAULT 0,
  `max_attempts` int(11) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holiday_assessment_attempts`
--

CREATE TABLE `holiday_assessment_attempts` (
  `id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `student_identifier` varchar(150) NOT NULL,
  `student_name` varchar(150) DEFAULT NULL,
  `started_at` datetime DEFAULT current_timestamp(),
  `submitted_at` datetime DEFAULT NULL,
  `score` decimal(8,2) DEFAULT NULL,
  `status` enum('in_progress','submitted','graded') DEFAULT 'in_progress',
  `attempt_number` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holiday_assessment_choices`
--

CREATE TABLE `holiday_assessment_choices` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `choice_text` text NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `position` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holiday_assessment_questions`
--

CREATE TABLE `holiday_assessment_questions` (
  `id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `explanation` text DEFAULT NULL,
  `points` decimal(6,2) DEFAULT 1.00,
  `position` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institution_transfers`
--

CREATE TABLE `institution_transfers` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `current_institution` varchar(255) NOT NULL,
  `target_institution` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `witness_document_path` varchar(500) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles`
--

CREATE TABLE `news_articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `image_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image_urls`)),
  `author_id` int(11) DEFAULT NULL,
  `published_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news_articles`
--

INSERT INTO `news_articles` (`id`, `title`, `excerpt`, `content`, `category`, `image_url`, `image_urls`, `author_id`, `published_date`, `created_at`, `updated_at`) VALUES
(2, 'inama y\'ababyeyi', 'inama', 'Tuributsa ababyeyi babana ko bagomba kuzinduka mu nama izaba  kuwa 16/11/2025 ahagana saatatu zigitondo ubuyobozi bwikigo bukaba bubamenyesha ko utazahagera azacibwa amande yamafaranga agera kubihumbi bitanu(5000 frw)', 'Announcements', 'http://localhost:5000/uploads/news-1760974662243-644272864.jpg', '[\"http://localhost:5000/uploads/news-1760974662243-644272864.jpg\"]', 2, '2025-10-29', '2025-10-20 15:39:58', '2025-10-30 04:55:18'),
(5, 'Sport', 'Basketball', 'Umukino waruhuje Lycee de Muhura  na Collegio SAMZ \nAho byaje kurangira ari amanota 29 ya muhura kuri 24 ya Collegio SAMZ\n\nAho collegio itaje kwitwara neza Head master akaba abwira abakinnyi gukora cyane  kuko bazasura Muhura kuwa 8/11/2025', 'Events', '/uploads/news-1761807773684-319978778.JPG', '[\"/uploads/news-1761807773684-319978778.JPG\",\"/uploads/news-1761808178317-859351882.JPG\",\"/uploads/news-1761808162848-629298772.JPG\",\"/uploads/news-1761808202631-305237558.JPG\",\"/uploads/news-1761808220282-338190237.JPG\"]', 4, '2025-10-30', '2025-10-30 07:14:09', '2025-10-30 07:14:09'),
(6, 'Sport', 'Football', 'Uyu ni umukino wahuzaga CSAMZ ihura na Lycee de Muhura \nuyu mukino warangiye collegio yitwaye neza aho yatsindaga igitego kimwe (1)ku busa(0)  bwa Muhura \nHead master akaba yarashimiye abakinnyi bitabiye uyumukino ko bitwaye neza akaba ashimira nabafana bitabiye bagashyigikira ikigo cyabo', 'Events', '/uploads/news-1761808741450-733544935.JPG', '[\"/uploads/news-1761808741450-733544935.JPG\",\"/uploads/news-1761808732799-641199534.JPG\",\"/uploads/news-1761808503456-803274342.JPG\",\"/uploads/news-1761808751545-227251428.JPG\",\"/uploads/news-1761808519802-967166172.JPG\"]', 4, '2025-10-30', '2025-10-30 07:17:42', '2025-10-30 07:19:21'),
(7, 'Sport', 'Sport Women', 'Uyu ni umukino wahuzaga ikipe y\'abakobwa ba csamz na lycee de Muhura \naho umukino waje kurangira muhura itsinze csamz igitego kimwe(1) kubusa(0) \nHeade master wikigo akaba yaratangaje yuko abakobwa bakinnye neza kumpande zose akaba abashishikariza kongera imbaraga mumikinire yabo\n', 'Events', '/uploads/news-1761809138398-348743825.JPG', '[\"/uploads/news-1761809138398-348743825.JPG\",\"/uploads/news-1761809153045-950520305.JPG\",\"/uploads/news-1761809159794-112475004.JPG\",\"/uploads/news-1761809165158-256904445.JPG\",\"/uploads/news-1761809176002-922336899.JPG\"]', 4, '2025-10-30', '2025-10-30 07:29:26', '2025-10-30 07:29:26'),
(8, 'Sports', 'Volleyball', 'uyu mukino wahuzaga CSAMZ wahuzaga na Lyecee de Muhura \nAho CSAMZ yaje kwitwara neza itsinda ama seti abiri(2) ku rimwe(1) ya Muhura \nHead master akaba yarashimiye abakinnyi ko bitwaye neza ', 'Events', '/uploads/news-1761809425632-743038902.JPG', '[\"/uploads/news-1761809425632-743038902.JPG\",\"/uploads/news-1761809432164-993440351.JPG\",\"/uploads/news-1761809441517-938445173.JPG\",\"/uploads/news-1761809453176-422731565.JPG\",\"/uploads/news-1761809463861-155174224.JPG\"]', 4, '2025-10-30', '2025-10-30 07:33:12', '2025-10-30 07:33:12'),
(9, 'Fun mode', 'Abafana', 'Abafana aho bari bitabiye imikino yahuzaga CSAMZ na Lyce de Muhura \nAho abafana bari bishyimye cyane bitewe nuko CSAMZ yariri kwitwara neza \nnkuko bigaragara kumafoto', 'Events', '/uploads/news-1761809843017-289272563.JPG', '[\"/uploads/news-1761809843017-289272563.JPG\",\"/uploads/news-1761809848817-178207774.JPG\",\"/uploads/news-1761809857154-865648952.JPG\",\"/uploads/news-1761809865044-834007877.JPG\",\"/uploads/news-1761809874384-211224585.JPG\"]', 4, '2025-10-30', '2025-10-30 07:39:22', '2025-10-30 07:39:22'),
(10, 'Messe', 'Misa', 'aya mafoto arerekana ukuntu muri collgio biba byifashe  aho banyeshuri baba basenga ', 'Events', '/uploads/news-1761811085228-426437881.JPG', '[\"/uploads/news-1761811085228-426437881.JPG\",\"/uploads/news-1761811089759-424204162.JPG\",\"/uploads/news-1761811092560-89259874.JPG\",\"/uploads/news-1761811242615-69233407.JPG\",\"/uploads/news-1761811102381-572291907.JPG\"]', 4, '2025-10-30', '2025-10-30 08:00:04', '2025-10-30 08:00:45');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('student','teacher','admin') NOT NULL DEFAULT 'student',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','success','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `type` enum('MCQ','TF') NOT NULL DEFAULT 'MCQ',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correct_answer` varchar(255) NOT NULL,
  `marks` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `exam_id`, `question_text`, `type`, `options`, `correct_answer`, `marks`, `created_at`, `updated_at`) VALUES
(1, 1, 'how to say', 'MCQ', '[\"balk\",\"talk\",\"meow\",\"nooo\"]', 'balk', 1, '2025-11-17 14:33:09', '2025-11-17 14:33:09'),
(2, 1, 'manzi', 'TF', NULL, 'False', 2, '2025-12-26 14:33:24', '2025-12-26 14:33:24'),
(3, 1, 'man', 'MCQ', '[\"1\",\"2\",\"3\",\"5\"]', '2', 1, '2025-12-26 14:33:42', '2025-12-26 14:33:42'),
(4, 2, 'what is qa in full word', 'MCQ', '[\"quality ass\",\"quality control\",\"quality asssuarance\",\"ccant\"]', 'quality asssuarance', 20, '2025-12-28 15:16:24', '2025-12-28 15:16:24');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`id`, `student_id`, `exam_id`, `score`, `submitted_at`) VALUES
(1, 2, 1, 1, '2025-11-17 14:33:30'),
(2, 3, 1, 1, '2025-11-19 08:35:55'),
(3, 4, 1, 1, '2025-12-18 12:44:20'),
(4, 1, 1, 3, '2025-12-29 07:29:05'),
(8, 1, 2, 20, '2025-12-29 07:28:11');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(150) NOT NULL,
  `site_tagline` varchar(255) DEFAULT NULL,
  `contact_email` varchar(150) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_address` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `site_name`, `site_tagline`, `contact_email`, `contact_phone`, `contact_address`, `facebook_url`, `twitter_url`, `instagram_url`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'CSAM Zaccaria TVET', 'Excellence in Technical Education', 'info@csam.edu', '+250 000 000 000', 'Gicumbi, Rwanda', NULL, NULL, NULL, NULL, '2025-10-20 14:35:29', '2025-10-20 14:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `sms_settings`
--

CREATE TABLE `sms_settings` (
  `id` int(11) NOT NULL,
  `provider` enum('console','africastalking','twilio','pindo') DEFAULT 'console',
  `enabled` tinyint(1) DEFAULT 0,
  `sender_id` varchar(50) DEFAULT NULL,
  `api_key` text DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `additional_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_config`)),
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sms_settings`
--

INSERT INTO `sms_settings` (`id`, `provider`, `enabled`, `sender_id`, `api_key`, `username`, `additional_config`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'console', 0, NULL, NULL, NULL, NULL, NULL, '2025-10-20 14:35:29', '2025-10-20 14:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `trade` varchar(100) NOT NULL,
  `level` enum('L1','L2','L3','L4','L5') NOT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `username`, `email`, `phone_number`, `password`, `full_name`, `trade`, `level`, `institution`, `status`, `created_at`, `updated_at`) VALUES
(1, 'test', 'test@test.com', NULL, '$2a$10$eOuFd83Q29VN8vZXUxg8FOwTD5ev9YHm.WbjeCzicvVCjXf5kfY0e', 'test', 'Software Development', 'L3', NULL, 'active', '2025-10-20 14:36:38', '2025-11-17 14:40:40'),
(2, 'manzi.besigye', 'manzibesigye@gmail.com', '0795825296', '$2a$10$6wEWlL1eaNJILp7L2O.eoeEpX3WPwtuDm4PUpG/fqzzqih6d7u.LC', 'manzi besigye fabrice', 'Software Development', 'L3', NULL, 'active', '2025-11-17 13:36:46', '2025-11-17 14:40:40'),
(3, 'test3', 'test3@gmail.com', '0795825296', '$2a$10$z2.81MLTwPauKxwgUAi3AObOoDUPdGtIhLKIBkxsWFLUTGA.ZSJYq', 'test3', 'Software Development', 'L1', NULL, 'active', '2025-11-17 14:50:45', '2025-11-17 14:50:45'),
(4, 'test0', 'manzi@gmail.com', '07855555', '$2a$10$e4DbV4O6bybXynEeRkbw/eJloAyPBG..9LsC1r2Yl1.GxyZyEO/ru', 'manzi fabrice', 'Computer Systems and Networks', 'L1', NULL, 'active', '2025-12-18 12:33:49', '2025-12-18 12:33:49'),
(5, 'testbuc', 'testbuc@gmail.com', '0787777777', '$2a$10$m4rALNxBDyITnB3jS612y.sGqXptJawDUZj.aTz4SA4GLeIbRvUIm', 'test buc', 'Building Construction', 'L1', NULL, 'active', '2025-12-29 07:36:23', '2025-12-29 07:36:23');

-- --------------------------------------------------------

--
-- Table structure for table `student_answers`
--

CREATE TABLE `student_answers` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_answers`
--

INSERT INTO `student_answers` (`id`, `student_id`, `question_id`, `answer`, `is_correct`, `created_at`) VALUES
(1, 2, 1, 'balk', 1, '2025-11-17 14:33:30'),
(2, 3, 1, 'balk', 1, '2025-11-19 08:35:55'),
(3, 4, 1, 'balk', 1, '2025-12-18 12:44:20'),
(13, 1, 4, 'quality asssuarance', 1, '2025-12-29 07:28:11'),
(14, 1, 1, 'talk', 0, '2025-12-29 07:29:05'),
(15, 1, 2, 'False', 1, '2025-12-29 07:29:05'),
(16, 1, 3, '2', 1, '2025-12-29 07:29:05');

-- --------------------------------------------------------

--
-- Table structure for table `student_applications`
--

CREATE TABLE `student_applications` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `address` text NOT NULL,
  `program` varchar(100) NOT NULL,
  `previous_school` varchar(200) DEFAULT NULL,
  `previous_qualification` varchar(100) DEFAULT NULL,
  `guardian_name` varchar(100) DEFAULT NULL,
  `guardian_phone` varchar(20) DEFAULT NULL,
  `report_path` varchar(500) DEFAULT NULL COMMENT 'Path to the uploaded report file',
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_applications`
--

INSERT INTO `student_applications` (`id`, `full_name`, `email`, `phone_number`, `date_of_birth`, `gender`, `address`, `program`, `previous_school`, `previous_qualification`, `guardian_name`, `guardian_phone`, `report_path`, `status`, `admin_notes`, `approved_by`, `approved_at`, `created_at`, `updated_at`) VALUES
(1, 'test', 'iragenae626@gmail.com', '078888888', '2220-11-11', 'Other', 'fdfjghrfjghfjghfhg', 'Software Development', '2qewewewe', 'wewew', 'ewewewewe', '2345678', NULL, 'approved', 'yego', 3, '2025-11-10 16:18:19', '2025-10-29 13:09:54', '2025-11-10 16:18:19'),
(2, 'manzi besigye fabrice', 'fabricebesigye@gmail.com', '0785053453', '2009-11-11', 'Male', 'muko', 'Software Development', 'csamz', 'A-level', 'test emmy', '0789505459', '/uploads/applications/report-1762787989892-616191291.pdf', 'pending', NULL, NULL, NULL, '2025-11-10 15:19:50', '2025-11-10 15:19:50'),
(3, 'manzi besigye', 'manzibesigye@gmail.com', '0785053453', '2007-11-24', 'Male', 'muko', 'Building Construction', 'muko', 'A-level', 'test', '0789505459', '/uploads/applications/report-1762788061995-902329710.pdf', 'approved', 'uremerewe', 3, '2025-11-10 16:15:50', '2025-11-10 15:21:02', '2025-11-10 16:15:50'),
(4, 'kamana jp', 'manzibesigye@gmail.com', '0785053453', '2025-11-06', 'Male', 'muko', 'Software Development', 'muko', 'A-level', 'test', '0789505459', '/uploads/applications/report-1762861306489-695177815.pdf', 'approved', 'thankx', 3, '2025-11-11 11:42:34', '2025-11-11 11:41:46', '2025-11-11 11:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `student_assignment_submissions`
--

CREATE TABLE `student_assignment_submissions` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `submission_path` varchar(500) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `grade` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `trade` varchar(100) NOT NULL DEFAULT 'General',
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `full_name`, `username`, `email`, `password`, `trade`, `status`, `created_at`, `updated_at`) VALUES
(1, 'costa tich', 'costa', 'costa@gmail.com', '$2a$10$Qrvsc7.3RzkxYFXLJIt75eBSjqZDhm0h9MXL.bv2PcXtX22rUrXTG', 'General', 'approved', '2025-11-17 13:41:38', '2025-11-17 13:45:08'),
(2, 'alexi ndayambaje', 'ndayambajealex', 'alex@gmial.com', '$2a$10$9Javqrv9zlySSjg4EYp5MO3qdpN9xKZUsO6OUWPuD9Hb8i94ut.Ki', 'software development', 'approved', '2025-11-17 13:56:29', '2025-11-17 13:56:36'),
(3, 'manzi', 'besigye', 'manzi@gmail.com', '$2a$10$4J56P2VmlsvqMD7iHFWY7eGTZvxF0v5a/YhM/CdnOR6InP83cLWrm', 'software development', 'rejected', '2025-12-25 14:31:29', '2025-12-26 11:45:16'),
(4, 'mushaboha', 'mushaboha', 'mushaboha@gmail.com', '$2a$10$p0LIG.e2xcV7q9SdRFhnJOupVgY4Hg9.wV9p22wdszdSLVl32SUXm', 'building constraction', 'approved', '2025-12-29 07:39:45', '2025-12-29 07:40:05');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `program` varchar(100) NOT NULL,
  `graduation_year` varchar(4) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `testimonial_text` text NOT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `full_name`, `email`, `phone_number`, `program`, `graduation_year`, `rating`, `testimonial_text`, `profile_image`, `status`, `admin_notes`, `approved_by`, `approved_at`, `created_at`, `updated_at`) VALUES
(2, 'manzi', 'manzibesigye@gmail.com', '0785053453', 'Software Development', '2025', 5, 'mwarakoze!!!', NULL, 'approved', 'thakx', 3, '2025-11-14 18:07:24', '2025-11-14 18:02:41', '2025-11-14 18:07:24'),
(3, 'Jean Paul', 'admin@gmail.com', '0785053453', 'Plumbing Technology', '2025', 4, 'thank youu!!', NULL, 'approved', '.', 3, '2025-11-14 18:10:28', '2025-11-14 18:08:39', '2025-11-14 18:10:28'),
(4, 'Nsabimana Xavier', 'test@gmail.com', '0785053453', 'Software Development', '2020', 5, 'murabagaciro!!', NULL, 'approved', '.', 3, '2025-11-14 18:10:25', '2025-11-14 18:09:23', '2025-11-14 18:10:25'),
(5, 'Jean Dedieu', 'manzibesigye@gmail.com', '0785053453', 'Computer Systems', '2020', 4, 'Mwarakoze', NULL, 'approved', '.', 3, '2025-11-14 18:10:21', '2025-11-14 18:10:04', '2025-11-14 18:10:21');

-- --------------------------------------------------------

--
-- Table structure for table `_migrations`
--

CREATE TABLE `_migrations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_migrations`
--

INSERT INTO `_migrations` (`id`, `name`, `applied_at`) VALUES
(1, '2025-10-29-001-add-image-urls-to-news.sql', '2025-11-17 14:24:59'),
(2, '2025-10-29-002-create-blog-posts.sql', '2025-11-17 14:24:59'),
(3, '2025-11-09-001-create-institution-transfers.sql', '2025-11-17 14:24:59'),
(4, '2025-11-09-002-add-institution-to-students.sql', '2025-11-17 14:24:59'),
(5, '2025-11-09-003-add-report-path-to-applications.sql', '2025-11-17 14:24:59'),
(6, '2025-11-17-004-create-online-exams.sql', '2025-11-17 14:24:59'),
(7, '2025-11-17-005-create-teachers.sql', '2025-11-17 14:24:59'),
(8, '2025-11-17-006-add-phone-to-students.sql', '2025-11-17 14:24:59'),
(9, '2025-11-17-007-add-trade-to-teachers.sql', '2025-11-17 14:24:59'),
(10, '2025-11-17-008-add-exam-code.sql', '2025-11-17 14:24:59'),
(11, '2025-11-17-009-add-trade-to-exams.sql', '2025-11-17 14:24:59'),
(12, '2025-11-17-010-add-level-support.sql', '2025-11-17 14:41:04'),
(13, '2025-12-26-001-create-student-dashboard-tables.sql', '2025-12-25 14:28:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_admins_email` (`email`),
  ADD KEY `idx_admins_username` (`username`);

--
-- Indexes for table `admin_notification_settings`
--
ALTER TABLE `admin_notification_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_admin_notification` (`admin_id`);

--
-- Indexes for table `admin_password_resets`
--
ALTER TABLE `admin_password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_password_resets_admin` (`admin_id`),
  ADD KEY `idx_admin_password_resets_token` (`token_hash`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_assignments_trade` (`trade`),
  ADD KEY `idx_assignments_level` (`level`),
  ADD KEY `fk_assignments_teacher` (`teacher_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_student_date` (`student_id`,`date`),
  ADD KEY `idx_attendance_date` (`date`),
  ADD KEY `idx_attendance_student` (`student_id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_blog_author` (`author_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_exams_exam_code` (`exam_code`),
  ADD KEY `fk_exams_teacher` (`teacher_id`);

--
-- Indexes for table `holiday_assessments`
--
ALTER TABLE `holiday_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `holiday_assessment_attempts`
--
ALTER TABLE `holiday_assessment_attempts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_assessment_attempt` (`assessment_id`,`student_identifier`,`attempt_number`);

--
-- Indexes for table `holiday_assessment_choices`
--
ALTER TABLE `holiday_assessment_choices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `holiday_assessment_questions`
--
ALTER TABLE `holiday_assessment_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assessment_id` (`assessment_id`);

--
-- Indexes for table `institution_transfers`
--
ALTER TABLE `institution_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `processed_by` (`processed_by`),
  ADD KEY `idx_institution_transfers_student` (`student_id`),
  ADD KEY `idx_institution_transfers_status` (`status`),
  ADD KEY `idx_institution_transfers_created` (`created_at`);

--
-- Indexes for table `news_articles`
--
ALTER TABLE `news_articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `idx_news_category` (`category`),
  ADD KEY `idx_news_published_date` (`published_date`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_user` (`user_id`,`user_type`),
  ADD KEY `idx_notifications_unread` (`user_id`,`is_read`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_questions_exam` (`exam_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_student_exam` (`student_id`,`exam_id`),
  ADD KEY `fk_results_exam` (`exam_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `sms_settings`
--
ALTER TABLE `sms_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_students_username` (`username`),
  ADD KEY `idx_students_status` (`status`),
  ADD KEY `idx_students_trade` (`trade`);

--
-- Indexes for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_student_question` (`student_id`,`question_id`),
  ADD KEY `fk_answers_question` (`question_id`);

--
-- Indexes for table `student_applications`
--
ALTER TABLE `student_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_applications_status` (`status`),
  ADD KEY `idx_applications_program` (`program`),
  ADD KEY `idx_applications_created_at` (`created_at`),
  ADD KEY `idx_applications_phone` (`phone_number`);

--
-- Indexes for table `student_assignment_submissions`
--
ALTER TABLE `student_assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_student_assignment` (`student_id`,`assignment_id`),
  ADD KEY `fk_submissions_assignment` (`assignment_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_teachers_username` (`username`),
  ADD UNIQUE KEY `uq_teachers_email` (`email`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_testimonials_status` (`status`),
  ADD KEY `idx_testimonials_program` (`program`),
  ADD KEY `idx_testimonials_rating` (`rating`),
  ADD KEY `idx_testimonials_created_at` (`created_at`);

--
-- Indexes for table `_migrations`
--
ALTER TABLE `_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `admin_notification_settings`
--
ALTER TABLE `admin_notification_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_password_resets`
--
ALTER TABLE `admin_password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `holiday_assessments`
--
ALTER TABLE `holiday_assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `holiday_assessment_attempts`
--
ALTER TABLE `holiday_assessment_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holiday_assessment_choices`
--
ALTER TABLE `holiday_assessment_choices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holiday_assessment_questions`
--
ALTER TABLE `holiday_assessment_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `institution_transfers`
--
ALTER TABLE `institution_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles`
--
ALTER TABLE `news_articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sms_settings`
--
ALTER TABLE `sms_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student_answers`
--
ALTER TABLE `student_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `student_applications`
--
ALTER TABLE `student_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `student_assignment_submissions`
--
ALTER TABLE `student_assignment_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `_migrations`
--
ALTER TABLE `_migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_notification_settings`
--
ALTER TABLE `admin_notification_settings`
  ADD CONSTRAINT `admin_notification_settings_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_password_resets`
--
ALTER TABLE `admin_password_resets`
  ADD CONSTRAINT `admin_password_resets_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `fk_exams_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `holiday_assessments`
--
ALTER TABLE `holiday_assessments`
  ADD CONSTRAINT `holiday_assessments_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `holiday_assessments_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `holiday_assessment_attempts`
--
ALTER TABLE `holiday_assessment_attempts`
  ADD CONSTRAINT `holiday_assessment_attempts_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `holiday_assessments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `holiday_assessment_choices`
--
ALTER TABLE `holiday_assessment_choices`
  ADD CONSTRAINT `holiday_assessment_choices_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `holiday_assessment_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `holiday_assessment_questions`
--
ALTER TABLE `holiday_assessment_questions`
  ADD CONSTRAINT `holiday_assessment_questions_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `holiday_assessments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `institution_transfers`
--
ALTER TABLE `institution_transfers`
  ADD CONSTRAINT `institution_transfers_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `institution_transfers_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `news_articles`
--
ALTER TABLE `news_articles`
  ADD CONSTRAINT `news_articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `fk_results_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_results_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD CONSTRAINT `site_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sms_settings`
--
ALTER TABLE `sms_settings`
  ADD CONSTRAINT `sms_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_answers_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_applications`
--
ALTER TABLE `student_applications`
  ADD CONSTRAINT `student_applications_ibfk_1` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_ibfk_1` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
