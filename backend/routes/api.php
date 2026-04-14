<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Api\Admin\BlogPostController as AdminBlogPostController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Api\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Api\Admin\InsurancePartnerController as AdminInsurancePartnerController;
use App\Http\Controllers\Api\Admin\PatientRecordController;
use App\Http\Controllers\Api\Admin\PatientVisitController;
use App\Http\Controllers\Api\Admin\ContactInquiryController as AdminContactInquiryController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\UserController;

use App\Http\Controllers\Api\PublicApi\ServiceController;
use App\Http\Controllers\Api\PublicApi\DoctorController;
use App\Http\Controllers\Api\PublicApi\BlogPostController;
use App\Http\Controllers\Api\PublicApi\TestimonialController;
use App\Http\Controllers\Api\PublicApi\GalleryController;
use App\Http\Controllers\Api\PublicApi\FaqController;
use App\Http\Controllers\Api\PublicApi\InsurancePartnerController;
use App\Http\Controllers\Api\PublicApi\AppointmentController;
use App\Http\Controllers\Api\PublicApi\ContactInquiryController;
use App\Http\Controllers\Api\PublicApi\SettingController;

// Public routes
Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public read-only
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{slug}', [DoctorController::class, 'show']);
    Route::get('/blog', [BlogPostController::class, 'index']);
    Route::get('/blog/{slug}', [BlogPostController::class, 'show']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/faqs', [FaqController::class, 'index']);
    Route::get('/insurance-partners', [InsurancePartnerController::class, 'index']);
    Route::get('/settings', [SettingController::class, 'index']);

    // Public write
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::post('/contact', [ContactInquiryController::class, 'store']);

    // Admin routes (JWT protected)
    Route::middleware(['jwt.auth'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);

        Route::apiResource('appointments', AdminAppointmentController::class)->only(['index', 'show', 'destroy']);
        Route::patch('/appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus']);

        Route::apiResource('doctors', AdminDoctorController::class);
        Route::apiResource('services', AdminServiceController::class);
        Route::apiResource('blog-posts', AdminBlogPostController::class);
        Route::apiResource('testimonials', AdminTestimonialController::class);
        Route::apiResource('faqs', AdminFaqController::class);
        Route::apiResource('insurance-partners', AdminInsurancePartnerController::class);
        Route::apiResource('patient-records', PatientRecordController::class);
        Route::apiResource('patient-records.visits', PatientVisitController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('contact-inquiries', AdminContactInquiryController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::apiResource('gallery', AdminGalleryController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // Users (admin only)
        Route::middleware(['role:admin'])->group(function () {
            Route::apiResource('users', UserController::class);
        });
    });
});
