'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getImageUrl } from '@/lib/api';
import type { GalleryImage, PaginatedResponse } from '@/lib/types';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { Loader2, Upload, Trash2, X } from 'lucide-react';

export default function GalleryAdminPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery<PaginatedResponse<GalleryImage>>({
    queryKey: ['admin-gallery'],
    queryFn: async () => (await api.get('/admin/gallery', { params: { per_page: 50 } })).data,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/gallery/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-gallery'] }),
  });

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images[]', f));
    if (category) formData.append('category', category);
    try {
      await api.post('/admin/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch { /* ignore */ }
    setUploading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <div className="flex items-center gap-3">
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="px-3 py-2 border rounded-lg text-sm w-32" />
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Images
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.data.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border">
              <Image src={getImageUrl(img.image_path)} alt={img.title || 'Gallery'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(img.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {img.category && (
                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">{img.category}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
