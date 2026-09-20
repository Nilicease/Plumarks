<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubjectTest extends TestCase
{
    use RefreshDatabase;

    private function categories(): array
    {
        return [
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
        ];
    }

    public function test_user_can_create_and_view_a_subject_with_a_dynamic_grading_system(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/subjects', [
            'name' => 'Mathematics',
            'teacher' => 'Ms. Rivera',
            'categories' => $this->categories(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Mathematics')
            ->assertJsonPath('data.categories.2.subcategories.1.weight', 50);

        $this->withToken($token)
            ->getJson('/api/subjects')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_subject_weights_must_total_100_at_each_level(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $categories = $this->categories();
        $categories[0]['weight'] = 41;
        $categories[2]['subcategories'][1]['weight'] = 49;

        $this->withToken($token)
            ->postJson('/api/subjects', ['name' => 'Mathematics', 'categories' => $categories])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['categories', 'categories.2.subcategories']);
    }

    public function test_user_cannot_access_another_users_subject(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $subject = $owner->subjects()->create(['name' => 'Private subject']);
        $token = $otherUser->createToken('test-token')->plainTextToken;

        $this->withToken($token)->getJson("/api/subjects/{$subject->id}")->assertNotFound();
        $this->withToken($token)->putJson("/api/subjects/{$subject->id}", [
            'name' => 'Changed',
            'categories' => $this->categories(),
        ])->assertNotFound();
        $this->withToken($token)->deleteJson("/api/subjects/{$subject->id}")->assertNotFound();
    }

    public function test_user_can_update_and_delete_a_subject(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $subject = $this->withToken($token)->postJson('/api/subjects', [
            'name' => 'Mathematics',
            'categories' => $this->categories(),
        ])->assertCreated()->json('data');

        $updatedCategories = [['name' => 'Final exam', 'weight' => 100]];
        $this->withToken($token)->putJson("/api/subjects/{$subject['id']}", [
            'name' => 'Advanced Mathematics',
            'teacher' => 'Mr. Cruz',
            'color' => '#123456',
            'categories' => $updatedCategories,
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Advanced Mathematics')
            ->assertJsonPath('data.categories.0.name', 'Final exam');

        $this->withToken($token)->deleteJson("/api/subjects/{$subject['id']}")->assertNoContent();
        $this->assertDatabaseMissing('subjects', ['id' => $subject['id']]);
    }
}
