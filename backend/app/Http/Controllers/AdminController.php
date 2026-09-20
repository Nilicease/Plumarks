<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\BugReport;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(): JsonResponse
    {
        return response()->json(['data' => UserResource::collection(User::latest()->get())]);
    }

    public function toggleBlocked(Request $request, User $user): JsonResponse
    {
        abort_if($user->is_admin, 422, 'Administrator accounts cannot be blocked.');
        $user->update(['is_blocked' => $request->boolean('is_blocked')]);

        if ($user->is_blocked) {
            $user->tokens()->delete();
        }

        return response()->json(['data' => new UserResource($user)]);
    }

    public function reports(): JsonResponse
    {
        return response()->json(['data' => BugReport::with('user:id,firstname,lastname')->latest()->get()]);
    }

    public function resolveReport(BugReport $report): JsonResponse
    {
        $report->update(['resolved_at' => now()]);

        return response()->json(['data' => $report->refresh()]);
    }
}
