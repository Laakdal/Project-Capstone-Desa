<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Kepala Desa
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'kepala.desa@example.com',
            'password' => bcrypt('password'),
            'role' => 'Kepala Desa',
            'status' => 'Aktif',
            'last_login' => now()->subMinutes(2),
        ]);

        // Create Sekretaris Desa
        User::create([
            'name' => 'Ahmad Sekdes',
            'email' => 'sekretaris.desa@example.com',
            'password' => bcrypt('password'),
            'role' => 'Sekretaris Desa',
            'status' => 'Aktif',
            'last_login' => now()->subHours(3),
        ]);

        // Create Pegawai Desa - Active
        User::create([
            'name' => 'Siti Aminah',
            'email' => 'siti.aminah@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'status' => 'Aktif',
            'last_login' => now()->subDays(1),
        ]);

        User::create([
            'name' => 'Joko Widodo',
            'email' => 'joko.widodo@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'status' => 'Aktif',
            'last_login' => now()->subDays(2),
        ]);

        User::create([
            'name' => 'Dewi Lestari',
            'email' => 'dewi.lestari@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'status' => 'Aktif',
            'last_login' => now()->subWeeks(1),
        ]);

        // Create Pegawai Desa - Inactive
        User::create([
            'name' => 'Andi Prasetyo',
            'email' => 'andi.prasetyo@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'status' => 'Nonaktif',
            'last_login' => now()->subMonths(2),
        ]);

        User::create([
            'name' => 'Rina Nurhasanah',
            'email' => 'rina.nur@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'status' => 'Aktif',
            'last_login' => null, // Never logged in
        ]);
    }
}
