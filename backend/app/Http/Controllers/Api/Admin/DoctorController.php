<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DoctorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        $doctors = $query->orderBy('sort_order')->paginate($request->get('per_page', 15));

        return response()->json($doctors);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'qualifications' => 'required|string|max:500',
            'specialization' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'available_days' => 'nullable|array',
            'available_time_start' => 'nullable|date_format:H:i',
            'available_time_end' => 'nullable|date_format:H:i',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'photo' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);

        if ($request->hasFile('photo')) {
            $validated['photo'] = app(CloudinaryService::class)->upload($request->file('photo'), 'shivam-orthocare/doctors');
        }

        $doctor = Doctor::create($validated);

        return response()->json($doctor, 201);
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return response()->json($doctor);
    }

    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'qualifications' => 'sometimes|string|max:500',
            'specialization' => 'sometimes|string|max:255',
            'experience_years' => 'sometimes|integer|min:0',
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'available_days' => 'nullable|array',
            'available_time_start' => 'nullable|date_format:H:i',
            'available_time_end' => 'nullable|date_format:H:i',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = app(CloudinaryService::class)->upload($request->file('photo'), 'shivam-orthocare/doctors');
        }

        $doctor->update($validated);

        return response()->json($doctor);
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }
}
