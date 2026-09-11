<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'teacher', 'color'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gradingCategories(): HasMany
    {
        return $this->hasMany(GradingCategory::class)->whereNull('parent_id');
    }

    public function allGradingCategories(): HasMany
    {
        return $this->hasMany(GradingCategory::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }
}
