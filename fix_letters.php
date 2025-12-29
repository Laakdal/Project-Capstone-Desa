<?php

// Quick script to check and fix letters table
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Checking letters table...\n\n";

$letters = DB::table('letters')->select('id', 'user_id', 'subject', 'status')->get();

echo "Current state:\n";
echo "ID\tUser ID\t\tSubject\t\t\t\tStatus\n";
echo str_repeat("-", 80) . "\n";

foreach ($letters as $letter) {
    printf("%d\t%s\t\t%s\t\t%s\n", 
        $letter->id, 
        $letter->user_id ?? 'NULL',
        substr($letter->subject ?? '-', 0, 30),
        $letter->status
    );
}

echo "\n\nFixing NULL user_ids...\n";
$updated = DB::table('letters')->whereNull('user_id')->update(['user_id' => 3]);
echo "Updated: {$updated} records\n\n";

echo "After fix:\n";
$letters = DB::table('letters')->select('id', 'user_id', 'subject', 'status')->get();
echo "ID\tUser ID\t\tSubject\t\t\t\tStatus\n";
echo str_repeat("-", 80) . "\n";

foreach ($letters as $letter) {
    printf("%d\t%s\t\t%s\t\t%s\n", 
        $letter->id, 
        $letter->user_id ?? 'NULL',
        substr($letter->subject ?? '-', 0, 30),
        $letter->status
    );
}
