CREATE DATABASE IF NOT EXISTS suitpalace_db_serpong;
USE suitpalace_db_serpong;

-- ======================================================
-- 1. MASTER TABLES
-- ======================================================

CREATE TABLE admins (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE customers (
    id_customer INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) UNIQUE NOT NULL,
    bank_account VARCHAR(100),
    discount DECIMAL(5,2) DEFAULT 0,
    penalty_fee DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE packages (
    id_package INT PRIMARY KEY AUTO_INCREMENT,
    package_name VARCHAR(100) NOT NULL,
    package_price DECIMAL(10,2) NOT NULL,
    duration_day INT NOT NULL,
    deposit DECIMAL(10,2) NOT NULL,
    penalty_fee DECIMAL(10,2) NOT NULL
);

-- ======================================================
-- 2. UTILITY TABLES
-- ======================================================

CREATE TABLE marks (
    id_marks INT PRIMARY KEY AUTO_INCREMENT,
    color_mark VARCHAR(20),
    note_mark TEXT,
    date_mark DATETIME NOT NULL
);

CREATE TABLE notes (
    id_note INT PRIMARY KEY AUTO_INCREMENT,
    title_note VARCHAR(100),
    description_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- 3. PRODUCT TABLES
-- ======================================================

CREATE TABLE jas (
    id_jas INT PRIMARY KEY AUTO_INCREMENT,
    name_jas VARCHAR(100) NOT NULL,
    size_jas VARCHAR(10) NOT NULL,
    color_jas VARCHAR(15) NOT NULL,
    stock_jas INT DEFAULT 0,
    condition_jas VARCHAR(50) NOT NULL
);

CREATE TABLE kemeja (
    id_kemeja INT PRIMARY KEY AUTO_INCREMENT,
    name_kemeja VARCHAR(100) NOT NULL,
    size_kemeja VARCHAR(10) NOT NULL,
    color_kemeja VARCHAR(15) NOT NULL,
    stock_kemeja INT DEFAULT 0,
    condition_kemeja VARCHAR(50) NOT NULL
);

CREATE TABLE celana (
    id_celana INT PRIMARY KEY AUTO_INCREMENT,
    name_celana VARCHAR(100) NOT NULL,
    size_celana VARCHAR(10) NOT NULL,
    color_celana VARCHAR(15) NOT NULL,
    stock_celana INT DEFAULT 0,
    condition_celana VARCHAR(50) NOT NULL
);

CREATE TABLE vest (
    id_vest INT PRIMARY KEY AUTO_INCREMENT,
    name_vest VARCHAR(100) NOT NULL,
    size_vest VARCHAR(10) NOT NULL,
    color_vest VARCHAR(15) NOT NULL,
    stock_vest INT DEFAULT 0,
    condition_vest VARCHAR(50) NOT NULL
);

CREATE TABLE tuxedo (
    id_tuxedo INT PRIMARY KEY AUTO_INCREMENT,
    name_tuxedo VARCHAR(100) NOT NULL,
    size_tuxedo VARCHAR(10) NOT NULL,
    color_tuxedo VARCHAR(15) NOT NULL,
    stock_tuxedo INT DEFAULT 0,
    condition_tuxedo VARCHAR(50) NOT NULL
);

CREATE TABLE changshan (
    id_changshan INT PRIMARY KEY AUTO_INCREMENT,
    name_changshan VARCHAR(100) NOT NULL,
    size_changshan VARCHAR(10) NOT NULL,
    color_changshan VARCHAR(15) NOT NULL,
    stock_changshan INT DEFAULT 0,
    condition_changshan VARCHAR(50) NOT NULL
);

CREATE TABLE dasi (
    id_dasi INT PRIMARY KEY AUTO_INCREMENT,
    kode_dasi VARCHAR(10) NOT NULL,
    color_dasi VARCHAR(15) NOT NULL,
    stock_dasi INT DEFAULT 0,
    description_dasi VARCHAR(100) NOT NULL
);

-- ======================================================
-- 4. TRANSACTION TABLES
-- ======================================================

CREATE TABLE booked (
    id_booked INT PRIMARY KEY AUTO_INCREMENT,
    id_jas INT NULL,
    id_kemeja INT NULL,
    id_celana INT NULL,
    id_changshan INT NULL,
    id_dasi INT NULL,
    id_vest INT NULL,
    id_tuxedo INT NULL,
    FOREIGN KEY (id_jas) REFERENCES jas(id_jas),
    FOREIGN KEY (id_kemeja) REFERENCES kemeja(id_kemeja),
    FOREIGN KEY (id_celana) REFERENCES celana(id_celana),
    FOREIGN KEY (id_changshan) REFERENCES changshan(id_changshan),
    FOREIGN KEY (id_vest) REFERENCES vest(id_vest),
    FOREIGN KEY (id_tuxedo) REFERENCES tuxedo(id_tuxedo),
    FOREIGN KEY (id_dasi) REFERENCES dasi(id_dasi)
);

CREATE TABLE order_items (
    id_order INT PRIMARY KEY AUTO_INCREMENT,
    id_customer INT,
    id_package INT,
    id_booked INT,
    start_dates DATE NOT NULL,
    end_dates DATE NOT NULL,
    actual_return_date DATETIME NULL,
    total_price DECIMAL(10,2),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    penalty_paid DECIMAL(10,2) DEFAULT 0,
    status_rent ENUM('Booked', 'Diambil', 'Dikembalikan', 'Cancel') DEFAULT 'Booked',
    status_order ENUM('Belum Selesai', 'Sudah Selesai') DEFAULT 'Belum Selesai',
    condition_return TEXT,
    FOREIGN KEY (id_customer) REFERENCES customers(id_customer),
    FOREIGN KEY (id_package) REFERENCES packages(id_package),
    FOREIGN KEY (id_booked) REFERENCES booked(id_booked)
);

CREATE TABLE history_orders (
    id_history INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    package_name VARCHAR(100),
    omset_order DECIMAL(10,2),
    denda_paid DECIMAL(10,2) DEFAULT 0, 
    return_date DATETIME,               
    condition_return TEXT
);

-- ======================================================
-- 5. TRIGGERS
-- ======================================================
DELIMITER //

-- Trigger 1: Kurangi Stok saat status menjadi 'Diambil'
CREATE TRIGGER reduce_stock_after_order
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    IF NEW.status_rent = 'Diambil' AND OLD.status_rent = 'Booked' THEN
        SELECT id_jas, id_kemeja, id_celana, id_changshan, id_dasi, id_vest, id_tuxedo 
        INTO @j, @k, @c, @ch, @d, @v, @t 
        FROM booked WHERE id_booked = NEW.id_booked;

        IF @j IS NOT NULL THEN UPDATE jas SET stock_jas = stock_jas - 1 WHERE id_jas = @j; END IF;
        IF @k IS NOT NULL THEN UPDATE kemeja SET stock_kemeja = stock_kemeja - 1 WHERE id_kemeja = @k; END IF;
        IF @c IS NOT NULL THEN UPDATE celana SET stock_celana = stock_celana - 1 WHERE id_celana = @c; END IF;
        IF @ch IS NOT NULL THEN UPDATE changshan SET stock_changshan = stock_changshan - 1 WHERE id_changshan = @ch; END IF;
        IF @d IS NOT NULL THEN UPDATE dasi SET stock_dasi = stock_dasi - 1 WHERE id_dasi = @d; END IF;
        IF @v IS NOT NULL THEN UPDATE vest SET stock_vest = stock_vest - 1 WHERE id_vest = @v; END IF;
        IF @t IS NOT NULL THEN UPDATE tuxedo SET stock_tuxedo = stock_tuxedo - 1 WHERE id_tuxedo = @t; END IF;
    END IF;
END //

-- Trigger 2: Kembalikan Stok saat status menjadi 'Dikembalikan' atau 'Cancel'
CREATE TRIGGER restore_stock_after_return
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    IF (NEW.status_rent = 'Dikembalikan' AND OLD.status_rent = 'Diambil') 
        OR (NEW.status_rent = 'Cancel' AND OLD.status_rent = 'Booked') THEN
        
        SELECT id_jas, id_kemeja, id_celana, id_changshan, id_dasi, id_vest, id_tuxedo 
        INTO @j, @k, @c, @ch, @d, @v, @t 
        FROM booked WHERE id_booked = NEW.id_booked;

        IF @j IS NOT NULL THEN UPDATE jas SET stock_jas = stock_jas + 1 WHERE id_jas = @j; END IF;
        IF @k IS NOT NULL THEN UPDATE kemeja SET stock_kemeja = stock_kemeja + 1 WHERE id_kemeja = @k; END IF;
        IF @c IS NOT NULL THEN UPDATE celana SET stock_celana = stock_celana + 1 WHERE id_celana = @c; END IF;
        IF @ch IS NOT NULL THEN UPDATE changshan SET stock_changshan = stock_changshan + 1 WHERE id_changshan = @ch; END IF;
        IF @d IS NOT NULL THEN UPDATE dasi SET stock_dasi = stock_dasi + 1 WHERE id_dasi = @d; END IF;
        IF @v IS NOT NULL THEN UPDATE vest SET stock_vest = stock_vest + 1 WHERE id_vest = @v; END IF;
        IF @t IS NOT NULL THEN UPDATE tuxedo SET stock_tuxedo = stock_tuxedo + 1 WHERE id_tuxedo = @t; END IF;
    END IF;
END //

-- Trigger 3: Masuk History saat status_order 'Sudah Selesai'
CREATE TRIGGER after_payment_finish
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    DECLARE cust_name VARCHAR(100);
    DECLARE discount_val DECIMAL(5,2);
    DECLARE pkg_name VARCHAR(100);
    DECLARE omset_murni DECIMAL(10,2);

    -- Trigger hanya jalan jika status berubah menjadi 'Sudah Selesai'
    IF NEW.status_order = 'Sudah Selesai' AND OLD.status_order = 'Belum Selesai' THEN
        
        -- 1. Ambil Nama Customer, Discount, Nama Paket & Deposit
        SELECT customer_name, discount INTO cust_name, discount_val FROM customers WHERE id_customer = NEW.id_customer;
        SELECT package_name INTO pkg_name FROM packages WHERE id_package = NEW.id_package;
        
        -- 2. Hitung Omset Bersih (Murni Harga Sewa)
        -- Rumus: Harga Paket - (Harga Paket * discount / 100)
        -- NEW.total_price menyimpan Harga Paket (Rental Fee) saat transaksi dibuat
        IF NEW.status_rent = 'Cancel' THEN
            SET omset_murni = 0;
        ELSE
            SET omset_murni = (NEW.total_price - (NEW.total_price * IFNULL(discount_val, 0) / 100));
        END IF;

        -- 4. Masukkan ke history_orders
        -- denda_paid berdiri sendiri sesuai keinginan Anda
        INSERT INTO history_orders (
            customer_name, 
            package_name, 
            omset_order, 
            denda_paid, 
            return_date, 
            condition_return
        )
        VALUES (
            cust_name, 
            pkg_name, 
            omset_murni, 
            NEW.penalty_paid, 
            NEW.actual_return_date, 
            NEW.condition_return
        );
    END IF;
END //
DELIMITER ;


-- ======================================================
-- 6. VIEWS
-- ======================================================

-- View Detail Order (Perbaikan koma pada JOIN)
CREATE VIEW customer_order AS
SELECT 
    o.id_order,
    c.customer_name,
    c.customer_phone,
    p.package_name,
    o.total_price,
    o.amount_paid,
    CONCAT_WS(' + ', 
        j.name_jas, 
        k.name_kemeja, 
        cl.name_celana, 
        cs.name_changshan, 
        IF(d.kode_dasi IS NOT NULL, CONCAT('Dasi: ', d.kode_dasi), NULL),
        v.name_vest,
        t.name_tuxedo
    ) AS items_bundle,
    o.start_dates,
    o.end_dates,
    DATEDIFF(o.end_dates, o.start_dates) AS durasi_hari,
    o.status_rent
FROM order_items o
JOIN customers c ON o.id_customer = c.id_customer
JOIN packages p ON o.id_package = p.id_package
JOIN booked b ON o.id_booked = b.id_booked
LEFT JOIN jas j ON b.id_jas = j.id_jas
LEFT JOIN kemeja k ON b.id_kemeja = k.id_kemeja
LEFT JOIN celana cl ON b.id_celana = cl.id_celana
LEFT JOIN changshan cs ON b.id_changshan = cs.id_changshan
LEFT JOIN dasi d ON b.id_dasi = d.id_dasi
LEFT JOIN vest v ON b.id_vest = v.id_vest
LEFT JOIN tuxedo t ON b.id_tuxedo = t.id_tuxedo;

-- View Rekap Stok (Menambahkan Vest dan Tuxedo)
CREATE VIEW product_stock AS
SELECT 'Jas' as kategori, name_jas as nama, size_jas as ukuran, stock_jas as stok FROM jas
UNION ALL
SELECT 'Kemeja', name_kemeja, size_kemeja, stock_kemeja FROM kemeja
UNION ALL
SELECT 'Celana', name_celana, size_celana, stock_celana FROM celana
UNION ALL
SELECT 'Vest', name_vest, size_vest, stock_vest FROM vest
UNION ALL
SELECT 'Tuxedo', name_tuxedo, size_tuxedo, stock_tuxedo FROM tuxedo
UNION ALL
SELECT 'Changshan', name_changshan, size_changshan, stock_changshan FROM changshan;




--=================================================================
--====================INSERT DATA CONTOH===========================
-- INSERT customers
INSERT INTO customers (customer_name, customer_phone, bank_account, discount) VALUES
('Titus Ericson', '081234567890', 'BCA - 12345678', 5.00),
('Nabil Wijaya', '081234567891', 'Mandiri - 87654321', 0.00),
('Muhandis Azmi', '081234567892', 'BNI - 11223344', 10.00);

-- INSERT packages
INSERT INTO `packages` (`package_name`, `package_price`, `duration_day`, `deposit`, `penalty_fee`) VALUES
('1 Set of Suit + Pants (3 hari)', 350000.00, 3, 700000.00, 70000.00),
('1 Set of Suit + Pants (4 hari)', 400000.00, 4, 700000.00, 70000.00),
('1 Set of Suit + Pants (7 hari)', 500000.00, 7, 700000.00, 70000.00),
('1 Set of Suit + Pants + Vest (3 hari)', 425000.00, 3, 900000.00, 90000.00),
('1 Set of Suit + Pants + Shirt (4 hari)', 425000.00, 3, 875000.00, 90000.00),
('1 Set of Suit + Pants + Vest (4 hari)', 500000.00, 4, 900000.00, 90000.00),
('1 Set of Suit + Pants + Shirt (4 hari)', 500000.00, 4, 875000.00, 90000.00),
('1 Set of Suit + Pants + Vest (7 hari)', 625000.00, 7, 875000.00, 90000.00),
('1 Set of Suit + Pants + Shirt (7 hari)', 625000.00, 7, 875000.00, 90000.00);

-- INSERT marks
INSERT INTO marks (color_mark, note_mark, date_mark) VALUES
('#1de25f', 'Perlu dicuci ulang', '2026-01-10'),
('#1d79e2ff', 'Kancing kendur', '2026-01-11'),
('#35a85bff', 'Siap pakai', '2026-01-12');
-- INSERT notes
INSERT INTO notes (title_note, description_note) VALUES
('Stok Baru', 'Penambahan 10 jas warna navy'),
('Jadwal Laundry', 'Vendor laundry ambil hari Senin');

-- INSERT jas
INSERT INTO jas (name_jas, size_jas, color_jas, stock_jas, condition_jas) VALUES
('Slim Fit Tuxedo', 'M', 'Hitam', 5, 'Bagus'), ('Classic Formal', 'L', 'Navy', 3, 'Bagus'),
('Wool Blazer', 'XL', 'Abu-abu', 2, 'Bagus'), ('Double Breasted', 'S', 'Hitam', 4, 'Bagus'),
('Modern Wedding', 'M', 'Putih', 3, 'Bagus'), ('Casual Linen', 'L', 'Khaki', 6, 'Bagus'),
('Vintage Brown', 'XL', 'Cokelat', 2, 'Bagus'), ('Maroon Elegance', 'M', 'Maroon', 3, 'Bagus'),
('Royal Blue', 'L', 'Biru', 4, 'Bagus'), ('Jet Black', 'XXL', 'Hitam', 2, 'Bagus');
-- INSERT kemeja
INSERT INTO kemeja (name_kemeja, size_kemeja, color_kemeja, stock_kemeja, condition_kemeja) VALUES
('White Oxford', 'M', 'Putih', 10, 'Bagus'), ('Blue Striped', 'L', 'Biru', 8, 'Bagus'),
('Black Satin', 'XL', 'Hitam', 5, 'Bagus'), ('Light Pink', 'S', 'Pink', 4, 'Bagus'),
('Grey Formal', 'M', 'Abu-abu', 7, 'Bagus'), ('Navy Cotton', 'L', 'Navy', 6, 'Bagus'),
('Ivory Silk', 'M', 'Cream', 3, 'Bagus'), ('Dark Green', 'XL', 'Hijau', 2, 'Bagus'),
('Spread Collar', 'M', 'Putih', 9, 'Bagus'), ('Slim Fit Blue', 'S', 'Biru Muda', 5, 'Bagus');
-- INSERT celana
INSERT INTO celana (name_celana, size_celana, color_celana, stock_celana, condition_celana) VALUES
('Formal Black', '32', 'Hitam', 8, 'Bagus'), ('Navy Chinos', '34', 'Navy', 6, 'Bagus'),
('Grey Slacks', '36', 'Abu-abu', 5, 'Bagus'), ('Slim Khaki', '30', 'Khaki', 4, 'Bagus'),
('White Trousers', '32', 'Putih', 3, 'Bagus'), ('Dark Brown', '34', 'Cokelat', 5, 'Bagus'),
('Charcoal Pants', '36', 'Arang', 4, 'Bagus'), ('Deep Blue', '32', 'Biru Tua', 6, 'Bagus'),
('Wool Pants', '38', 'Hitam', 2, 'Bagus'), ('Corduroy Brown', '34', 'Cokelat', 3, 'Bagus');
-- INSERT changshan
INSERT INTO changshan (name_changshan, size_changshan, color_changshan, stock_changshan, condition_changshan) VALUES
('Dragon Embroidered', 'M', 'Merah', 3, 'Bagus'), ('Silk Gold', 'L', 'Emas', 2, 'Bagus'),
('Classic Black', 'XL', 'Hitam', 4, 'Bagus'), ('Modern Blue', 'S', 'Biru', 3, 'Bagus'),
('White Crane', 'M', 'Putih', 2, 'Bagus'), ('Lucky Red', 'L', 'Merah', 5, 'Bagus'),
('Imperial Yellow', 'XL', 'Kuning', 1, 'Bagus'), ('Bamboo Green', 'M', 'Hijau', 2, 'Bagus'),
('Silver Phoenix', 'S', 'Perak', 3, 'Bagus'), ('Dark Maroon', 'L', 'Maroon', 4, 'Bagus');
-- INSERT dasi
INSERT INTO dasi (kode_dasi, color_dasi, stock_dasi, description_dasi) VALUES
('D-001', 'Merah', 10, 'Dasi sutra polos'), ('D-002', 'Hitam', 15, 'Dasi formal hitam'),
('D-003', 'Navy', 12, 'Dasi motif garis'), ('D-004', 'Emas', 5, 'Dasi pesta mewah'),
('D-005', 'Hijau', 8, 'Dasi satin hijau'), ('D-006', 'Silver', 7, 'Dasi pernikahan'),
('D-007', 'Polkadot', 6, 'Dasi biru polkadot'), ('D-008', 'Cokelat', 4, 'Dasi rajut casual'),
('D-009', 'Ungu', 5, 'Dasi ungu lavender'), ('D-010', 'Batik', 10, 'Dasi motif batik');
-- INSERT vest
INSERT INTO vest (name_vest, size_vest, color_vest, stock_vest, condition_vest) VALUES
('Classic Black Vest', 'M', 'Hitam', 5, 'Bagus'), ('Navy Blue Vest', 'L', 'Navy', 4, 'Bagus'),
('Grey Formal Vest', 'XL', 'Abu-abu', 3, 'Bagus'), ('Brown Casual Vest', 'S', 'Cokelat', 6, 'Bagus'),
('White Dress Vest', 'M', 'Putih', 2, 'Bagus'), ('Charcoal Vest', 'L', 'Arang', 4, 'Bagus'),
('Beige Linen Vest', 'M', 'Beige', 5, 'Bagus'), ('Dark Green Vest', 'XL', 'Hijau Tua', 3, 'Bagus'),
('Maroon Velvet Vest', 'M', 'Maroon', 2, 'Bagus'), ('Light Blue Vest', 'S', 'Biru Muda', 4, 'Bagus');
-- INSERT tuxedo
INSERT INTO tuxedo (name_tuxedo, size_tuxedo, color_tuxedo, stock_tuxedo, condition_tuxedo) VALUES
('Classic Black Tuxedo', 'M', 'Hitam', 3, 'Bagus'), ('Navy Blue Tuxedo', 'L', 'Navy', 2, 'Bagus'),
('Grey Formal Tuxedo', 'XL', 'Abu-abu', 4, 'Bagus'), ('Brown Casual Tuxedo', 'S', 'Cokelat', 5, 'Bagus'),
('White Dress Tuxedo', 'M', 'Putih', 2, 'Bagus'), ('Charcoal Tuxedo', 'L', 'Arang', 3, 'Bagus'),
('Beige Linen Tuxedo', 'M', 'Beige', 4, 'Bagus'), ('Dark Green Tuxedo', 'XL', 'Hijau Tua', 2, 'Bagus');
-- INSERT booked (Menghubungkan item-item yang dipesan)
INSERT INTO booked (id_jas, id_kemeja, id_celana, id_changshan, id_dasi, id_vest, id_tuxedo) VALUES
(1, 1, 1, NULL, 2, 1, NULL), 
(2, 2, 2, NULL, 3, 2, NULL), 
(3, 3, 3, NULL, 1, 3, NULL);
-- INSERT ORDER ITEMS
INSERT INTO order_items (id_customer, id_package, id_booked, start_dates, end_dates, total_price, status_rent, status_order) VALUES
(1, 2, 1, '2026-01-06', '2026-01-08', 237500, 'Diambil', 'Belum Selesai'),
(2, 3, 2, '2026-01-07', '2026-01-10', 400000, 'Diambil', 'Belum Selesai'),
(3, 4, 3, '2026-01-21', '2026-01-23', 495000, 'Booked', 'Belum Selesai');
-- INSERT history_orders (Data dari order yang sudah 'Dikembalikan' atau 'Selesai')
INSERT INTO history_orders (customer_name, package_name, omset_order, condition_return) VALUES
('Budi Santoso', '1 Set of Suit + Pants (3 hari)', 0, 'CANCEL');