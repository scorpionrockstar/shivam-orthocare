'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PatientRecord, PaginatedResponse } from '@/lib/types';
import { useState } from 'react';
import { Loader2, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<PaginatedResponse<PatientRecord>>({ queryKey: ['admin-patients', page, search], queryFn: async () => (await api.get('/admin/patient-records', { params: { page, search: search || undefined } })).data });
  const deleteMutation = useMutation({ mutationFn: async (id: number) => api.delete(`/admin/patient-records/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-patients'] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
        <Link href="/admin/patients/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Add Patient</Link>
      </div>
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search patients..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Name</th><th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th><th className="text-left px-4 py-3 font-medium text-gray-600">Gender</th><th className="text-left px-4 py-3 font-medium text-gray-600">Visits</th><th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
            <tbody className="divide-y">
              {data?.data.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{p.gender || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.visits_count || 0}</td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <Link href={`/admin/patients/${p.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(p.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
