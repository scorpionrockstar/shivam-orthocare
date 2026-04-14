'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getImageUrl } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';
import Image from 'next/image';
import { useState } from 'react';
import { Loader2, X } from 'lucide-react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['gallery'],
    queryFn: async () => (await api.get('/gallery')).data,
  });

  const categories = ['all', ...new Set(images?.map((img) => img.category).filter(Boolean) as string[])];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images?.filter((img) => img.category === selectedCategory);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Take a look at our clinic, facilities, equipment, and events.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages?.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setLightboxImage(image.image_path)}
                  className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={getImageUrl(image.image_path)}
                    alt={image.title || 'Gallery'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">{image.title}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
            <Image
              src={getImageUrl(lightboxImage)}
              alt="Gallery"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
