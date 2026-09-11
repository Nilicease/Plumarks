<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grading_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('earned_score', 8, 2);
            $table->decimal('possible_score', 8, 2);
            $table->timestamps();

            $table->index(['subject_id', 'grading_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
