'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema, type AppointmentFormData } from '@/lib/validations';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Doctor } from '@/lib/types';
import { useState } from 'react';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';

export default function BookAppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { data: doctors } = useQuery<Doctor[]>({
    queryKey: ['doctors'],
    queryFn: async () => (await api.get('/doctors')).data,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setError('');
      await api.post('/appointments', data);
      setSubmitted(true);
      reset();
    } catch {
      setError('Failed to book appointment. Please try again or call us directly.');
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Book an <span className="text-primary">Appointment</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Schedule your visit with our expert orthopedic specialists. Fill out the
            form below and we&apos;ll confirm your appointment shortly.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800">Appointment Booked!</h2>
              <p className="text-green-600 mt-2">
                We have received your appointment request. Our team will contact you
                shortly to confirm.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  {...register('patient_name')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Your full name"
                />
                {errors.patient_name && <p className="text-red-500 text-sm mt-1">{errors.patient_name.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    {...register('patient_phone')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="+91 98765 43210"
                  />
                  {errors.patient_phone && <p className="text-red-500 text-sm mt-1">{errors.patient_phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    {...register('patient_email')}
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="your@email.com"
                  />
                  {errors.patient_email && <p className="text-red-500 text-sm mt-1">{errors.patient_email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
                <select
                  {...register('doctor_id')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Choose a doctor</option>
                  {doctors?.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctor_id && <p className="text-red-500 text-sm mt-1">{errors.doctor_id.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input
                    {...register('appointment_date')}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.appointment_date && <p className="text-red-500 text-sm mt-1">{errors.appointment_date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                  <select
                    {...register('appointment_time')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select time</option>
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'].map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.appointment_time && <p className="text-red-500 text-sm mt-1">{errors.appointment_time.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Symptoms</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Briefly describe your symptoms or reason for visit..."
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</>
                ) : (
                  <><Calendar className="w-5 h-5" /> Book Appointment</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
