<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginAccount;
use App\Http\Requests\RegisterAccount;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\RequestGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function store(RegisterAccount $request)
    {
        $data = $request->validated();

        $user = User::create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'university' => $data['university'],
            'birthday' => $data['birthday'],
            'password' => $data['password'],
        ]);

        return response()->json([
            'message' => 'Account created successfully.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function login(LoginAccount $request)
    {
        $data = $request->validated();
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'This account has been blocked.'], 403);
        }

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'user' => new UserResource($user),
                'token' => $user->createToken('plumarks-api')->plainTextToken,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        /** @var RequestGuard $guard */
        $guard = Auth::guard('sanctum');
        $guard->forgetUser();

        return response()->noContent();
    }

    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (! Hash::check($data['current_password'], $request->user()->password)) {
            throw ValidationException::withMessages(['current_password' => 'The current password is incorrect.']);
        }

        $request->user()->update(['password' => $data['password']]);

        return response()->json(['message' => 'Password updated successfully.']);
    }
}
