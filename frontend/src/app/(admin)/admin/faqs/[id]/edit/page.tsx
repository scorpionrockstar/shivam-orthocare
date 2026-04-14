'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Faq } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditFaqPage() {
  const router = useRouter();
  const { id } = useParams();
  const [error, setError] = useState('');
  const { data, isLoading } = useQuery<Faq>({ queryKey: ['admin-faq', id], queryFn: async () => (await api.get(`/admin/faqs/${id}`)).data });
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (data) reset({ question: data.question, answer: data.answer, category: data.category || '', is_active: data.is_active }); }, [data, reset]);
  const updateMutation = useMutation({ mutationFn: async (formData: Record<string, unknown>) => api.put(`/admin/faqs/${id}`, formData), onSuccess: () => router.push('/admin/faqs'), onError: () => setError('Failed') });
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/faqs" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit FAQ</h1>
      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Question</label><input {...register('question')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Answer</label><textarea {...register('answer')} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input {...register('category')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div className="flex items-center gap-2"><input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded" /><label className="text-sm text-gray-700">Active</label></div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update</button>
      </form>
    </div>
  );
}
