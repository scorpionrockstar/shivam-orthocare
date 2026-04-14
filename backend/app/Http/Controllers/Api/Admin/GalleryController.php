<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GalleryImage::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $images = $query->orderBy('sort_order')->paginate($request->get('per_page', 30));

        return response()->json($images);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:5120',
            'category' => 'nullable|string|max:100',
        ]);

        $uploaded = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('gallery', 'public');
            $uploaded[] = GalleryImage::create([
                'title' => $request->title,
                'image_path' => $path,
                'category' => $request->category,
            ]);
        }

        return response()->json($uploaded, 201);
    }

    public function update(Request $request, GalleryImage $gallery): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $gallery->update($validated);

        return response()->json($gallery);
    }

    public function destroy(GalleryImage $gallery): JsonResponse
    {
        Storage::disk('public')->delete($gallery->image_path);
        $gallery->delete();
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
