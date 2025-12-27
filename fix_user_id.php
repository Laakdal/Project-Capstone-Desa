<?php

use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== FIXING LETTERS USER_ID ===\n\n";

// Check current state
echo "Before fix:\n";
$letters = DB::table('letters')->get(['id', 'user_id', 'subject', 'status']);
foreach ($letters as $letter) {
    echo sprintf("ID: %d | User ID: %s | Subject: %s | Status: %s\n", 
        $letter->id,
        $letter->user_id ?? 'NULL',
        $letter->subject ?? '-',
        $letter->status
    );
}

echo "\n--- Updating NULL user_id to 3 ---\n";

// Update NULL user_id
$affected = DB::update('UPDATE letters SET user_id = 3 WHERE user_id IS NULL');
echo "Rows affected: {$affected}\n\n";

// Check after fix
echo "After fix:\n";
$letters = DB::table('letters')->get(['id', 'user_id', 'subject', 'status']);
foreach ($letters as $letter) {
    echo sprintf("ID: %d | User ID: %s | Subject: %s | Status: %s\n", 
        $letter->id,
        $letter->user_id ?? 'NULL',
        $letter->subject ?? '-',
        $letter->status
    );
}

echo "\n=== DONE ===\n";
