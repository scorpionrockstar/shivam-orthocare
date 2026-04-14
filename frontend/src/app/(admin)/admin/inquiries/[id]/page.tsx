'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ContactInquiry } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, Mail, Phone, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  unread: 'bg-yellow-100 text-yellow-700',
  read: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function InquiryDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: inquiry, isLoading } = useQuery<ContactInquiry>({
    queryKey: ['admin-inquiry', id],
    queryFn: async () => (await api.get(`/admin/contact-inquiries/${id}`)).data,
  });

  const updateStatus = useMutation({
    mutationFn: async (newStatus: string) => api.put(`/admin/contact-inquiries/${id}`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiry', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!inquiry) return <div className="text-center py-12 text-gray-500">Inquiry not found</div>;

  return (
    <div>
      <Link href="/admin/inquiries" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Inquiries
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiry Detail</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[inquiry.status]}`}>
          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
        </span>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{inquiry.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">{inquiry.phone || '-'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(inquiry.created_at)}</p>
          </div>
        </div>

        {inquiry.subject && (
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-1">Subject</p>
            <p className="text-sm font-medium text-gray-900">{inquiry.subject}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500">Message</p>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        {inquiry.admin_notes && (
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.admin_notes}</p>
          </div>
        )}
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {(['unread', 'read', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => updateStatus.mutate(s)}
              disabled={inquiry.status === s || updateStatus.isPending}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inquiry.status === s
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : s === 'read' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : s === 'resolved' ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              {updateStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
              Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
