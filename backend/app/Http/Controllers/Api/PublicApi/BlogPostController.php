<?php

namespace App\Http\Controllers\Api\PublicApi;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::where('is_published', true)
            ->with('author:id,name');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $posts = $query->latest('published_at')
            ->paginate($request->get('per_page', 9));

        return response()->json($posts);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)
            ->where('is_published', true)
            ->with('author:id,name')
            ->firstOrFail();

        $post->increment('views_count');

        return response()->json($post);
    }
}
