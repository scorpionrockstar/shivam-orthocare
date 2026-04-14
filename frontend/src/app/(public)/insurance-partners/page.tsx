'use client';

import { useQuery } from '@tanstack/react-query';
import api, { getImageUrl } from '@/lib/api';
import type { InsurancePartner } from '@/lib/types';
import Image from 'next/image';
import { Loader2, ExternalLink } from 'lucide-react';

export default function InsurancePartnersPage() {
  const { data: partners, isLoading } = useQuery<InsurancePartner[]>({
    queryKey: ['insurance-partners'],
    queryFn: async () => (await api.get('/insurance-partners')).data,
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Insurance <span className="text-primary">Partners</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            We accept a wide range of insurance plans. Check if your insurance is listed below.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : partners && partners.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  {partner.logo ? (
                    <div className="w-24 h-24 relative mb-3">
                      <Image
                        src={getImageUrl(partner.logo)}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-primary">{partner.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                  {partner.description && (
                    <p className="text-sm text-gray-600 mt-1">{partner.description}</p>
                  )}
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Insurance partner information will be updated soon.</p>
              <p className="mt-2">Please contact us for insurance-related queries.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
