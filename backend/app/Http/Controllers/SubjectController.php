<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $subjects = request()->user()->subjects()
            ->with(['gradingCategories.children'])
            ->latest()
            ->get();

        return SubjectResource::collection($subjects);
    }

    public function store(SubjectRequest $request): JsonResponse
    {
        $subject = DB::transaction(function () use ($request): Subject {
            $subject = $request->user()->subjects()->create($request->safe()->only(['name', 'teacher', 'color']));
            $this->replaceCategories($subject, $request->validated('categories'));

            return $subject;
        });

        return response()->json([
            'message' => 'Subject created successfully.',
            'data' => new SubjectResource($subject->load(['gradingCategories.children'])),
        ], 201);
    }

    public function show(Subject $subject): SubjectResource
    {
        $ownedSubject = $this->ownedSubject($subject);

        return new SubjectResource($ownedSubject->load(['gradingCategories.children']));
    }

    public function update(SubjectRequest $request, Subject $subject): JsonResponse
    {
        $ownedSubject = $this->ownedSubject($subject);

        DB::transaction(function () use ($request, $ownedSubject): void {
            $ownedSubject->update($request->safe()->only(['name', 'teacher', 'color']));
            $ownedSubject->allGradingCategories()->delete();
            $this->replaceCategories($ownedSubject, $request->validated('categories'));
        });

        return response()->json([
            'message' => 'Subject updated successfully.',
            'data' => new SubjectResource($ownedSubject->load(['gradingCategories.children'])),
        ]);
    }

    public function destroy(Subject $subject): JsonResponse
    {
        $this->ownedSubject($subject)->delete();

        return response()->json(null, 204);
    }

    private function ownedSubject(Subject $subject): Subject
    {
        return request()->user()->subjects()->whereKey($subject->getKey())->firstOrFail();
    }

    /** @param array<int, array<string, mixed>> $categories */
    private function replaceCategories(Subject $subject, array $categories): void
    {
        foreach ($categories as $categoryData) {
            $children = $categoryData['subcategories'] ?? [];
            $category = $subject->allGradingCategories()->create([
                'name' => $categoryData['name'],
                'weight' => $categoryData['weight'],
            ]);

            foreach ($children as $childData) {
                $category->children()->create([
                    'subject_id' => $subject->id,
                    'name' => $childData['name'],
                    'weight' => $childData['weight'],
                ]);
            }
        }
    }
}
