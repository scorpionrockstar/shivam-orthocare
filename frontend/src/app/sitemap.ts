import type { MetadataRoute } from 'next';

const BASE_URL = 'https://shivamorthocare.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/doctors`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/book-appointment`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/insurance-partners`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  // Fetch dynamic pages from API
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const [servicesRes, doctorsRes, blogRes] = await Promise.allSettled([
      fetch(`${API_URL}/services`).then((r) => r.json()),
      fetch(`${API_URL}/doctors`).then((r) => r.json()),
      fetch(`${API_URL}/blog-posts`).then((r) => r.json()),
    ]);

    if (servicesRes.status === 'fulfilled') {
      dynamicPages.push(
        ...servicesRes.value.map((s: { slug: string }) => ({
          url: `${BASE_URL}/services/${s.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      );
    }

    if (doctorsRes.status === 'fulfilled') {
      dynamicPages.push(
        ...doctorsRes.value.map((d: { slug: string }) => ({
          url: `${BASE_URL}/doctors/${d.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      );
    }

    if (blogRes.status === 'fulfilled') {
      const posts = blogRes.value.data || blogRes.value;
      dynamicPages.push(
        ...posts.map((p: { slug: string }) => ({
          url: `${BASE_URL}/blog/${p.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      );
    }
  } catch {
    // API unavailable — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
