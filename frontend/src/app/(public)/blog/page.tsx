'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getImageUrl } from '@/lib/api';
import type { BlogPost, PaginatedResponse } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Calendar, Eye, Loader2, User } from 'lucide-react';
import { useState } from 'react';

export default function BlogPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<PaginatedResponse<BlogPost>>({
    queryKey: ['blog', page],
    queryFn: async () => (await api.get(`/blog?page=${page}&per_page=9`)).data,
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Health <span className="text-primary">Blog</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Expert health tips, orthopedic advice, and the latest updates from Shivam OrthoCare.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[16/10] bg-primary-50 relative">
                      {post.featured_image ? (
                        <Image src={getImageUrl(post.featured_image)} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl text-primary/20 font-bold">S</span>
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.views_count} views
                        </span>
                        {post.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {post.author.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {data && data.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium text-sm ${
                        p === page
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
