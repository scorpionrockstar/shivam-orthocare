<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::with('author:id,name');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $posts = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'is_published' => 'boolean',
            'featured_image' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['author_id'] = auth()->id();

        if ($request->boolean('is_published')) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = app(CloudinaryService::class)->upload($request->file('featured_image'), 'shivam-orthocare/blog');
        }

        $post = BlogPost::create($validated);

        return response()->json($post->load('author:id,name'), 201);
    }

    public function show(BlogPost $blogPost): JsonResponse
    {
        return response()->json($blogPost->load('author:id,name'));
    }

    public function update(Request $request, BlogPost $blogPost): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'sometimes|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'is_published' => 'boolean',
            'featured_image' => 'nullable|image|max:2048',
        ]);

        if ($request->boolean('is_published') && !$blogPost->published_at) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = app(CloudinaryService::class)->upload($request->file('featured_image'), 'shivam-orthocare/blog');
        }

        $blogPost->update($validated);

        return response()->json($blogPost->load('author:id,name'));
    }

    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $blogPost->delete();
        return response()->json(['message' => 'Blog post deleted successfully']);
    }
}
