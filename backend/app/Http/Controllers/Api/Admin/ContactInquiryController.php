<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactInquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactInquiry::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $inquiries = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($inquiries);
    }

    public function show(ContactInquiry $contactInquiry): JsonResponse
    {
        if ($contactInquiry->status === 'unread') {
            $contactInquiry->update(['status' => 'read']);
        }

        return response()->json($contactInquiry);
    }

    public function update(Request $request, ContactInquiry $contactInquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:unread,read,resolved',
            'admin_notes' => 'nullable|string',
        ]);

        $contactInquiry->update($validated);

        return response()->json($contactInquiry);
    }

    public function destroy(ContactInquiry $contactInquiry): JsonResponse
    {
        $contactInquiry->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}
