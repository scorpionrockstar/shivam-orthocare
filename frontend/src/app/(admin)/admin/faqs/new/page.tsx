'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewFaqPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();
  const createMutation = useMutation({ mutationFn: async (data: Record<string, unknown>) => api.post('/admin/faqs', data), onSuccess: () => router.push('/admin/faqs'), onError: () => setError('Failed to create FAQ') });

  return (
    <div>
      <Link href="/admin/faqs" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add FAQ</h1>
      <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Question *</label><input {...register('question', { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label><textarea {...register('answer', { required: true })} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input {...register('category')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">{createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
      </form>
    </div>
  );
}
