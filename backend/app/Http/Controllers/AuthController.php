<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterAccount;
use Illuminate\Http\Request;
use App\Models\User;


class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RegisterAccount $request)
    {
        $credentials = $request->validated();

        $user = User::create([
            'firstname' => $credentials['firstname'],
            'lastname' => $credentials['lastname'],
            'email' => $credentials['email'],
            'university' => $credentials['university'],
            'birthday' => $credentials['birthday'],
            'password' => $credentials['password'],
        ]);

        return response()->json([
            'success' => 'Successfully Created Account',
            'user' => 
            [
                'firstname' => $user->firstname,
                'lastname' => $user->lastname
            ]
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
