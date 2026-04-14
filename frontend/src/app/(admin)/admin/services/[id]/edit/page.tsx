'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Service } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [error, setError] = useState('');

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: ['admin-service', id],
    queryFn: async () => (await api.get(`/admin/services/${id}`)).data,
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (service) reset({ title: service.title, short_description: service.short_description, description: service.description, icon: service.icon || '', is_active: service.is_active }); }, [service, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => api.post(`/admin/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => router.push('/admin/services'),
    onError: () => setError('Failed to update service'),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value instanceof FileList && value.length > 0) formData.append('image', value[0]);
      else if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
    });
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/services" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Service</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input {...register('title')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label><textarea {...register('short_description')} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (HTML) *</label><textarea {...register('description')} rows={6} className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label><input {...register('icon')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label><input type="file" accept="image/*" {...register('image')} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        </div>
        <div className="flex items-center gap-2"><input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 rounded" /><label htmlFor="is_active" className="text-sm text-gray-700">Active</label></div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Service</button>
      </form>
    </div>
  );
}
