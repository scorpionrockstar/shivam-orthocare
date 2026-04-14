'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Testimonial } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditTestimonialPage() {
  const router = useRouter();
  const { id } = useParams();
  const [error, setError] = useState('');
  const { data, isLoading } = useQuery<Testimonial>({ queryKey: ['admin-testimonial', id], queryFn: async () => (await api.get(`/admin/testimonials/${id}`)).data });
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (data) reset({ patient_name: data.patient_name, rating: data.rating, content: data.content, video_url: data.video_url || '', is_featured: data.is_featured, is_active: data.is_active }); }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => api.post(`/admin/testimonials/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => router.push('/admin/testimonials'),
    onError: () => setError('Failed to update'),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'patient_photo' && value instanceof FileList && value.length > 0) formData.append('patient_photo', value[0]);
      else if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
    });
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/testimonials" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Testimonial</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label><input {...register('patient_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label><select {...register('rating')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label><textarea {...register('content')} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label><input {...register('video_url')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Photo</label><input type="file" accept="image/*" {...register('patient_photo')} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="flex gap-4"><div className="flex items-center gap-2"><input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded" /><label className="text-sm text-gray-700">Featured</label></div><div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded" /><label className="text-sm text-gray-700">Active</label></div></div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update</button>
      </form>
    </div>
  );
}
