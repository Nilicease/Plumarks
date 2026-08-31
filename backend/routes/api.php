<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/createUser', [AuthController::class, 'store']);
Route::post('/loginUser', [AuthController::class, 'login']);
Route::post('/logoutUser', [AuthController::class, 'logout']);
