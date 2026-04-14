'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardData } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  Calendar, Users, MessageSquare, Eye, Stethoscope,
  Loader2, ArrowRight, Clock,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-700',
  unread: 'bg-red-100 text-red-700',
  read: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Today's Appointments", value: data.stats.today_appointments, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Appointments', value: data.stats.pending_appointments, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Patients', value: data.stats.total_patients, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Unread Inquiries', value: data.stats.unread_inquiries, icon: MessageSquare, color: 'bg-red-50 text-red-600' },
    { label: 'Active Doctors', value: data.stats.total_doctors, icon: Stethoscope, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Blog Views', value: data.stats.total_blog_views, icon: Eye, color: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
            <Link href="/admin/appointments" className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {data.recent_appointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{apt.patient_name}</p>
                  <p className="text-xs text-gray-500">{apt.doctor?.name} &middot; {formatDate(apt.appointment_date)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {data.recent_appointments.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No appointments yet</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {data.recent_inquiries.slice(0, 5).map((inq) => (
              <div key={inq.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 text-sm">{inq.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inq.status]}`}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{inq.subject || inq.message}</p>
              </div>
            ))}
            {data.recent_inquiries.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No inquiries yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
