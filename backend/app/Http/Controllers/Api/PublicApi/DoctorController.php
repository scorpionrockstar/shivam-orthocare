<?php

namespace App\Http\Controllers\Api\PublicApi;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;

class DoctorController extends Controller
{
    public function index(): JsonResponse
    {
        $doctors = Doctor::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($doctors);
    }

    public function show(string $slug): JsonResponse
    {
        $doctor = Doctor::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json($doctor);
    }
}
