<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'title' => 'Joint Replacement',
                'short_description' => 'Advanced knee and hip joint replacement surgery for pain-free mobility and improved quality of life.',
                'description' => '<p>Our joint replacement program offers state-of-the-art total and partial knee and hip replacement surgeries. Using the latest surgical techniques and implant technologies, we help patients regain their mobility and live pain-free lives.</p><p>We specialize in minimally invasive approaches that ensure faster recovery, less pain, and better outcomes.</p>',
                'icon' => 'Activity',
            ],
            [
                'title' => 'Fracture Treatment',
                'short_description' => 'Expert fracture care with modern fixation techniques for quick healing and recovery.',
                'description' => '<p>We provide comprehensive fracture treatment including emergency fracture care, surgical fixation using plates, screws, and intramedullary nails, as well as non-surgical management with casts and splints.</p><p>Our team ensures accurate diagnosis with digital X-rays and CT scans, followed by the most appropriate treatment plan for optimal healing.</p>',
                'icon' => 'Bone',
            ],
            [
                'title' => 'Sports Injury Treatment',
                'short_description' => 'Specialized treatment for sports-related injuries including ligament tears, tendon injuries, and more.',
                'description' => '<p>Our sports medicine program covers the full spectrum of sports-related injuries. From ACL reconstruction and meniscus repair to rotator cuff surgery and tennis elbow treatment, we help athletes get back to their game.</p><p>We combine surgical expertise with rehabilitation programs tailored to each patient\'s sport and fitness goals.</p>',
                'icon' => 'Dumbbell',
            ],
            [
                'title' => 'Spine Care',
                'short_description' => 'Comprehensive spine care for back pain, disc problems, and spinal deformities.',
                'description' => '<p>Our spine care services include treatment for herniated discs, spinal stenosis, scoliosis, and degenerative disc disease. We offer both conservative management and surgical options including minimally invasive spine surgery.</p><p>Our multidisciplinary approach ensures comprehensive care from diagnosis through rehabilitation.</p>',
                'icon' => 'Spine',
            ],
            [
                'title' => 'Physiotherapy & Rehabilitation',
                'short_description' => 'Professional physiotherapy services for post-surgical recovery and chronic pain management.',
                'description' => '<p>Our physiotherapy department offers a wide range of rehabilitation services including post-operative rehab, pain management, manual therapy, electrotherapy, and exercise-based programs.</p><p>Our experienced physiotherapists create personalized treatment plans to help you recover faster and stronger.</p>',
                'icon' => 'HeartPulse',
            ],
            [
                'title' => 'Arthroscopy',
                'short_description' => 'Minimally invasive arthroscopic surgery for joint diagnosis and treatment.',
                'description' => '<p>Arthroscopy is a minimally invasive surgical procedure used to diagnose and treat problems within joints. We perform arthroscopic procedures on knee, shoulder, ankle, and other joints.</p><p>Benefits include smaller incisions, less pain, faster recovery, and better cosmetic outcomes compared to open surgery.</p>',
                'icon' => 'Microscope',
            ],
            [
                'title' => 'Pediatric Orthopedics',
                'short_description' => 'Specialized orthopedic care for children including fractures, deformities, and growth-related conditions.',
                'description' => '<p>Children are not just small adults — their growing bodies need specialized orthopedic care. We treat congenital conditions, growth plate injuries, fractures, limb deformities, and other pediatric musculoskeletal problems.</p><p>Our gentle approach and child-friendly environment ensure your little ones receive the best care.</p>',
                'icon' => 'Baby',
            ],
            [
                'title' => 'Pain Management',
                'short_description' => 'Advanced pain management solutions for chronic orthopedic pain conditions.',
                'description' => '<p>We offer comprehensive pain management services including joint injections, nerve blocks, PRP therapy, and other interventional pain procedures. Our goal is to reduce pain and improve function while minimizing the need for surgery.</p><p>We take a holistic approach combining medications, injections, physical therapy, and lifestyle modifications.</p>',
                'icon' => 'Shield',
            ],
        ];

        foreach ($services as $index => $service) {
            Service::updateOrCreate(
                ['title' => $service['title']],
                array_merge($service, [
                    'slug' => Str::slug($service['title']),
                    'is_active' => true,
                    'sort_order' => $index,
                ])
            );
        }
    }
}
