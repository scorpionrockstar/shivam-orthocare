'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { InsurancePartner, PaginatedResponse } from '@/lib/types';
import { useState } from 'react';
import { Loader2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function InsurancePartnersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<InsurancePartner>>({
    queryKey: ['admin-insurance-partners', page, search],
    queryFn: async () => (await api.get('/admin/insurance-partners', { params: { page, search: search || undefined } })).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/insurance-partners/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-insurance-partners'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insurance Partners</h1>
        <Link href="/admin/insurance-partners/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Add Partner
        </Link>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search insurance partners..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Sort Order</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{partner.name}</td>
                    <td className="px-4 py-3 text-gray-600">{partner.website_url || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${partner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {partner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{partner.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/admin/insurance-partners/${partner.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link>
                        <button onClick={() => { if (confirm('Delete this insurance partner?')) deleteMutation.mutate(partner.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${p === page ? 'bg-primary text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
