<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\PatientRecord;
use App\Models\PatientVisit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientVisitController extends Controller
{
    public function store(Request $request, PatientRecord $patientRecord): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'next_visit_date' => 'nullable|date',
        ]);

        $validated['patient_record_id'] = $patientRecord->id;
        $visit = PatientVisit::create($validated);

        return response()->json($visit->load('doctor:id,name'), 201);
    }

    public function update(Request $request, PatientRecord $patientRecord, PatientVisit $visit): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|exists:doctors,id',
            'visit_date' => 'sometimes|date',
            'diagnosis' => 'nullable|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'next_visit_date' => 'nullable|date',
        ]);

        $visit->update($validated);

        return response()->json($visit->load('doctor:id,name'));
    }

    public function destroy(PatientRecord $patientRecord, PatientVisit $visit): JsonResponse
    {
        $visit->delete();
        return response()->json(['message' => 'Visit deleted successfully']);
    }
}
