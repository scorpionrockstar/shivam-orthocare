<?php

namespace App\Http\Controllers\Api\PublicApi;

use App\Http\Controllers\Controller;
use App\Models\InsurancePartner;
use Illuminate\Http\JsonResponse;

class InsurancePartnerController extends Controller
{
    public function index(): JsonResponse
    {
        $partners = InsurancePartner::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($partners);
    }
}
