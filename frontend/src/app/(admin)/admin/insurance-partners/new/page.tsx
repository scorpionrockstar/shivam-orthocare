'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewInsurancePartnerPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit } = useForm();

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => api.post('/admin/insurance-partners', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => router.push('/admin/insurance-partners'),
    onError: () => setError('Failed to create insurance partner'),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof FileList && value.length > 0) {
        formData.append('logo', value[0]);
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
    createMutation.mutate(formData);
  };

  return (
    <div>
      <Link href="/admin/insurance-partners" className="inline-flex items-center gap-1 text-primary mb-4 hover:gap-2 transition-all text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Insurance Partners
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Insurance Partner</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
          <input {...register('website_url')} placeholder="https://example.com" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <input type="file" accept="image/*" {...register('logo')} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input type="number" {...register('sort_order')} defaultValue={0} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" {...register('is_active')} defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
          {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </form>
    </div>
  );
}
