<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PatientRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PatientRecord::withCount('visits');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $patients = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($patients);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);

        $patient = PatientRecord::create($validated);

        return response()->json($patient, 201);
    }

    public function show(PatientRecord $patientRecord): JsonResponse
    {
        return response()->json(
            $patientRecord->load(['visits' => function ($q) {
                $q->with('doctor:id,name')->latest('visit_date');
            }])
        );
    }

    public function update(Request $request, PatientRecord $patientRecord): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);

        $patientRecord->update($validated);

        return response()->json($patientRecord);
    }

    public function destroy(PatientRecord $patientRecord): JsonResponse
    {
        $patientRecord->delete();
        return response()->json(['message' => 'Patient record deleted successfully']);
    }
}
