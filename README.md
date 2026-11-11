# Fitbro setup (XAMPP / WAMP)

## 1. Install a local server
Install XAMPP (https://www.apachefriends.org) and start **Apache** and **MySQL** in the XAMPP Control Panel.

## 2. Create the database
1. Open http://localhost/phpmyadmin
2. Click **Import** → choose `fitbro.sql` → **Import**.
   (This creates the `fitbro` database, the tables, and the 12 products.)

## 3. Copy the site
Copy this whole `fitbro` folder into `C:\xampp\htdocs\` so it looks like:

    htdocs/fitbro/
      Fitbro_Main.html
      Fitbro_Shop.html
      config.php
      fitbro.sql
      api/products.php
      api/checkout.php
      (your product images go here too)

## 4. Add your product images
Put the 12 image files in the same folder as Fitbro_Shop.html, named exactly:
Mass Gainer.jpg, Night Casein.jpg, Carb Load Dextrose.avif, Peanut Butter Mass Bars.webp,
Lean Whey Isolate.jpg, Thermo Burn.png, L-Carnitine Liquid.avif, CLA Softgels.jpg,
Whey Concentrate.webp, Creatine Monohydrate.avif, Pre-Workout Surge.jpg, EAA Recovery.jpg

## 5. Check the database login
Open `config.php`. Defaults (user `root`, empty password) work on a fresh XAMPP.
If your MySQL has a password, change DB_PASS.

## 6. Open the site
http://localhost/fitbro/Fitbro_Main.html
(Do not double-click the HTML files; they must be opened through localhost so PHP runs.)

## Managing products and orders
- Products: phpMyAdmin → `fitbro` → `products` (edit price, name, image, tag; set active = 0 to hide).
- Orders: phpMyAdmin → `fitbro` → `orders` and `order_items`.

## Troubleshooting
- "Products couldn't be loaded": Apache/MySQL not running, SQL not imported, or the page was opened as a file.
- Wrong login error: fix DB_USER / DB_PASS in config.php.
- Broken pictures show a drawn tub: the file name doesn't match exactly (capitals and spaces count).
