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
            'address' => 'Jl. Raya Banjarsari No. 12, RT 02/RW 03, Desa Banjarsari, Kec. Bayongbong, Kab. Garut',
            'status' => 'Aktif',
            'last_login' => now()->subDays(1),
        ]);

        User::create([
            'name' => 'Joko Widodo',
            'email' => 'joko.widodo@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'address' => 'Jl. Merdeka No. 45, RT 01/RW 02, Desa Banjarsari, Kec. Bayongbong, Kab. Garut',
            'status' => 'Aktif',
            'last_login' => now()->subDays(2),
        ]);

        User::create([
            'name' => 'Dewi Lestari',
            'email' => 'dewi.lestari@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'address' => 'Jl. Ciloa No. 78, RT 03/RW 04, Desa Banjarsari, Kec. Bayongbong, Kab. Garut',
            'status' => 'Aktif',
            'last_login' => now()->subWeeks(1),
        ]);

        // Create Pegawai Desa - Inactive
        User::create([
            'name' => 'Andi Prasetyo',
            'email' => 'andi.prasetyo@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'address' => 'Jl. Sudirman No. 23, RT 02/RW 01, Desa Banjarsari, Kec. Bayongbong, Kab. Garut',
            'status' => 'Nonaktif',
            'last_login' => now()->subMonths(2),
        ]);

        User::create([
            'name' => 'Rina Nurhasanah',
            'email' => 'rina.nur@example.com',
            'password' => bcrypt('password'),
            'role' => 'Pegawai Desa',
            'address' => 'Jl. Pahlawan No. 56, RT 04/RW 05, Desa Banjarsari, Kec. Bayongbong, Kab. Garut',
            'status' => 'Aktif',
            'last_login' => null, // Never logged in
        ]);

        // Create sample letters
        $pegawai1 = User::where('email', 'siti.aminah@example.com')->first();
        $pegawai2 = User::where('email', 'joko.widodo@example.com')->first();
        $sekdes = User::where('email', 'sekretaris.desa@example.com')->first();
        $kades = User::where('email', 'kepala.desa@example.com')->first();

        // Letter 1: Sent (waiting for Sekdes review)
        \App\Models\Letter::create([
            'user_id' => $pegawai1->id,
            'template_type' => 'surat_tugas',
            'letter_number' => 'ST/001/2025',
            'subject' => 'Surat Tugas Kegiatan Posyandu',
            'recipient' => 'Ketua PKK Desa',
            'status' => 'sent',
            'content' => '<p>Konten surat tugas...</p>',
            'pdf_path' => 'letters/sample_1.pdf',
            'created_at' => now()->subDays(2),
        ]);

        // Letter 2: Revoked (returned by Sekdes for revision)
        \App\Models\Letter::create([
            'user_id' => $pegawai1->id,
            'template_type' => 'surat_pengunduran_diri',
            'letter_number' => 'SPD/002/2025',
            'subject' => 'Surat Pengunduran Diri',
            'recipient' => 'Kepala Desa Banjarsari',
            'status' => 'revoked',
            'content' => '<p>Konten surat pengunduran diri...</p>',
            'pdf_path' => 'letters/sample_2.pdf',
            'secretary_notes' => 'Mohon perbaiki format tanggal dan tambahkan alasan pengunduran diri yang lebih detail.',
            'verified_by' => $sekdes->id,
            'verified_at' => now()->subDays(1),
            'created_at' => now()->subDays(3),
        ]);

        // Letter 3: Continued (forwarded to Kades)
        \App\Models\Letter::create([
            'user_id' => $pegawai2->id,
            'template_type' => 'surat_keputusan',
            'letter_number' => 'SK/003/2025',
            'subject' => 'Surat Keputusan Pembentukan Tim',
            'recipient' => 'Seluruh Perangkat Desa',
            'status' => 'continued',
            'content' => '<p>Konten surat keputusan...</p>',
            'pdf_path' => 'letters/sample_3.pdf',
            'verified_by' => $sekdes->id,
            'verified_at' => now()->subHours(12),
            'created_at' => now()->subDays(4),
        ]);

        // Letter 4: Approved
        \App\Models\Letter::create([
            'user_id' => $pegawai2->id,
            'template_type' => 'memo',
            'letter_number' => 'MEMO/004/2025',
            'subject' => 'Memo Rapat Koordinasi',
            'recipient' => 'Seluruh Staff',
            'status' => 'approved',
            'content' => '<p>Konten memo...</p>',
            'pdf_path' => 'letters/sample_4.pdf',
            'verified_by' => $sekdes->id,
            'verified_at' => now()->subDays(5),
            'approved_by' => $kades->id,
            'approved_at' => now()->subDays(4),
            'created_at' => now()->subDays(6),
        ]);

        // Letter 5: Rejected
        \App\Models\Letter::create([
            'user_id' => $pegawai1->id,
            'template_type' => 'surat_perintah_perjalanan_dinas',
            'letter_number' => 'SPPD/005/2025',
            'subject' => 'Surat Perintah Perjalanan Dinas',
            'recipient' => 'Pegawai Desa',
            'status' => 'rejected',
            'content' => '<p>Konten SPPD...</p>',
            'pdf_path' => 'letters/sample_5.pdf',
            'verified_by' => $sekdes->id,
            'verified_at' => now()->subDays(3),
            'approved_by' => $kades->id,
            'approved_at' => now()->subDays(2),
            'head_notes' => 'Anggaran untuk perjalanan dinas belum tersedia. Mohon ditunda hingga bulan depan.',
            'created_at' => now()->subDays(7),
        ]);
    }
}
