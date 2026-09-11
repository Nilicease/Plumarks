<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginAccount;
use App\Http\Requests\RegisterAccount;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Auth\RequestGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


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

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
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
}
