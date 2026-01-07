CREATE DATABASE IF NOT EXISTS suitpalace_db_serpong;
USE suitpalace_db_serpong;

-- 1. Master
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
    discount DECIMAL(5,2) DEFAULT 0 -- NANTI DIKALI DENGAN PACKAGE PRICE(packages) UNTUK DISCOUNT
);
CREATE TABLE packages (
    id_package INT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,
    package_price DECIMAL(10,2) NOT NULL,
    duration_day INT NOT NULL,
    deposit DECIMAL(10,2) NOT NULL,
    penalty_fee DECIMAL(10,2) NOT NULL
);

-- 2. Utility
CREATE TABLE marks(
    id_marks INT PRIMARY KEY AUTO_INCREMENT,
    color_mark VARCHAR(20),
    note_mark TEXT,
    date_mark DATETIME NOT NULL
);
CREATE TABLE notes(
    id_note INT PRIMARY KEY AUTO_INCREMENT,
    title_note VARCHAR(100),
    description_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Product
CREATE TABLE jas(
    id_jas INT PRIMARY KEY AUTO_INCREMENT,
    name_jas VARCHAR(100) NOT NULL,
    size_jas VARCHAR(10) NOT NULL,
    color_jas VARCHAR(15) NOT NULL,
    stock_jas INT DEFAULT 0,
    condition_jas VARCHAR(50) NOT NULL
);
CREATE TABLE kemeja(
    id_kemeja INT PRIMARY KEY AUTO_INCREMENT,
    name_kemeja VARCHAR(100) NOT NULL,
    size_kemeja VARCHAR(10) NOT NULL,
    color_kemeja VARCHAR(15) NOT NULL,
    stock_kemeja INT DEFAULT 0,
    condition_kemeja VARCHAR(50) NOT NULL
);
CREATE TABLE celana(
    id_celana INT PRIMARY KEY AUTO_INCREMENT,
    name_celana VARCHAR(100) NOT NULL,
    size_celana VARCHAR(10) NOT NULL,
    color_celana VARCHAR(15) NOT NULL,
    stock_celana INT DEFAULT 0,
    condition_celana VARCHAR(50) NOT NULL
);
CREATE TABLE changshan(
    id_changshan INT PRIMARY KEY AUTO_INCREMENT,
    name_changshan VARCHAR(100) NOT NULL,
    size_changshan VARCHAR(10) NOT NULL,
    color_changshan VARCHAR(15) NOT NULL,
    stock_changshan INT DEFAULT 0,
    condition_changshan VARCHAR(50) NOT NULL
);
CREATE TABLE dasi(
    id_dasi INT PRIMARY KEY AUTO_INCREMENT,
    kode_dasi VARCHAR(10) NOT NULL,
    color_dasi VARCHAR(15) NOT NULL,
    stock_dasi INT DEFAULT 0,
    description_dasi VARCHAR(100) NOT NULL
);


-- 4. Transaction
CREATE TABLE booked(
    id_booked INT PRIMARY KEY AUTO_INCREMENT,
    id_jas INT NULL,
    id_kemeja INT NULL,
    id_celana INT NULL,
    id_changshan INT NULL,
    id_dasi INT NULL,
    FOREIGN KEY (id_jas) REFERENCES jas(id_jas),
    FOREIGN KEY (id_kemeja) REFERENCES kemeja(id_kemeja),
    FOREIGN KEY (id_celana) REFERENCES celana(id_celana),
    FOREIGN KEY (id_changshan) REFERENCES changshan(id_changshan),
    FOREIGN KEY (id_dasi) REFERENCES dasi(id_dasi)
);
CREATE TABLE order_items(
    id_order INT PRIMARY KEY AUTO_INCREMENT,
    id_customer INT,
    id_package INT,
    id_booked INT,
    start_dates DATE NOT NULL,
    end_dates DATE NOT NULL,
    actual_return_date DATETIME NULL,
    total_price DECIMAL(10,2),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    status_rent ENUM('Booked', 'Diambil', 'Dikembalikan', 'Cancel') DEFAULT 'Booked',
    status_order ENUM('Belum Selesai', 'Sudah Selesai') DEFAULT 'Belum Selesai',
    description_rent TEXT,
    FOREIGN KEY (id_customer) REFERENCES customers(id_customer),
    FOREIGN KEY (id_package) REFERENCES packages(id_package),
    FOREIGN KEY (id_booked) REFERENCES booked(id_booked)
);

CREATE TABLE history_orders(
    id_history INT PRIMARY KEY AUTO_INCREMENT,
    id_order INT,
    omset_order DECIMAL(10,2),
    condition_return VARCHAR(100),
    FOREIGN KEY (id_order) REFERENCES order_items(id_order)
);



-- -- Trigger 
-- CREATE TRIGGER after_payment_finish
-- CREATE TRIGGER reduce_stock_after_order
-- CREATE TRIGGER restore_stock_after_return

-- -- Views
-- CREATE VIEW history_view AS
-- CREATE VIEW customer_booked_items AS
-- CREATE VIEW product_stock AS


-- ====================================================
-- ====================================================
-- -- Cek Overdue
-- SELECT id_order, customer_name, end_date, status_rent 
-- FROM order_items JOIN customers USING(id_customer)
-- WHERE CURDATE() > end_date 
-- AND status_rent = 'Diambil';

-- -- Tukar Ukuran
-- UPDATE booked 
-- SET id_kemeja = 2 
-- WHERE id_order = 1 AND id_kemeja = 1;

-- --Update status order menjadi selesai (langsung masuk history)
-- UPDATE order_items 
-- SET 
--     actual_return_date = NOW(), 
--     status_rent = 'Dikembalikan',
--     status_payment = 'Sudah Selesai',
--     penalty_fee = 50000, -- Jika ada denda (misal 50rb)
--     description_rent = 'Kancing Jas aman, dikembalikan tepat waktu'
-- WHERE id_order = 1;


