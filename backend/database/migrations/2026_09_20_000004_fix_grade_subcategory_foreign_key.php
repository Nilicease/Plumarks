<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The original convention-based constraint inferred a non-existent
     * `grading_subcategories` table. Sub-categories are rows in
     * `grading_categories`, so repair installations that already ran it.
     */
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table): void {
            $table->dropForeign(['grading_subcategory_id']);
            $table->foreign('grading_subcategory_id')
                ->references('id')
                ->on('grading_categories')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table): void {
            $table->dropForeign(['grading_subcategory_id']);
            $table->foreign('grading_subcategory_id')
                ->references('id')
                ->on('grading_categories')
                ->nullOnDelete();
        });
    }
};
