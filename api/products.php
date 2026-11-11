<?php
require __DIR__ . '/../config.php';

try {
    $rows = db()->query(
        'SELECT id, name, img, size, category, price, tag, note
         FROM products WHERE active = 1 ORDER BY id'
    )->fetchAll();

    // Shape matches what Fitbro_Shop.html expects
    $products = array_map(fn($r) => [
        'id'    => (int)$r['id'],
        'name'  => $r['name'],
        'img'   => $r['img'],
        'size'  => $r['size'],
        'cat'   => $r['category'],
        'price' => (float)$r['price'],
        'tag'   => $r['tag'],
        'note'  => $r['note'],
    ], $rows);

    json_out(['products' => $products]);
} catch (Throwable $e) {
    json_out(['error' => 'Could not load products.'], 500);
}
