'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { InsurancePartner } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditInsurancePartnerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [error, setError] = useState('');

  const { data: partner, isLoading } = useQuery<InsurancePartner>({
    queryKey: ['admin-insurance-partner', id],
    queryFn: async () => (await api.get(`/admin/insurance-partners/${id}`)).data,
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (partner) {
      reset({
        name: partner.name,
        website_url: partner.website_url || '',
        sort_order: partner.sort_order,
        is_active: partner.is_active,
      });
    }
  }, [partner, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => api.post(`/admin/insurance-partners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => router.push('/admin/insurance-partners'),
    onError: () => setError('Failed to update insurance partner'),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof FileList && value.length > 0) {
        formData.append('logo', value[0]);
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/insurance-partners" className="inline-flex items-center gap-1 text-primary mb-4 hover:gap-2 transition-all text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Insurance Partners
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Insurance Partner</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input {...register('name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
          <input {...register('website_url')} placeholder="https://example.com" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          {partner?.logo && <p className="text-xs text-gray-500 mb-1">Current: {partner.logo}</p>}
          <input type="file" accept="image/*" {...register('logo')} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input type="number" {...register('sort_order')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update
        </button>
      </form>
    </div>
  );
}
