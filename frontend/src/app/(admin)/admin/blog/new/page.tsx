'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => api.post('/admin/blog-posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => router.push('/admin/blog'),
    onError: () => setError('Failed to create post'),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'featured_image' && value instanceof FileList && value.length > 0) formData.append('featured_image', value[0]);
      else if (key === 'tags' && typeof value === 'string') (value as string).split(',').filter(Boolean).forEach((t, i) => formData.append(`tags[${i}]`, t.trim()));
      else if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
    });
    createMutation.mutate(formData);
  };

  return (
    <div>
      <Link href="/admin/blog" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border p-6 max-w-3xl space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input {...register('title', { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label><textarea {...register('excerpt')} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label><textarea {...register('content', { required: true })} rows={10} className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input {...register('category')} placeholder="e.g. Health Tips" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label><input {...register('tags')} placeholder="knee,pain,exercise" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label><input type="file" accept="image/*" {...register('featured_image')} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div className="flex items-center gap-2"><input type="checkbox" id="is_published" {...register('is_published')} className="w-4 h-4 rounded" /><label htmlFor="is_published" className="text-sm text-gray-700">Publish immediately</label></div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">{createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Post</button>
      </form>
    </div>
  );
}
