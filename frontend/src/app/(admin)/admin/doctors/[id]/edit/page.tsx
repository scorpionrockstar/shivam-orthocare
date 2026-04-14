'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Doctor } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [error, setError] = useState('');

  const { data: doctor, isLoading } = useQuery<Doctor>({
    queryKey: ['admin-doctor', id],
    queryFn: async () => (await api.get(`/admin/doctors/${id}`)).data,
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications,
        experience_years: doctor.experience_years,
        consultation_fee: doctor.consultation_fee,
        bio: doctor.bio || '',
        available_time_start: doctor.available_time_start || '',
        available_time_end: doctor.available_time_end || '',
        available_days: doctor.available_days?.join(',') || '',
        is_active: doctor.is_active,
      });
    }
  }, [doctor, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => api.post(`/admin/doctors/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => router.push('/admin/doctors'),
    onError: () => setError('Failed to update doctor'),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photo' && value instanceof FileList && value.length > 0) {
        formData.append('photo', value[0]);
      } else if (key === 'available_days' && typeof value === 'string') {
        (value as string).split(',').filter(Boolean).forEach((d, i) => formData.append(`available_days[${i}]`, d.trim()));
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/doctors" className="inline-flex items-center gap-1 text-primary mb-4 hover:gap-2 transition-all text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Doctors
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Doctor</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input {...register('name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
            <input {...register('specialization')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications *</label>
          <input {...register('qualifications')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
            <input type="number" {...register('experience_years')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
            <input type="number" step="0.01" {...register('consultation_fee')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea {...register('bio')} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Start</label>
            <input type="time" {...register('available_time_start')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Time End</label>
            <input type="time" {...register('available_time_end')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
          <input {...register('available_days')} placeholder="Mon,Tue,Wed,Thu,Fri,Sat" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input type="file" accept="image/*" {...register('photo')} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Doctor
        </button>
      </form>
    </div>
  );
}
