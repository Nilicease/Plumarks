<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $registration = $this->postJson('/api/register', [
            'firstname' => 'Jane',
            'lastname' => 'Doe',
            'email' => 'jane@example.com',
            'university' => 'Example University',
            'birthday' => '2005-06-14',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $registration->assertCreated()
            ->assertJsonPath('message', 'Account created successfully.')
            ->assertJsonMissingPath('data.password');

        $login = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'Password123',
        ]);

        $login->assertOk()
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_authenticated_user_can_view_and_revoke_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonMissingPath('data.password');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertUnauthorized();
    }

    public function test_user_cannot_use_another_users_token(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/user')
            ->assertJsonPath('data.id', $user->id);

        $this->assertNotSame($otherUser->id, $response->json('data.id'));
    }
}