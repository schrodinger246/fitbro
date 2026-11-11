-- Fitbro database (MySQL / MariaDB). Import with phpMyAdmin or: mysql -u root < fitbro.sql
CREATE DATABASE IF NOT EXISTS fitbro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitbro;

CREATE TABLE IF NOT EXISTS products (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  img        VARCHAR(160) NOT NULL,                 -- image file name, e.g. "Mass Gainer.jpg"
  size       VARCHAR(60)  NOT NULL,
  category   ENUM('bulking','cutting','all-phase') NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  tag        VARCHAR(30)  NOT NULL DEFAULT '',
  note       VARCHAR(255) NOT NULL DEFAULT '',
  active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_name  VARCHAR(120) NOT NULL,
  email          VARCHAR(160) NOT NULL,
  phone          VARCHAR(40)  NOT NULL,
  address        VARCHAR(255) NOT NULL,
  city           VARCHAR(120) NOT NULL,
  payment_method VARCHAR(40)  NOT NULL,
  total          DECIMAL(10,2) NOT NULL,
  status         ENUM('pending','paid','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id     INT UNSIGNED NOT NULL,
  product_id   INT UNSIGNED NOT NULL,
  product_name VARCHAR(120) NOT NULL,               -- copied at purchase time
  unit_price   DECIMAL(10,2) NOT NULL,              -- copied at purchase time
  qty          INT UNSIGNED NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (id, name, img, size, category, price, tag, note) VALUES
(1,  'Mass Gainer',             'Mass Gainer.jpg',             '3 kg',         'bulking',   2450, 'Best Seller', 'High-calorie shake for adding size.'),
(2,  'Night Casein',            'Night Casein.jpg',            '2 lb',         'bulking',   1850, '',            'Slow-digesting protein for before bed.'),
(3,  'Carb Load Dextrose',      'Carb Load Dextrose.avif',     '1 kg',         'bulking',    780, 'New',         'Fast carbs to refuel after training.'),
(4,  'Peanut Butter Mass Bars', 'Peanut Butter Mass Bars.webp','Box of 12',    'bulking',    890, '',            'Calorie-dense snack bars on the go.'),
(5,  'Lean Whey Isolate',       'Lean Whey Isolate.jpg',       '2 lb',         'cutting',   2300, 'Best Seller', 'Low-carb, low-fat protein for a deficit.'),
(6,  'Thermo Burn',             'Thermo Burn.png',             '60 capsules',  'cutting',   1450, '',            'Caffeine-based support for energy while cutting.'),
(7,  'L-Carnitine Liquid',      'L-Carnitine Liquid.avif',     '473 ml',       'cutting',    980, 'New',         'Sugar-free liquid shot for training days.'),
(8,  'CLA Softgels',            'CLA Softgels.jpg',            '90 softgels',  'cutting',   1100, '',            'Daily softgel for your lean-phase stack.'),
(9,  'Whey Concentrate',        'Whey Concentrate.webp',       '5 lb',         'all-phase', 3200, 'Best Seller', 'Everyday protein for any goal.'),
(10, 'Creatine Monohydrate',    'Creatine Monohydrate.avif',   '300 g',        'all-phase', 1150, '',            'Unflavored powder for strength and power.'),
(11, 'Pre-Workout Surge',       'Pre-Workout Surge.jpg',       '30 servings',  'all-phase', 1350, 'New',         'Energy and focus before you lift.'),
(12, 'EAA Recovery',            'EAA Recovery.jpg',            '30 servings',  'all-phase',  950, '',            'Amino acids to sip during or after training.');
