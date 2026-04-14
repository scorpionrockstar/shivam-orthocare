'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Faq, PaginatedResponse } from '@/lib/types';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FaqsAdminPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<PaginatedResponse<Faq>>({ queryKey: ['admin-faqs'], queryFn: async () => (await api.get('/admin/faqs', { params: { per_page: 30 } })).data });
  const deleteMutation = useMutation({ mutationFn: async (id: number) => api.delete(`/admin/faqs/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-faqs'] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <Link href="/admin/faqs/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Add FAQ</Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Question</th><th className="text-left px-4 py-3 font-medium text-gray-600">Category</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
            <tbody className="divide-y">
              {data?.data.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 max-w-md">{faq.question}</td>
                  <td className="px-4 py-3 text-gray-600">{faq.category || '-'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{faq.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Link href={`/admin/faqs/${faq.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link><button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(faq.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
