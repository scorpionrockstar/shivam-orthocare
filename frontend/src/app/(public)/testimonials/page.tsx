'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getImageUrl } from '@/lib/api';
import type { Testimonial } from '@/lib/types';
import Image from 'next/image';
import { Star, Loader2 } from 'lucide-react';

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => (await api.get('/testimonials')).data,
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Patient <span className="text-primary">Testimonials</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Hear from our patients about their experience at Shivam OrthoCare.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials?.map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  {t.video_url && (
                    <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={t.video_url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                    {t.patient_photo ? (
                      <Image
                        src={getImageUrl(t.patient_photo)}
                        alt={t.patient_name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">{t.patient_name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{t.patient_name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
