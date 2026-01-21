-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 21, 2026 at 04:05 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `suitpalace_db_serpong`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `username`, `password_hash`) VALUES
(1, 'admin_sphoc', '$2b$10$cddfzx1PEvuUYeU03Kb2XubQT../t6.LwWztdc18ljhs7A./RWMdu'),
(2, 'admin1_sphoc', '$2b$10$xjLofFMrdOfWSCK4H3gdUe8Yi55Ob15IcB1m0rMqScDLOXX8wJ9vW'),
(3, 'sobatweb1', '$2b$10$HJwq/HYbjffJw.KCX8xu6eGXvPSmFd7PcFpaq.Oo/U2jUi8dDBHJO');

-- --------------------------------------------------------

--
-- Table structure for table `booked`
--

CREATE TABLE `booked` (
  `id_booked` int(11) NOT NULL,
  `id_jas` int(11) DEFAULT NULL,
  `id_kemeja` int(11) DEFAULT NULL,
  `id_celana` int(11) DEFAULT NULL,
  `id_changshan` int(11) DEFAULT NULL,
  `id_dasi` int(11) DEFAULT NULL,
  `id_vest` int(11) DEFAULT NULL,
  `id_tuxedo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `celana`
--

CREATE TABLE `celana` (
  `id_celana` int(11) NOT NULL,
  `name_celana` varchar(100) NOT NULL,
  `size_celana` varchar(10) NOT NULL,
  `color_celana` varchar(15) NOT NULL,
  `stock_celana` int(11) DEFAULT 0,
  `condition_celana` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `celana`
--

INSERT INTO `celana` (`id_celana`, `name_celana`, `size_celana`, `color_celana`, `stock_celana`, `condition_celana`) VALUES
(1, 'Formal Black', '32', 'Hitam', 5, 'Bagus');

-- --------------------------------------------------------

--
-- Table structure for table `changshan`
--

CREATE TABLE `changshan` (
  `id_changshan` int(11) NOT NULL,
  `name_changshan` varchar(100) NOT NULL,
  `size_changshan` varchar(10) NOT NULL,
  `color_changshan` varchar(15) NOT NULL,
  `stock_changshan` int(11) DEFAULT 0,
  `condition_changshan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `changshan`
--

INSERT INTO `changshan` (`id_changshan`, `name_changshan`, `size_changshan`, `color_changshan`, `stock_changshan`, `condition_changshan`) VALUES
(1, 'Classic Black', 'XL', 'Hitam', 1, 'Bagus');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id_customer` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(15) NOT NULL,
  `bank_account` varchar(100) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT 0.00,
  `penalty_fee` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `customer_order`
-- (See below for the actual view)
--
CREATE TABLE `customer_order` (
`id_order` int(11)
,`customer_name` varchar(100)
,`customer_phone` varchar(15)
,`package_name` varchar(100)
,`total_price` decimal(10,2)
,`amount_paid` decimal(10,2)
,`items_bundle` text
,`start_dates` date
,`end_dates` date
,`durasi_hari` int(7)
,`status_rent` enum('Booked','Diambil','Dikembalikan','Cancel')
);

-- --------------------------------------------------------

--
-- Table structure for table `dasi`
--

CREATE TABLE `dasi` (
  `id_dasi` int(11) NOT NULL,
  `kode_dasi` varchar(10) NOT NULL,
  `color_dasi` varchar(15) NOT NULL,
  `stock_dasi` int(11) DEFAULT 0,
  `description_dasi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dasi`
--

INSERT INTO `dasi` (`id_dasi`, `kode_dasi`, `color_dasi`, `stock_dasi`, `description_dasi`) VALUES
(1, 'D-001', 'Merah', 10, 'Dasi sutra polos');

-- --------------------------------------------------------

--
-- Table structure for table `history_orders`
--

CREATE TABLE `history_orders` (
  `id_history` int(11) NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(15) DEFAULT NULL,
  `bank_account` varchar(100) DEFAULT NULL,
  `package_name` varchar(100) DEFAULT NULL,
  `omset_order` decimal(10,2) DEFAULT NULL,
  `denda_paid` decimal(10,2) DEFAULT 0.00,
  `order_date` date DEFAULT NULL,
  `return_date` datetime DEFAULT NULL,
  `condition_return` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jas`
--

CREATE TABLE `jas` (
  `id_jas` int(11) NOT NULL,
  `name_jas` varchar(100) NOT NULL,
  `size_jas` varchar(10) NOT NULL,
  `color_jas` varchar(15) NOT NULL,
  `stock_jas` int(11) DEFAULT 0,
  `condition_jas` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jas`
--

INSERT INTO `jas` (`id_jas`, `name_jas`, `size_jas`, `color_jas`, `stock_jas`, `condition_jas`) VALUES
(1, 'Slim Fit Tuxedo', 'M', 'Hitam', 5, 'Bagus');

-- --------------------------------------------------------

--
-- Table structure for table `kemeja`
--

CREATE TABLE `kemeja` (
  `id_kemeja` int(11) NOT NULL,
  `name_kemeja` varchar(100) NOT NULL,
  `size_kemeja` varchar(10) NOT NULL,
  `color_kemeja` varchar(15) NOT NULL,
  `stock_kemeja` int(11) DEFAULT 0,
  `condition_kemeja` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kemeja`
--

INSERT INTO `kemeja` (`id_kemeja`, `name_kemeja`, `size_kemeja`, `color_kemeja`, `stock_kemeja`, `condition_kemeja`) VALUES
(1, 'Black Satin', 'XL', 'Hitam', 5, 'Bagus');

-- --------------------------------------------------------

--
-- Table structure for table `laundry`
--

CREATE TABLE `laundry` (
  `id_laundry` int(11) NOT NULL,
  `id_jas` int(11) DEFAULT NULL,
  `id_kemeja` int(11) DEFAULT NULL,
  `id_celana` int(11) DEFAULT NULL,
  `id_vest` int(11) DEFAULT NULL,
  `id_tuxedo` int(11) DEFAULT NULL,
  `id_changshan` int(11) DEFAULT NULL,
  `id_dasi` int(11) DEFAULT NULL,
  `status_laundry` enum('Belum Selesai','Selesai') DEFAULT 'Belum Selesai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laundry`
--

INSERT INTO `laundry` (`id_laundry`, `id_jas`, `id_kemeja`, `id_celana`, `id_vest`, `id_tuxedo`, `id_changshan`, `id_dasi`, `status_laundry`) VALUES
(5, NULL, 1, NULL, NULL, NULL, NULL, NULL, 'Belum Selesai'),
(8, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'Belum Selesai'),
(11, NULL, NULL, NULL, NULL, 1, NULL, NULL, 'Belum Selesai');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `id_marks` int(11) NOT NULL,
  `color_mark` varchar(20) DEFAULT NULL,
  `note_mark` text DEFAULT NULL,
  `date_mark` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marks`
--

INSERT INTO `marks` (`id_marks`, `color_mark`, `note_mark`, `date_mark`) VALUES
(1, '#1de22a', 'Pastikan Membaca Panduaan Book lebih dulu', '2026-01-22 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id_note` int(11) NOT NULL,
  `title_note` varchar(100) DEFAULT NULL,
  `description_note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id_note`, `title_note`, `description_note`, `created_at`) VALUES
(1, 'REMINDER', 'Pastikan Menginput Data dengan Benar dan Lengkap', '2026-01-13 14:58:11');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id_order` int(11) NOT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `id_package` int(11) DEFAULT NULL,
  `id_booked` int(11) DEFAULT NULL,
  `order_date` date DEFAULT curdate(),
  `start_dates` date NOT NULL,
  `end_dates` date NOT NULL,
  `actual_return_date` datetime DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `penalty_paid` decimal(10,2) DEFAULT 0.00,
  `status_rent` enum('Booked','Diambil','Dikembalikan','Cancel') DEFAULT 'Booked',
  `status_order` enum('Belum Selesai','Sudah Selesai') DEFAULT 'Belum Selesai',
  `condition_return` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `order_items`
--
DELIMITER $$
CREATE TRIGGER `after_payment_finish` AFTER UPDATE ON `order_items` FOR EACH ROW BEGIN
    DECLARE cust_name VARCHAR(100);
    DECLARE cust_phone VARCHAR(15);
    DECLARE bank_acc VARCHAR(100);
    DECLARE discount_val DECIMAL(5,2);
    DECLARE pkg_name VARCHAR(100);
    DECLARE omset_murni DECIMAL(10,2);

    
    IF NEW.status_order = 'Sudah Selesai' AND OLD.status_order = 'Belum Selesai' THEN
        
        
        SELECT customer_name, customer_phone, bank_account, discount 
        INTO cust_name, cust_phone, bank_acc, discount_val 
        FROM customers WHERE id_customer = NEW.id_customer;

        SELECT package_name INTO pkg_name FROM packages WHERE id_package = NEW.id_package;
        
        
        
        
        IF NEW.status_rent = 'Cancel' THEN
            SET omset_murni = 0;
        ELSE
            SET omset_murni = (NEW.total_price - (NEW.total_price * IFNULL(discount_val, 0) / 100));
        END IF;

        
        
        INSERT INTO history_orders (
            customer_name, 
            customer_phone,
            bank_account,
            package_name, 
            omset_order, 
            denda_paid, 
            order_date,
            return_date, 
            condition_return
        )
        VALUES (
            cust_name, 
            cust_phone,
            bank_acc,
            pkg_name, 
            omset_murni, 
            IF(NEW.status_rent = 'Cancel', NEW.amount_paid, NEW.penalty_paid),
            NEW.order_date,
            NEW.actual_return_date, 
            NEW.condition_return
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id_package` int(11) NOT NULL,
  `package_name` varchar(100) NOT NULL,
  `package_price` decimal(10,2) NOT NULL,
  `duration_day` int(11) NOT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `penalty_fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id_package`, `package_name`, `package_price`, `duration_day`, `deposit`, `penalty_fee`) VALUES
(1, '1 Set of Suit + Pants (3 hari)', 350000.00, 3, 700000.00, 70000.00),
(2, '1 Set of Suit + Pants (4 hari)', 400000.00, 4, 700000.00, 70000.00),
(3, '1 Set of Suit + Pants (7 hari)', 500000.00, 7, 700000.00, 70000.00),
(4, '1 Set of Suit + Pants + Vest (3 hari)', 425000.00, 3, 900000.00, 90000.00),
(5, '1 Set of Suit + Pants + Shirt (4 hari)', 425000.00, 4, 875000.00, 90000.00),
(6, '1 Set of Suit + Pants + Vest (4 hari)', 500000.00, 4, 900000.00, 90000.00),
(7, '1 Set of Suit + Pants + Shirt (4 hari)', 500000.00, 4, 875000.00, 90000.00),
(8, '1 Set of Suit + Pants + Vest (7 hari)', 625000.00, 7, 875000.00, 90000.00),
(9, '1 Set of Suit + Pants + Shirt (7 hari)', 625000.00, 7, 875000.00, 90000.00),
(10, '1 Set of Suit + Pants + Vest + Shirt + Bow Tie (3 hari)', 550000.00, 3, 1125000.00, 120000.00),
(11, '1 Set of Suit + Pants + Vest + Tuxedo + Bow Tie (3 hari)', 550000.00, 3, 1150000.00, 120000.00),
(12, '1 Set of Suit + Pants + Vest + Shirt + Bow Tie (4 hari)', 625000.00, 4, 1125000.00, 120000.00),
(13, '1 Set of Suit + Pants + Vest + Tuxedo + Bow Tie (4 hari)', 625000.00, 4, 1150000.00, 120000.00),
(14, '1 Set of Suit + Pants + Vest + Shirt + Bow Tie (7 hari)', 750000.00, 7, 1125000.00, 120000.00),
(15, '1 Set of Suit + Pants + Vest + Tuxedo + Bow Tie (7 hari)', 750000.00, 7, 1150000.00, 120000.00),
(16, 'CUSTOM (SATUAN)', 0.00, 0, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Stand-in structure for view `product_stock`
-- (See below for the actual view)
--
CREATE TABLE `product_stock` (
`kategori` varchar(9)
,`nama` varchar(100)
,`ukuran` varchar(10)
,`stok` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `tuxedo`
--

CREATE TABLE `tuxedo` (
  `id_tuxedo` int(11) NOT NULL,
  `name_tuxedo` varchar(100) NOT NULL,
  `size_tuxedo` varchar(10) NOT NULL,
  `color_tuxedo` varchar(15) NOT NULL,
  `stock_tuxedo` int(11) DEFAULT 0,
  `condition_tuxedo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tuxedo`
--

INSERT INTO `tuxedo` (`id_tuxedo`, `name_tuxedo`, `size_tuxedo`, `color_tuxedo`, `stock_tuxedo`, `condition_tuxedo`) VALUES
(1, 'Brown Casual Tuxedo', 'S', 'Cokelat', 4, 'Bagus');

-- --------------------------------------------------------

--
-- Table structure for table `vest`
--

CREATE TABLE `vest` (
  `id_vest` int(11) NOT NULL,
  `name_vest` varchar(100) NOT NULL,
  `size_vest` varchar(10) NOT NULL,
  `color_vest` varchar(15) NOT NULL,
  `stock_vest` int(11) DEFAULT 0,
  `condition_vest` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vest`
--

INSERT INTO `vest` (`id_vest`, `name_vest`, `size_vest`, `color_vest`, `stock_vest`, `condition_vest`) VALUES
(1, 'Brown Casual Vest', 'S', 'Cokelat', 6, 'Bagus');

-- --------------------------------------------------------

--
-- Structure for view `customer_order`
--
DROP TABLE IF EXISTS `customer_order`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `customer_order`  AS SELECT `o`.`id_order` AS `id_order`, `c`.`customer_name` AS `customer_name`, `c`.`customer_phone` AS `customer_phone`, `p`.`package_name` AS `package_name`, `o`.`total_price` AS `total_price`, `o`.`amount_paid` AS `amount_paid`, concat_ws(' + ',`j`.`name_jas`,`k`.`name_kemeja`,`cl`.`name_celana`,`cs`.`name_changshan`,if(`d`.`kode_dasi` is not null,concat('Dasi: ',`d`.`kode_dasi`),NULL),`v`.`name_vest`,`t`.`name_tuxedo`) AS `items_bundle`, `o`.`start_dates` AS `start_dates`, `o`.`end_dates` AS `end_dates`, to_days(`o`.`end_dates`) - to_days(`o`.`start_dates`) AS `durasi_hari`, `o`.`status_rent` AS `status_rent` FROM ((((((((((`order_items` `o` join `customers` `c` on(`o`.`id_customer` = `c`.`id_customer`)) join `packages` `p` on(`o`.`id_package` = `p`.`id_package`)) join `booked` `b` on(`o`.`id_booked` = `b`.`id_booked`)) left join `jas` `j` on(`b`.`id_jas` = `j`.`id_jas`)) left join `kemeja` `k` on(`b`.`id_kemeja` = `k`.`id_kemeja`)) left join `celana` `cl` on(`b`.`id_celana` = `cl`.`id_celana`)) left join `changshan` `cs` on(`b`.`id_changshan` = `cs`.`id_changshan`)) left join `dasi` `d` on(`b`.`id_dasi` = `d`.`id_dasi`)) left join `vest` `v` on(`b`.`id_vest` = `v`.`id_vest`)) left join `tuxedo` `t` on(`b`.`id_tuxedo` = `t`.`id_tuxedo`)) ;

-- --------------------------------------------------------

--
-- Structure for view `product_stock`
--
DROP TABLE IF EXISTS `product_stock`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `product_stock`  AS SELECT 'Jas' AS `kategori`, `jas`.`name_jas` AS `nama`, `jas`.`size_jas` AS `ukuran`, `jas`.`stock_jas` AS `stok` FROM `jas`union all select 'Kemeja' AS `Kemeja`,`kemeja`.`name_kemeja` AS `name_kemeja`,`kemeja`.`size_kemeja` AS `size_kemeja`,`kemeja`.`stock_kemeja` AS `stock_kemeja` from `kemeja` union all select 'Celana' AS `Celana`,`celana`.`name_celana` AS `name_celana`,`celana`.`size_celana` AS `size_celana`,`celana`.`stock_celana` AS `stock_celana` from `celana` union all select 'Vest' AS `Vest`,`vest`.`name_vest` AS `name_vest`,`vest`.`size_vest` AS `size_vest`,`vest`.`stock_vest` AS `stock_vest` from `vest` union all select 'Tuxedo' AS `Tuxedo`,`tuxedo`.`name_tuxedo` AS `name_tuxedo`,`tuxedo`.`size_tuxedo` AS `size_tuxedo`,`tuxedo`.`stock_tuxedo` AS `stock_tuxedo` from `tuxedo` union all select 'Changshan' AS `Changshan`,`changshan`.`name_changshan` AS `name_changshan`,`changshan`.`size_changshan` AS `size_changshan`,`changshan`.`stock_changshan` AS `stock_changshan` from `changshan`  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `booked`
--
ALTER TABLE `booked`
  ADD PRIMARY KEY (`id_booked`),
  ADD KEY `id_jas` (`id_jas`),
  ADD KEY `id_kemeja` (`id_kemeja`),
  ADD KEY `id_celana` (`id_celana`),
  ADD KEY `id_changshan` (`id_changshan`),
  ADD KEY `id_vest` (`id_vest`),
  ADD KEY `id_tuxedo` (`id_tuxedo`),
  ADD KEY `id_dasi` (`id_dasi`);

--
-- Indexes for table `celana`
--
ALTER TABLE `celana`
  ADD PRIMARY KEY (`id_celana`);

--
-- Indexes for table `changshan`
--
ALTER TABLE `changshan`
  ADD PRIMARY KEY (`id_changshan`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id_customer`),
  ADD UNIQUE KEY `customer_phone` (`customer_phone`);

--
-- Indexes for table `dasi`
--
ALTER TABLE `dasi`
  ADD PRIMARY KEY (`id_dasi`);

--
-- Indexes for table `history_orders`
--
ALTER TABLE `history_orders`
  ADD PRIMARY KEY (`id_history`);

--
-- Indexes for table `jas`
--
ALTER TABLE `jas`
  ADD PRIMARY KEY (`id_jas`);

--
-- Indexes for table `kemeja`
--
ALTER TABLE `kemeja`
  ADD PRIMARY KEY (`id_kemeja`);

--
-- Indexes for table `laundry`
--
ALTER TABLE `laundry`
  ADD PRIMARY KEY (`id_laundry`),
  ADD KEY `id_jas` (`id_jas`),
  ADD KEY `id_kemeja` (`id_kemeja`),
  ADD KEY `id_celana` (`id_celana`),
  ADD KEY `id_vest` (`id_vest`),
  ADD KEY `id_tuxedo` (`id_tuxedo`),
  ADD KEY `id_changshan` (`id_changshan`),
  ADD KEY `id_dasi` (`id_dasi`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`id_marks`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id_note`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `id_customer` (`id_customer`),
  ADD KEY `id_package` (`id_package`),
  ADD KEY `id_booked` (`id_booked`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id_package`);

--
-- Indexes for table `tuxedo`
--
ALTER TABLE `tuxedo`
  ADD PRIMARY KEY (`id_tuxedo`);

--
-- Indexes for table `vest`
--
ALTER TABLE `vest`
  ADD PRIMARY KEY (`id_vest`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `booked`
--
ALTER TABLE `booked`
  MODIFY `id_booked` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `celana`
--
ALTER TABLE `celana`
  MODIFY `id_celana` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `changshan`
--
ALTER TABLE `changshan`
  MODIFY `id_changshan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id_customer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dasi`
--
ALTER TABLE `dasi`
  MODIFY `id_dasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `history_orders`
--
ALTER TABLE `history_orders`
  MODIFY `id_history` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jas`
--
ALTER TABLE `jas`
  MODIFY `id_jas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kemeja`
--
ALTER TABLE `kemeja`
  MODIFY `id_kemeja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `laundry`
--
ALTER TABLE `laundry`
  MODIFY `id_laundry` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `marks`
--
ALTER TABLE `marks`
  MODIFY `id_marks` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id_note` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id_package` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tuxedo`
--
ALTER TABLE `tuxedo`
  MODIFY `id_tuxedo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vest`
--
ALTER TABLE `vest`
  MODIFY `id_vest` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booked`
--
ALTER TABLE `booked`
  ADD CONSTRAINT `booked_ibfk_1` FOREIGN KEY (`id_jas`) REFERENCES `jas` (`id_jas`),
  ADD CONSTRAINT `booked_ibfk_2` FOREIGN KEY (`id_kemeja`) REFERENCES `kemeja` (`id_kemeja`),
  ADD CONSTRAINT `booked_ibfk_3` FOREIGN KEY (`id_celana`) REFERENCES `celana` (`id_celana`),
  ADD CONSTRAINT `booked_ibfk_4` FOREIGN KEY (`id_changshan`) REFERENCES `changshan` (`id_changshan`),
  ADD CONSTRAINT `booked_ibfk_5` FOREIGN KEY (`id_vest`) REFERENCES `vest` (`id_vest`),
  ADD CONSTRAINT `booked_ibfk_6` FOREIGN KEY (`id_tuxedo`) REFERENCES `tuxedo` (`id_tuxedo`),
  ADD CONSTRAINT `booked_ibfk_7` FOREIGN KEY (`id_dasi`) REFERENCES `dasi` (`id_dasi`);

--
-- Constraints for table `laundry`
--
ALTER TABLE `laundry`
  ADD CONSTRAINT `laundry_ibfk_1` FOREIGN KEY (`id_jas`) REFERENCES `jas` (`id_jas`),
  ADD CONSTRAINT `laundry_ibfk_2` FOREIGN KEY (`id_kemeja`) REFERENCES `kemeja` (`id_kemeja`),
  ADD CONSTRAINT `laundry_ibfk_3` FOREIGN KEY (`id_celana`) REFERENCES `celana` (`id_celana`),
  ADD CONSTRAINT `laundry_ibfk_4` FOREIGN KEY (`id_vest`) REFERENCES `vest` (`id_vest`),
  ADD CONSTRAINT `laundry_ibfk_5` FOREIGN KEY (`id_tuxedo`) REFERENCES `tuxedo` (`id_tuxedo`),
  ADD CONSTRAINT `laundry_ibfk_6` FOREIGN KEY (`id_changshan`) REFERENCES `changshan` (`id_changshan`),
  ADD CONSTRAINT `laundry_ibfk_7` FOREIGN KEY (`id_dasi`) REFERENCES `dasi` (`id_dasi`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id_customer`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`id_package`) REFERENCES `packages` (`id_package`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`id_booked`) REFERENCES `booked` (`id_booked`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
