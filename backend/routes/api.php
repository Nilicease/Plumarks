<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\SubjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'store']);
Route::post('/createUser', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/loginUser', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logoutUser', [AuthController::class, 'logout']);
    Route::put('/password', [AuthController::class, 'changePassword']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/dashboard', DashboardController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('subjects.grades', GradeController::class)->only(['index', 'store']);
    Route::apiResource('grades', GradeController::class)->only(['show', 'update', 'destroy']);
    Route::post('/reports', function (Request $request) {
        $data = $request->validate(['email' => ['required', 'email'], 'page' => ['required', 'string', 'max:100'], 'description' => ['required', 'string', 'max:5000']]);
        $report = $request->user()->bugReports()->create($data);

        return response()->json(['data' => $report], 201);
    });
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/blocked', [AdminController::class, 'toggleBlocked']);
        Route::get('/reports', [AdminController::class, 'reports']);
        Route::patch('/reports/{report}/resolve', [AdminController::class, 'resolveReport']);
    });
});
