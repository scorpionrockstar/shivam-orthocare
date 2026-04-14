'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User, PaginatedResponse } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

const roleBadge: Record<string, string> = { admin: 'bg-purple-100 text-purple-700', editor: 'bg-blue-100 text-blue-700', receptionist: 'bg-green-100 text-green-700' };

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<PaginatedResponse<User>>({ queryKey: ['admin-users', page], queryFn: async () => (await api.get('/admin/users', { params: { page } })).data });
  const deleteMutation = useMutation({ mutationFn: async (id: number) => api.delete(`/admin/users/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }) });

  useEffect(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); if (u.id) setCurrentUserId(u.id); } catch {} }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link href="/admin/users/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> Add User</Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Name</th><th className="text-left px-4 py-3 font-medium text-gray-600">Email</th><th className="text-left px-4 py-3 font-medium text-gray-600">Role</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
            <tbody className="divide-y">
              {data?.data.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadge[u.role] || ''}`}>{u.role}</span></td>
                  <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <Link href={`/admin/users/${u.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link>
                    {u.id !== currentUserId && <button onClick={() => { if (confirm('Delete this user?')) deleteMutation.mutate(u.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data && data.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.last_page }, (_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-primary text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
