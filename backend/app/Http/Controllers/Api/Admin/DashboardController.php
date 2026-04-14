<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BlogPost;
use App\Models\ContactInquiry;
use App\Models\Doctor;
use App\Models\PatientRecord;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $today = Carbon::today();

        return response()->json([
            'stats' => [
                'today_appointments' => Appointment::whereDate('appointment_date', $today)->count(),
                'pending_appointments' => Appointment::where('status', 'pending')->count(),
                'total_patients' => PatientRecord::count(),
                'unread_inquiries' => ContactInquiry::where('status', 'unread')->count(),
                'total_doctors' => Doctor::where('is_active', true)->count(),
                'total_blog_views' => BlogPost::sum('views_count'),
            ],
            'recent_appointments' => Appointment::with('doctor:id,name')
                ->latest()
                ->take(10)
                ->get(),
            'recent_inquiries' => ContactInquiry::latest()
                ->take(10)
                ->get(),
        ]);
    }
}
