<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'store']);
Route::post('/createUser', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/loginUser', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::post('/logoutUser', [AuthController::class, 'logout']);
	Route::get('/user', [AuthController::class, 'user']);
	Route::get('/dashboard', DashboardController::class);
	Route::apiResource('subjects', SubjectController::class);
	Route::apiResource('subjects.grades', GradeController::class)->only(['index', 'store']);
	Route::apiResource('grades', GradeController::class)->only(['show', 'update', 'destroy']);
});
