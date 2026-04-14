'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import type { Service } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['service', slug],
    queryFn: async () => (await api.get(`/services/${slug}`)).data,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Service not found</h2>
        <Link href="/services" className="text-primary mt-4 inline-block">Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-1 text-primary mb-4 hover:gap-2 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{service.title}</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">{service.short_description}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
          <div className="mt-12 p-6 bg-primary-50 rounded-xl text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Need {service.title} Treatment?
            </h3>
            <p className="text-gray-600 mb-4">
              Book a consultation with our specialists today.
            </p>
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
