<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('letter_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('letter_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('mime_type')->default('application/pdf');
            // Use LONGBLOB for large files
            $table->longText('file_content')->charset('binary'); // Laravel doesn't have direct heavy blob support in all drivers, but this usually works as LONGBLOB in MySQL
            $table->timestamps();
        });
        
        // Ensure the column is LONGBLOB for MySQL
        if (config('database.default') === 'mysql') {
            DB::statement("ALTER TABLE letter_attachments CHANGE file_content file_content LONGBLOB");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letter_attachments');
    }
};
