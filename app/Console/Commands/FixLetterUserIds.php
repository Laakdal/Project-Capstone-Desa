<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixLetterUserIds extends Command
{
    protected $signature = 'fix:letter-user-ids';
    protected $description = 'Fix NULL user_id in letters table';

    public function handle()
    {
        $this->info('Fixing NULL user_id in letters table...');
        
        // Get count of letters with NULL user_id
        $nullCount = DB::table('letters')->whereNull('user_id')->count();
        $this->info("Found {$nullCount} letters with NULL user_id");
        
        if ($nullCount > 0) {
            // Update all NULL user_id to 3 (Siti Aminah - Pegawai Desa)
            $updated = DB::table('letters')
                ->whereNull('user_id')
                ->update(['user_id' => 3]);
            
            $this->info("Updated {$updated} letters");
        }
        
        // Show current state
        $this->info("\nCurrent letters:");
        $letters = DB::table('letters')->select('id', 'user_id', 'subject', 'status')->get();
        $this->table(['ID', 'User ID', 'Subject', 'Status'], $letters->map(function($letter) {
            return [
                $letter->id,
                $letter->user_id ?? 'NULL',
                $letter->subject ?? '-',
                $letter->status
            ];
        }));
        
        $this->info("\n✅ Done!");
        
        return 0;
    }
}
