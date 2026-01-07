CREATE DATABASE IF NOT EXISTS suitpalace_db_serpong;
USE suitpalace_db_serpong;

-- 1. Tabel Master
CREATE TABLE admins (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
);
CREATE TABLE customers (
    id_customer INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) UNIQUE NOT NULL,
    bank_account VARCHAR(100),
    discount DECIMAL(5,2) DEFAULT 0
);
CREATE TABLE packages (
    id_package INT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,
    package_price DECIMAL(10,2) NOT NULL,
);

CREATE TABLE marks(
    id_marks INT PRIMARY KEY AUTO_INCREMENT,
    color_mark VARCHAR(20),
    note_mark TEXT,
    date_mark DATETIME
);




-- 2. Tabel Transaksi
CREATE TABLE order_items (
    id_order INT PRIMARY KEY AUTO_INCREMENT,
    id_customer INT,
    id_package INT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_return_date DATETIME NULL,
    total_price DECIMAL(10,2),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    deposit DECIMAL(10,2) DEFAULT 0,
    penalty_fee DECIMAL(10,2) DEFAULT 0,
    status_rent ENUM('Booked', 'Diambil', 'Dikembalikan', 'Cancel') DEFAULT 'Booked',
    status_order ENUM('Belum Selesai', 'Sudah Selesai') DEFAULT 'Belum Selesai',
    description_rent TEXT,
    FOREIGN KEY (id_customer) REFERENCES customers(id_customer),
    FOREIGN KEY (id_package) REFERENCES packages(id_package)
);


-- Utilitas
CREATE TABLE marks (
    id_mark INT PRIMARY KEY AUTO_INCREMENT,
    id_order INT,
    color_mark VARCHAR(20),
    note_mark TEXT,
    FOREIGN KEY (id_order) REFERENCES order_items(id_order)
);
CREATE TABLE notes (
    id_note INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    note_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- Trigger 
CREATE TRIGGER after_payment_finish
CREATE TRIGGER reduce_stock_after_order
CREATE TRIGGER restore_stock_after_return

-- Views
CREATE VIEW history_view AS
CREATE VIEW customer_booked_items AS
CREATE VIEW product_stock AS


====================================================
====================================================
-- Cek Overdue
SELECT id_order, customer_name, end_date, status_rent 
FROM order_items JOIN customers USING(id_customer)
WHERE CURDATE() > end_date 
AND status_rent = 'Diambil';

-- Tukar Ukuran
UPDATE booked 
SET id_kemeja = 2 
WHERE id_order = 1 AND id_kemeja = 1;

--Update status order menjadi selesai (langsung masuk history)
UPDATE order_items 
SET 
    actual_return_date = NOW(), 
    status_rent = 'Dikembalikan',
    status_payment = 'Sudah Selesai',
    penalty_fee = 50000, -- Jika ada denda (misal 50rb)
    description_rent = 'Kancing Jas aman, dikembalikan tepat waktu'
WHERE id_order = 1;


