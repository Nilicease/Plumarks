<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_users_and_bug_reports_while_regular_users_cannot(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $member = User::factory()->create();
        $adminToken = $admin->createToken('admin')->plainTextToken;
        $memberToken = $member->createToken('member')->plainTextToken;

        $this->withToken($memberToken)->getJson('/api/admin/users')->assertForbidden();

        $this->withToken($memberToken)->postJson('/api/reports', [
            'email' => $member->email,
            'page' => 'Tasks',
            'description' => 'A task could not be saved.',
        ])->assertCreated();

        $this->app['auth']->forgetGuards();

        $this->withToken($adminToken)->getJson('/api/admin/users')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->withToken($adminToken)->patchJson("/api/admin/users/{$member->id}/blocked", ['is_blocked' => true])
            ->assertOk()
            ->assertJsonPath('data.is_blocked', true);

        $this->app['auth']->forgetGuards();

        $this->postJson('/api/login', ['email' => $member->email, 'password' => 'password'])
            ->assertForbidden();

        $this->app['auth']->forgetGuards();

        $report = $this->withToken($adminToken)->getJson('/api/admin/reports')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->json('data.0');

        $this->withToken($adminToken)->patchJson("/api/admin/reports/{$report['id']}/resolve")
            ->assertOk()
            ->assertJsonPath('data.resolved_at', fn ($value): bool => $value !== null);
    }

    public function test_user_can_change_password_with_the_current_password(): void
    {
        $user = User::factory()->create(['password' => 'OldPassword123']);
        $token = $user->createToken('member')->plainTextToken;

        $response = $this->withToken($token)->putJson('/api/password', [
            'current_password' => 'OldPassword123',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ]);
        fwrite(STDERR, $response->getContent());
        $response->assertOk();

        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'NewPassword123'])->assertOk();
    }
}
