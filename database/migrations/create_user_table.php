<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Merged migration combining:
     * - add_role_to_users_table
     * - add_details_to_users_table
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Personal Information
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('nik')->nullable()->after('username');
            $table->string('phone')->nullable()->after('email');
            
            // Role & Position
            $table->string('role')->default('Pegawai Desa')->after('phone');
            $table->string('jabatan')->nullable()->after('role');
            $table->string('divisi')->nullable()->after('jabatan');
            
            // Status & Activity
            $table->enum('status', ['Aktif', 'Nonaktif'])->default('Aktif')->after('divisi');
            $table->timestamp('last_login')->nullable()->after('status');
            
            // Permissions
            $table->json('permissions')->nullable()->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username', 
                'nik', 
                'phone', 
                'role', 
                'jabatan', 
                'divisi', 
                'status', 
                'last_login', 
                'permissions'
            ]);
        });
    }
};
