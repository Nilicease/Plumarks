<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grading_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('grading_categories')->cascadeOnDelete();
            $table->string('name');
            $table->decimal('weight', 5, 2);
            $table->timestamps();

            $table->index(['subject_id', 'parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grading_categories');
    }
};
