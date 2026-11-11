<?php
require __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'POST only.'], 405);
}

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) {
    json_out(['error' => 'Invalid request.'], 400);
}

$c     = $in['customer'] ?? [];
$items = $in['items'] ?? [];

// Validate customer details
$fields = ['name', 'email', 'phone', 'address', 'city', 'payment'];
foreach ($fields as $f) {
    if (!isset($c[$f]) || trim((string)$c[$f]) === '') {
        json_out(['error' => "Missing field: $f"], 422);
    }
}
if (!filter_var($c['email'], FILTER_VALIDATE_EMAIL)) {
    json_out(['error' => 'Please enter a valid email address.'], 422);
}
$allowedPayments = ['Cash on Delivery', 'GCash', 'Maya', 'Bank Transfer', 'Credit/Debit Card'];
if (!in_array($c['payment'], $allowedPayments, true)) {
    json_out(['error' => 'Invalid payment method.'], 422);
}
if (!is_array($items) || count($items) === 0) {
    json_out(['error' => 'Your cart is empty.'], 422);
}

try {
    $pdo = db();
    $pdo->beginTransaction();

    // Prices always come from the database, never from the browser
    $get = $pdo->prepare('SELECT id, name, price FROM products WHERE id = ? AND active = 1');
    $lines = [];
    $total = 0.0;
    foreach ($items as $it) {
        $id  = (int)($it['id'] ?? 0);
        $qty = (int)($it['qty'] ?? 0);
        if ($qty < 1 || $qty > 99) {
            throw new RuntimeException('Invalid quantity.');
        }
        $get->execute([$id]);
        $p = $get->fetch();
        if (!$p) {
            throw new RuntimeException('A product in your cart is no longer available.');
        }
        $lines[] = [$p['id'], $p['name'], $p['price'], $qty];
        $total  += $p['price'] * $qty;
    }

    $pdo->prepare(
        'INSERT INTO orders (customer_name, email, phone, address, city, payment_method, total)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        trim($c['name']), trim($c['email']), trim($c['phone']),
        trim($c['address']), trim($c['city']), $c['payment'], $total,
    ]);
    $orderId = (int)$pdo->lastInsertId();

    $ins = $pdo->prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, unit_price, qty)
         VALUES (?, ?, ?, ?, ?)'
    );
    foreach ($lines as [$pid, $pname, $price, $qty]) {
        $ins->execute([$orderId, $pid, $pname, $price, $qty]);
    }

    $pdo->commit();
    json_out(['ok' => true, 'order_id' => $orderId, 'total' => $total]);
} catch (RuntimeException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_out(['error' => $e->getMessage()], 422);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_out(['error' => 'Something went wrong placing your order.'], 500);
}
