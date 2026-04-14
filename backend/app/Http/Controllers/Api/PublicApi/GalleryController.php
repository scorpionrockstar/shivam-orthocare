<?php

namespace App\Http\Controllers\Api\PublicApi;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GalleryImage::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $images = $query->orderBy('sort_order')->get();

        return response()->json($images);
    }
}
