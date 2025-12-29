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
        Schema::table('letters', function (Blueprint $table) {
            // Add columns for approval workflow
            if (!Schema::hasColumn('letters', 'secretary_notes')) {
                $table->text('secretary_notes')->nullable()->after('content');
            }
            if (!Schema::hasColumn('letters', 'head_notes')) {
                $table->text('head_notes')->nullable()->after('secretary_notes');
            }
            if (!Schema::hasColumn('letters', 'verified_by')) {
                $table->unsignedBigInteger('verified_by')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('letters', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable()->after('verified_by');
            }
            if (!Schema::hasColumn('letters', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('approved_by');
            }
            if (!Schema::hasColumn('letters', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('verified_at');
            }
            if (!Schema::hasColumn('letters', 'subject')) {
                $table->string('subject')->nullable()->after('letter_number');
            }
            if (!Schema::hasColumn('letters', 'recipient')) {
                $table->string('recipient')->nullable()->after('subject');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $columns = [
                'secretary_notes',
                'head_notes',
                'verified_by',
                'approved_by',
                'verified_at',
                'approved_at',
                'subject',
                'recipient',
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('letters', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
