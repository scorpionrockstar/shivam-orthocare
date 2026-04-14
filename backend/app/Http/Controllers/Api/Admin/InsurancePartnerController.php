<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\InsurancePartner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InsurancePartnerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $partners = InsurancePartner::orderBy('sort_order')->paginate($request->get('per_page', 30));
        return response()->json($partners);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website_url' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('insurance', 'public');
        }

        $partner = InsurancePartner::create($validated);
        return response()->json($partner, 201);
    }

    public function show(InsurancePartner $insurancePartner): JsonResponse
    {
        return response()->json($insurancePartner);
    }

    public function update(Request $request, InsurancePartner $insurancePartner): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'website_url' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('insurance', 'public');
        }

        $insurancePartner->update($validated);
        return response()->json($insurancePartner);
    }

    public function destroy(InsurancePartner $insurancePartner): JsonResponse
    {
        $insurancePartner->delete();
        return response()->json(['message' => 'Insurance partner deleted successfully']);
    }
}
