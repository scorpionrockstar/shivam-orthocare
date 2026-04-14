'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [error, setError] = useState('');
  const { data: user, isLoading } = useQuery<User>({ queryKey: ['admin-user', id], queryFn: async () => (await api.get(`/admin/users/${id}`)).data });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (user) reset({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, is_active: user.is_active }); }, [user, reset]);

  const updateMutation = useMutation({ mutationFn: async (data: Record<string, unknown>) => { const payload = { ...data }; if (!payload.password) delete payload.password; return api.put(`/admin/users/${id}`, payload); }, onSuccess: () => router.push('/admin/users'), onError: (e: any) => setError(e.response?.data?.message || 'Failed to update user') });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit User: {user?.name}</h1>
      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="bg-white rounded-xl border p-6 max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" {...register('email', { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-gray-400 font-normal">(leave blank to keep)</span></label><input type="password" {...register('password')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input {...register('phone')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select {...register('role')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="admin">Admin</option><option value="editor">Editor</option><option value="receptionist">Receptionist</option></select></div>
          <div className="flex items-center pt-6"><label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"><input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" /> Active</label></div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">{updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update</button>
      </form>
    </div>
  );
}
