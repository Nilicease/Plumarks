<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'grading_category_id',
        'grading_subcategory_id',
        'name',
        'earned_score',
        'possible_score',
    ];

    protected function casts(): array
    {
        return [
            'earned_score' => 'decimal:2',
            'possible_score' => 'decimal:2',
        ];
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function gradingCategory(): BelongsTo
    {
        return $this->belongsTo(GradingCategory::class);
    }
}
