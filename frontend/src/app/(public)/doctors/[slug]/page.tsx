'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api, { getImageUrl } from '@/lib/api';
import type { Doctor } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Briefcase, Loader2 } from 'lucide-react';

export default function DoctorDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: doctor, isLoading } = useQuery<Doctor>({
    queryKey: ['doctor', slug],
    queryFn: async () => (await api.get(`/doctors/${slug}`)).data,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/doctors" className="inline-flex items-center gap-1 text-primary mb-6 hover:gap-2 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="aspect-square bg-primary-50 rounded-xl relative overflow-hidden">
              {doctor.photo ? (
                <Image src={getImageUrl(doctor.photo)} alt={doctor.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary">{doctor.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-primary font-semibold mt-1">{doctor.specialization}</p>
            <p className="text-gray-600 mt-1">{doctor.qualifications}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-primary" />{doctor.experience_years} Years Experience</span>
              {doctor.available_time_start && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary" />{doctor.available_time_start} - {doctor.available_time_end}</span>
              )}
            </div>
            {doctor.available_days && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Available Days:</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.available_days.map((day) => (
                    <span key={day} className="px-3 py-1 bg-primary-50 text-primary text-xs rounded-full font-medium">{day}</span>
                  ))}
                </div>
              </div>
            )}
            {doctor.bio && <p className="mt-4 text-gray-600 leading-relaxed">{doctor.bio}</p>}
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <Calendar className="w-5 h-5" /> Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
