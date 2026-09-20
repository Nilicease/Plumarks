<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeRequest;
use App\Http\Resources\GradeResource;
use App\Models\Grade;
use App\Models\GradingCategory;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GradeController extends Controller
{
    public function index(Subject $subject): AnonymousResourceCollection
    {
        $ownedSubject = $this->ownedSubject($subject);

        return GradeResource::collection($ownedSubject->grades()->latest()->get());
    }

    public function store(GradeRequest $request, Subject $subject): JsonResponse
    {
        $ownedSubject = $this->ownedSubject($subject);
        $category = $this->ownedCategory($ownedSubject, (int) $request->validated('grading_category_id'));
        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'Grades must belong to a category without sub-categories.',
            ], 422);
        }

        $grade = $ownedSubject->grades()->create($request->safe()->only([
            'grading_category_id',
            'grading_subcategory_id',
            'name',
            'earned_score',
            'possible_score',
        ]));

        return response()->json([
            'message' => 'Grade created successfully.',
            'data' => new GradeResource($grade),
        ], 201);
    }

    public function show(Grade $grade): GradeResource
    {
        return new GradeResource($this->ownedGrade($grade));
    }

    public function update(GradeRequest $request, Grade $grade): JsonResponse
    {
        $ownedGrade = $this->ownedGrade($grade);
        $category = $this->ownedCategory($ownedGrade->subject, (int) $request->validated('grading_category_id'));

        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'Grades must belong to a category without sub-categories.',
            ], 422);
        }

        $ownedGrade->update($request->safe()->only([
            'grading_category_id',
            'name',
            'earned_score',
            'possible_score',
        ]));

        return response()->json([
            'message' => 'Grade updated successfully.',
            'data' => new GradeResource($ownedGrade->refresh()),
        ]);
    }

    public function destroy(Grade $grade): JsonResponse
    {
        $this->ownedGrade($grade)->delete();

        return response()->json(null, 204);
    }

    private function ownedSubject(Subject $subject): Subject
    {
        return request()->user()->subjects()->whereKey($subject->getKey())->firstOrFail();
    }

    private function ownedGrade(Grade $grade): Grade
    {
        return request()->user()->subjects()
            ->whereKey($grade->subject_id)
            ->firstOrFail()
            ->grades()
            ->whereKey($grade->getKey())
            ->firstOrFail();
    }

    private function ownedCategory(Subject $subject, int $categoryId): GradingCategory
    {
        return $subject->allGradingCategories()->whereKey($categoryId)->firstOrFail();
    }
}
