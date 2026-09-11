<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubjectResource;
use App\Services\GradeCalculator;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(GradeCalculator $calculator): JsonResponse
    {
        $subjects = request()->user()->subjects()
            ->with(['gradingCategories.children', 'grades'])
            ->latest()
            ->get();

        $summaries = $subjects->map(function ($subject) use ($calculator): array {
            $summary = (new SubjectResource($subject))->toArray(request());
            $summary['final_grade'] = $calculator->subjectFinalGrade($subject);

            return $summary;
        })->values();

        $overallAverage = $summaries->isEmpty()
            ? null
            : round($summaries->avg('final_grade'), 2);

        return response()->json([
            'data' => [
                'user' => request()->user()->only(['id', 'firstname', 'lastname', 'email', 'university', 'birthday']),
                'subjects' => $summaries,
                'overall_average' => $overallAverage,
            ],
        ]);
    }
}
