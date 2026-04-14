'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Testimonial, PaginatedResponse } from '@/lib/types';
import { Loader2, Plus, Edit, Trash2, Star } from 'lucide-react';
import Link from 'next/link';

export default function TestimonialsAdminPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<PaginatedResponse<Testimonial>>({ queryKey: ['admin-testimonials'], queryFn: async () => (await api.get('/admin/testimonials')).data });
  const deleteMutation = useMutation({ mutationFn: async (id: number) => api.delete(`/admin/testimonials/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Add Testimonial</Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Patient</th><th className="text-left px-4 py-3 font-medium text-gray-600">Rating</th><th className="text-left px-4 py-3 font-medium text-gray-600">Content</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
            <tbody className="divide-y">
              {data?.data.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.patient_name}</td>
                  <td className="px-4 py-3"><div className="flex">{Array.from({length: t.rating}).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div></td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{t.content}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{t.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Link href={`/admin/testimonials/${t.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link><button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(t.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
