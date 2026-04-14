'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Faq } from '@/lib/types';
import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FaqPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ['faqs'],
    queryFn: async () => (await api.get('/faqs')).data,
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Find answers to common questions about our services, appointments, and treatments.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {faqs?.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                        openId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openId === faq.id && (
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center p-8 bg-primary-50 rounded-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">Contact us and we&apos;ll be happy to help.</p>
            <Link
              href="/contact"
              className="inline-flex bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
