<?php

namespace App\Services;

use App\Models\GradingCategory;
use App\Models\Subject;
use Illuminate\Support\Collection;

class GradeCalculator
{
    public function subjectFinalGrade(Subject $subject): float
    {
        $subject->loadMissing(['gradingCategories.children', 'grades']);
        $grades = $subject->grades->groupBy('grading_category_id');

        $weightedTotal = $subject->gradingCategories->sum(
            fn (GradingCategory $category): float => $this->categoryScore($category, $grades) * ((float) $category->weight / 100)
        );

        return round($weightedTotal, 2);
    }

    /** @param Collection<int, Collection<int, \App\Models\Grade>> $grades */
    public function categoryScore(GradingCategory $category, Collection $grades): float
    {
        if ($category->children->isNotEmpty()) {
            $weightedTotal = $category->children->sum(
                fn (GradingCategory $child): float => $this->averageGrades($grades->get($child->id, collect())) * ((float) $child->weight / 100)
            );

            return round($weightedTotal, 2);
        }

        return $this->averageGrades($grades->get($category->id, collect()));
    }

    /** @param Collection<int, \App\Models\Grade> $grades */
    private function averageGrades(Collection $grades): float
    {
        $possible = $grades->sum(fn ($grade): float => (float) $grade->possible_score);

        if ($possible <= 0) {
            return 0.0;
        }

        return round(($grades->sum(fn ($grade): float => (float) $grade->earned_score) / $possible) * 100, 2);
    }
}
