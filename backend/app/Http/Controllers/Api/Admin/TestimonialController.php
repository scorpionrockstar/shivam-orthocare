<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $testimonials = Testimonial::orderBy('sort_order')
            ->paginate($request->get('per_page', 15));

        return response()->json($testimonials);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string',
            'video_url' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'patient_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('patient_photo')) {
            $validated['patient_photo'] = app(CloudinaryService::class)->upload($request->file('patient_photo'), 'shivam-orthocare/testimonials');
        }

        $testimonial = Testimonial::create($validated);

        return response()->json($testimonial, 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'patient_name' => 'sometimes|string|max:255',
            'rating' => 'sometimes|integer|min:1|max:5',
            'content' => 'sometimes|string',
            'video_url' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'patient_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('patient_photo')) {
            $validated['patient_photo'] = app(CloudinaryService::class)->upload($request->file('patient_photo'), 'shivam-orthocare/testimonials');
        }

        $testimonial->update($validated);

        return response()->json($testimonial);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted successfully']);
    }
}
