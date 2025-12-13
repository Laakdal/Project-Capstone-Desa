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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('nik')->nullable()->after('username');
            $table->string('phone')->nullable()->after('nik');
            $table->string('jabatan')->nullable()->after('phone');
            $table->string('divisi')->nullable()->after('jabatan');
            $table->json('permissions')->nullable()->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'nik', 'phone', 'jabatan', 'divisi', 'permissions']);
        });
    }
};
