'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api, { getImageUrl } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Eye, User, Loader2 } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog-post', slug],
    queryFn: async () => (await api.get(`/blog/${slug}`)).data,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-1 text-primary mb-6 hover:gap-2 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {post.category && (
          <span className="inline-block bg-primary-50 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
            {post.category}
          </span>
        )}

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          {post.author && (
            <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author.name}</span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.published_at)}</span>
          )}
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views_count} views</span>
        </div>

        {post.featured_image && (
          <div className="mt-8 aspect-[16/9] relative rounded-xl overflow-hidden">
            <Image src={getImageUrl(post.featured_image)} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div
          className="prose max-w-none mt-8 text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
