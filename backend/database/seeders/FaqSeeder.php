<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['question' => 'What are the clinic timings?', 'answer' => 'Our clinic is open Monday to Friday from 9:00 AM to 7:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.', 'category' => 'General'],
            ['question' => 'Do I need an appointment to visit?', 'answer' => 'While walk-ins are welcome, we recommend booking an appointment to avoid wait times. You can book online through our website or call us directly.', 'category' => 'General'],
            ['question' => 'What insurance plans do you accept?', 'answer' => 'We accept most major insurance plans. Please visit our Insurance Partners page or contact our reception for specific details about your insurance coverage.', 'category' => 'General'],
            ['question' => 'How long does a joint replacement surgery take?', 'answer' => 'A typical joint replacement surgery takes 1-2 hours. Hospital stay is usually 3-5 days, and most patients can resume normal activities within 6-8 weeks.', 'category' => 'Treatment'],
            ['question' => 'What should I bring to my first appointment?', 'answer' => 'Please bring your ID, insurance card, any previous X-rays or MRI reports, a list of current medications, and your referral letter if applicable.', 'category' => 'General'],
            ['question' => 'Do you provide emergency orthopedic care?', 'answer' => 'Yes, we provide emergency fracture care and trauma management. Please call our emergency number for immediate assistance.', 'category' => 'Emergency'],
            ['question' => 'What is the recovery time after arthroscopy?', 'answer' => 'Recovery after arthroscopy is typically faster than open surgery. Most patients can walk within a day and return to normal activities within 2-4 weeks, depending on the procedure.', 'category' => 'Treatment'],
            ['question' => 'Do you offer physiotherapy services?', 'answer' => 'Yes, we have a fully equipped physiotherapy department with experienced physiotherapists. We offer post-surgical rehab, pain management, and customized exercise programs.', 'category' => 'Services'],
            ['question' => 'How can I book an appointment online?', 'answer' => 'You can book an appointment through our website by visiting the Book Appointment page, selecting your preferred doctor, date, and time slot.', 'category' => 'General'],
            ['question' => 'Is there parking available at the clinic?', 'answer' => 'Yes, we have ample parking space available for patients at our clinic premises.', 'category' => 'General'],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                array_merge($faq, [
                    'is_active' => true,
                    'sort_order' => $index,
                ])
            );
        }
    }
}
