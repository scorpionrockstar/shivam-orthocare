<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'clinic_name', 'value' => 'Shivam OrthoCare', 'group' => 'general'],
            ['key' => 'clinic_tagline', 'value' => 'Expert Orthopedic Care in Una', 'group' => 'general'],
            ['key' => 'meta_title', 'value' => 'Shivam OrthoCare, Una | Best Orthopedic Clinic', 'group' => 'general'],
            ['key' => 'meta_description', 'value' => 'Shivam OrthoCare provides expert orthopedic care in Una, Gujarat. Specializing in joint replacement, fracture treatment, sports injuries, spine care, and physiotherapy.', 'group' => 'general'],

            ['key' => 'clinic_address', 'value' => 'Una, Gujarat, India', 'group' => 'contact'],
            ['key' => 'clinic_phone', 'value' => '+91 9876543210', 'group' => 'contact'],
            ['key' => 'clinic_email', 'value' => 'info@shivamorthocare.com', 'group' => 'contact'],
            ['key' => 'google_maps_embed', 'value' => '', 'group' => 'contact'],

            ['key' => 'working_hours_weekday', 'value' => '9:00 AM - 7:00 PM', 'group' => 'hours'],
            ['key' => 'working_hours_saturday', 'value' => '9:00 AM - 2:00 PM', 'group' => 'hours'],
            ['key' => 'working_hours_sunday', 'value' => 'Closed', 'group' => 'hours'],

            ['key' => 'facebook_url', 'value' => '', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => '', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => '', 'group' => 'social'],
            ['key' => 'whatsapp_number', 'value' => '', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
