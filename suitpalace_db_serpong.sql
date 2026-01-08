CREATE DATABASE IF NOT EXISTS suitpalace_db_serpong;
USE suitpalace_db_serpong;

-- 1. Master
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
    penalty_paid DECIMAL(10,2) DEFAULT 0,
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


-- ======================================================
-- =====================TRIGER===========================
DELIMITER //
-- 1. Trigger: Kurangi Stok saat status menjadi 'Diambil'
CREATE TRIGGER reduce_stock_after_order
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    IF NEW.status_rent = 'Diambil' AND OLD.status_rent = 'Booked' THEN
        -- Ambil ID barang dari tabel booked
        SET @j = (SELECT id_jas FROM booked WHERE id_booked = NEW.id_booked);
        SET @k = (SELECT id_kemeja FROM booked WHERE id_booked = NEW.id_booked);
        SET @c = (SELECT id_celana FROM booked WHERE id_booked = NEW.id_booked);
        SET @ch = (SELECT id_changshan FROM booked WHERE id_booked = NEW.id_booked);
        SET @d = (SELECT id_dasi FROM booked WHERE id_booked = NEW.id_booked);
        -- Kurangi stok masing-masing jika tidak NULL
        IF @j IS NOT NULL THEN UPDATE jas SET stock_jas = stock_jas - 1 WHERE id_jas = @j; END IF;
        IF @k IS NOT NULL THEN UPDATE kemeja SET stock_kemeja = stock_kemeja - 1 WHERE id_kemeja = @k; END IF;
        IF @c IS NOT NULL THEN UPDATE celana SET stock_celana = stock_celana - 1 WHERE id_celana = @c; END IF;
        IF @ch IS NOT NULL THEN UPDATE changshan SET stock_changshan = stock_changshan - 1 WHERE id_changshan = @ch; END IF;
        IF @d IS NOT NULL THEN UPDATE dasi SET stock_dasi = stock_dasi - 1 WHERE id_dasi = @d; END IF;
    END IF;
END //
-- 2. Trigger: Kembalikan Stok saat status menjadi 'Dikembalikan' atau 'Cancel'
CREATE TRIGGER restore_stock_after_return
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    IF (NEW.status_rent = 'Dikembalikan' AND OLD.status_rent = 'Diambil') 
        OR (NEW.status_rent = 'Cancel' AND OLD.status_rent = 'Booked') THEN
        SET @j = (SELECT id_jas FROM booked WHERE id_booked = NEW.id_booked);
        SET @k = (SELECT id_kemeja FROM booked WHERE id_booked = NEW.id_booked);
        SET @c = (SELECT id_celana FROM booked WHERE id_booked = NEW.id_booked);
        SET @ch = (SELECT id_changshan FROM booked WHERE id_booked = NEW.id_booked);
        SET @d = (SELECT id_dasi FROM booked WHERE id_booked = NEW.id_booked);
        IF @j IS NOT NULL THEN UPDATE jas SET stock_jas = stock_jas + 1 WHERE id_jas = @j; END IF;
        IF @k IS NOT NULL THEN UPDATE kemeja SET stock_kemeja = stock_kemeja + 1 WHERE id_kemeja = @k; END IF;
        IF @c IS NOT NULL THEN UPDATE celana SET stock_celana = stock_celana + 1 WHERE id_celana = @c; END IF;
        IF @ch IS NOT NULL THEN UPDATE changshan SET stock_changshan = stock_changshan + 1 WHERE id_changshan = @ch; END IF;
        IF @d IS NOT NULL THEN UPDATE dasi SET stock_dasi = stock_dasi + 1 WHERE id_dasi = @d; END IF;
    END IF;
END //
-- 3. Trigger: Otomatis masuk History saat status_order menjadi 'Sudah Selesai' dengan perhitungan omset
CREATE OR REPLACE TRIGGER after_payment_finish
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
    IF NEW.status_order = 'Sudah Selesai' AND OLD.status_order = 'Belum Selesai' THEN
        -- Ambil nilai deposit dari master package untuk dikurangi dari total_price
        SET @deposit_amount = (SELECT deposit FROM packages WHERE id_package = NEW.id_package);
        
        -- Hitung Omset: (Harga yang dibayar termasuk deposit - deposit) + denda
        SET @omset_bersih = (NEW.total_price - @deposit_amount) + NEW.penalty_paid;

        INSERT INTO history_orders (id_order, omset_order, condition_return)
        VALUES (NEW.id_order, @omset_bersih, NEW.description_rent);
    END IF;
END //
DELIMITER ;


-- -- Misal: Customer telat/rusak barang, kena denda 50.000
-- UPDATE order_items 
-- SET 
--     actual_return_date = NOW(), 
--     status_rent = 'Dikembalikan',
--     penalty_paid = 50000, -- Mencatat denda
--     status_order = 'Sudah Selesai', -- Ini akan memicu trigger history_orders
--     description_rent = 'Jas kembali telat 1 hari, kancing lepas 1.'
-- WHERE id_order = 1;




-- =====================================================
-- ===================CREATE VIEWS======================
-- 1. View History Lengkap
CREATE VIEW history_view AS
SELECT 
    h.id_history,
    c.customer_name,
    p.package_name,
    h.omset_order AS pendapatan_bersih, -- Ini yang sudah dipotong deposit
    o.penalty_paid AS denda_diterima,
    o.actual_return_date,
    h.condition_return
FROM history_orders h
JOIN order_items o ON h.id_order = o.id_order
JOIN customers c ON o.id_customer = c.id_customer
JOIN packages p ON o.id_package = p.id_package;

-- 2. View Detail Barang yang di-book Customer
CREATE VIEW customer_order AS
SELECT 
    o.id_order,
    c.customer_name,
    c.customer_phone,
    p.package_name,
    o.total_price,
    o.amount_paid,
    CONCAT_WS(' + ', 
        IFNULL(j.name_jas, NULL), 
        IFNULL(k.name_kemeja, NULL), 
        IFNULL(cl.name_celana, NULL), 
        IFNULL(cs.name_changshan, NULL), 
        IFNULL(CONCAT('Dasi: ', d.kode_dasi), NULL)
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
LEFT JOIN dasi d ON b.id_dasi = d.id_dasi;

-- 3. View Rekap Stok Semua Produk
CREATE VIEW product_stock AS
SELECT 'Jas' as kategori, name_jas as nama, size_jas as ukuran, stock_jas as stok FROM jas
UNION ALL
SELECT 'Kemeja', name_kemeja, size_kemeja, stock_kemeja FROM kemeja
UNION ALL
SELECT 'Celana', name_celana, size_celana, stock_celana FROM celana
UNION ALL
SELECT 'Changshan', name_changshan, size_changshan, stock_changshan FROM changshan;


-- =======================UPDATE CHECKED STATUS=============================
-- 1. Cek Overdue (Terlambat Mengembalikan)
-- Gunakan end_dates (sesuai skema awal) dan status_rent = 'Diambil'
SELECT id_order, customer_name, end_dates, status_rent 
FROM order_items 
JOIN customers USING(id_customer)
WHERE CURDATE() > end_dates 
AND status_rent = 'Diambil';

-- 2. Tukar Ukuran/Barang dalam Booking
-- Catatan: id_order tidak ada di tabel booked, kita harus join atau menggunakan id_booked
UPDATE booked 
SET id_kemeja = 2 
WHERE id_booked = (SELECT id_booked FROM order_items WHERE id_order = 1);

-- 3. Update status order menjadi selesai (Akan memicu trigger history)
UPDATE order_items 
SET 
    actual_return_date = NOW(), 
    status_rent = 'Dikembalikan',
    status_order = 'Sudah Selesai', -- Mengikuti skema ENUM Anda
    description_rent = 'Kancing Jas aman, dikembalikan tepat waktu. Denda 50rb dibayar.'
WHERE id_order = 1;





--=================================================================
--====================INSERT DATA CONTOH===========================
-- INSERT customers
INSERT INTO customers (customer_name, customer_phone, bank_account, discount) VALUES
('Budi Santoso', '081234567890', 'BCA - 12345678', 5.00),
('Siti Aminah', '081234567891', 'Mandiri - 87654321', 0.00),
('Andi Wijaya', '081234567892', 'BNI - 11223344', 10.00);

-- INSERT packages
INSERT INTO packages (package_name, package_price, duration_day, deposit, penalty_fee) VALUES
('Silver 3 Hari', 250000, 3, 100000, 50000),
('Gold 5 Hari', 400000, 5, 200000, 75000),
('Pre-Wedding Set', 800000, 4, 250000, 80000),
('Prom Night', 300000, 2, 150000, 60000);

-- INSERT marks
INSERT INTO marks (color_mark, note_mark, date_mark) VALUES
('Merah', 'Perlu dicuci ulang', '2026-01-10'),
('Kuning', 'Kancing kendur', '2026-01-11'),
('Hijau', 'Siap pakai', '2026-01-12');
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
-- INSERT booked (Menghubungkan item-item yang dipesan)
INSERT INTO booked (id_jas, id_kemeja, id_celana, id_changshan, id_dasi) VALUES
(1, 1, 1, NULL, 2), (2, 2, 2, NULL, 3), (3, 3, 3, NULL, 1),
(NULL, NULL, NULL, 1, NULL);
-- INSERT order_items
INSERT INTO order_items (id_customer, id_package, id_booked, start_dates, end_dates, total_price, status_rent, status_order) VALUES
(1, 1, 1, '2026-01-01', '2026-01-04', 237500, 'Dikembalikan', 'Sudah Selesai'),
(2, 2, 2, '2026-01-02', '2026-01-07', 400000, 'Diambil', 'Belum Selesai'),
(3, 3, 3, '2026-01-05', '2026-01-12', 495000, 'Booked', 'Belum Selesai');
-- INSERT history_orders (Data dari order yang sudah 'Dikembalikan' atau 'Selesai')
INSERT INTO history_orders (id_order, omset_order, condition_return) VALUES
(1, 237500, 'Lengkap dan bersih');
