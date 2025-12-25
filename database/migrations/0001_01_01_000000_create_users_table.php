<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            
            // Personal Information
            $table->string('username')->unique()->nullable();
            $table->string('nik')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            
            // Role & Position
            $table->string('role')->default('Pegawai Desa');
            $table->string('jabatan')->nullable();
            $table->string('divisi')->nullable();
            
            // Status & Activity
            $table->enum('status', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->timestamp('last_login')->nullable();
            
            // Authentication
            $table->string('password');
            $table->rememberToken();
            
            // Permissions
            $table->json('permissions')->nullable();
            
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
