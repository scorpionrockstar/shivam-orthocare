'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { BlogPost, PaginatedResponse } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Loader2, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function BlogAdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<BlogPost>>({
    queryKey: ['admin-blog', page, search],
    queryFn: async () => (await api.get('/admin/blog-posts', { params: { page, search: search || undefined } })).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/blog-posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blog'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"><Plus className="w-4 h-4" /> New Post</Link>
      </div>
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search posts..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Title</th><th className="text-left px-4 py-3 font-medium text-gray-600">Category</th><th className="text-left px-4 py-3 font-medium text-gray-600">Author</th><th className="text-left px-4 py-3 font-medium text-gray-600">Views</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-left px-4 py-3 font-medium text-gray-600">Date</th><th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
              <tbody className="divide-y">
                {data?.data.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3 text-gray-600">{post.category || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{post.author?.name}</td>
                    <td className="px-4 py-3 text-gray-600 flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views_count}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{post.is_published ? 'Published' : 'Draft'}</span></td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{post.published_at ? formatDate(post.published_at) : '-'}</td>
                    <td className="px-4 py-3"><div className="flex gap-1"><Link href={`/admin/blog/${post.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Link><button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(post.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
