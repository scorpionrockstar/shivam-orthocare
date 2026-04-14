<?php

namespace App\Http\Controllers\Api\PublicApi;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($services);
    }

    public function show(string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json($service);
    }
}
