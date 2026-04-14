'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ContactInquiry, PaginatedResponse } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Loader2, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  unread: 'bg-yellow-100 text-yellow-700',
  read: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function InquiriesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<ContactInquiry>>({
    queryKey: ['admin-inquiries', page, status],
    queryFn: async () => (await api.get('/admin/contact-inquiries', { params: { page, status: status !== 'all' ? status : undefined } })).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/contact-inquiries/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Inquiries</h1>

      {/* Status Filter */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{inquiry.name}</td>
                    <td className="px-4 py-3 text-gray-600">{inquiry.email}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{inquiry.subject || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(inquiry.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/admin/inquiries/${inquiry.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => { if (confirm('Delete this inquiry?')) deleteMutation.mutate(inquiry.id); }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex justify-center gap-1 p-4 border-t">
            {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm ${p === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
