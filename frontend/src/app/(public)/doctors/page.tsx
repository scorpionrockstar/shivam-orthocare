'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getImageUrl } from '@/lib/api';
import type { Doctor } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Briefcase, Loader2 } from 'lucide-react';

export default function DoctorsPage() {
  const { data: doctors, isLoading } = useQuery<Doctor[]>({
    queryKey: ['doctors'],
    queryFn: async () => (await api.get('/doctors')).data,
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Our <span className="text-primary">Doctors</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Meet our team of experienced orthopedic specialists committed to providing
            the best care for your bone and joint health.
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors?.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] bg-primary-50 relative">
                    {doctor.photo ? (
                      <Image
                        src={getImageUrl(doctor.photo)}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary">
                            {doctor.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-primary font-medium text-sm">{doctor.specialization}</p>
                    <p className="text-gray-500 text-sm mt-1">{doctor.qualifications}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {doctor.experience_years} yrs exp
                      </span>
                      {doctor.available_time_start && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {doctor.available_time_start} - {doctor.available_time_end}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/book-appointment"
                      className="block mt-4 text-center bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
                    >
                      Book Appointment
                    </Link>
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
