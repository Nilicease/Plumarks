<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\GradeCalculator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GradeTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_grades_and_dashboard_calculates_weighted_results(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $subject = $this->withToken($token)->postJson('/api/subjects', [
            'name' => 'Mathematics',
            'categories' => [
                ['name' => 'Exam', 'weight' => 40],
                ['name' => 'Performance task', 'weight' => 30],
                [
                    'name' => 'Activities',
                    'weight' => 30,
                    'subcategories' => [
                        ['name' => 'Quizzes', 'weight' => 50],
                        ['name' => 'Assignment', 'weight' => 50],
                    ],
                ],
            ],
        ])->assertCreated()->json('data');

        $categories = $subject['categories'];
        $examId = $categories[0]['id'];
        $performanceId = $categories[1]['id'];
        $quizId = $categories[2]['subcategories'][0]['id'];
        $assignmentId = $categories[2]['subcategories'][1]['id'];

        $createGrade = fn (int $categoryId, string $name, float $earned, float $possible) => $this->withToken($token)
            ->postJson("/api/subjects/{$subject['id']}/grades", [
                'grading_category_id' => $categoryId,
                'name' => $name,
                'earned_score' => $earned,
                'possible_score' => $possible,
            ]);

        $createGrade($examId, 'Midterm', 80, 100)->assertCreated();
        $createGrade($performanceId, 'Project', 10, 10)->assertCreated();
        $createGrade($quizId, 'Quiz 1', 5, 10)->assertCreated();
        $createGrade($assignmentId, 'Assignment 1', 10, 10)->assertCreated();

        $this->assertSame(84.5, app(GradeCalculator::class)->subjectFinalGrade(
            $user->subjects()->with(['gradingCategories.children', 'grades'])->firstOrFail()
        ));

        $this->withToken($token)
            ->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('data.overall_average', 84.5)
            ->assertJsonPath('data.subjects.0.final_grade', 84.5);
    }

    public function test_grade_validation_and_nested_ownership_are_enforced(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $ownerToken = $owner->createToken('owner-token')->plainTextToken;
        $otherToken = $otherUser->createToken('other-token')->plainTextToken;

        $subject = $this->withToken($ownerToken)->postJson('/api/subjects', [
            'name' => 'Science',
            'categories' => [['name' => 'Exam', 'weight' => 100]],
        ])->json('data');
        $categoryId = $subject['categories'][0]['id'];

        $this->withToken($ownerToken)
            ->postJson("/api/subjects/{$subject['id']}/grades", [
                'grading_category_id' => $categoryId,
                'name' => 'Invalid score',
                'earned_score' => 11,
                'possible_score' => 10,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('earned_score');

        $this->app['auth']->forgetGuards();

        $this->withToken($otherToken)
            ->postJson("/api/subjects/{$subject['id']}/grades", [
                'grading_category_id' => $categoryId,
                'name' => 'Unauthorized',
                'earned_score' => 5,
                'possible_score' => 10,
            ])
            ->assertNotFound();
    }
}
