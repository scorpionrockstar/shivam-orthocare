'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

type SettingsData = Record<string, Record<string, string>>;

const TABS = [
  { key: 'general', label: 'General' },
  { key: 'contact', label: 'Contact' },
  { key: 'hours', label: 'Working Hours' },
  { key: 'social', label: 'Social Media' },
];

const FIELDS: Record<string, { key: string; label: string; type?: string }[]> = {
  general: [
    { key: 'clinic_name', label: 'Clinic Name' },
    { key: 'clinic_tagline', label: 'Tagline' },
    { key: 'meta_title', label: 'SEO Title' },
    { key: 'meta_description', label: 'SEO Description', type: 'textarea' },
  ],
  contact: [
    { key: 'clinic_address', label: 'Address', type: 'textarea' },
    { key: 'clinic_phone', label: 'Phone' },
    { key: 'clinic_email', label: 'Email' },
    { key: 'google_maps_embed', label: 'Google Maps Embed URL', type: 'textarea' },
  ],
  hours: [
    { key: 'working_hours_weekday', label: 'Monday - Friday' },
    { key: 'working_hours_saturday', label: 'Saturday' },
    { key: 'working_hours_sunday', label: 'Sunday' },
  ],
  social: [
    { key: 'facebook_url', label: 'Facebook URL' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'youtube_url', label: 'YouTube URL' },
    { key: 'whatsapp_number', label: 'WhatsApp Number' },
  ],
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('general');
  const [values, setValues] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const { data, isLoading } = useQuery<SettingsData>({ queryKey: ['admin-settings'], queryFn: async () => (await api.get('/admin/settings')).data });

  useEffect(() => {
    if (data) {
      const flat: Record<string, string> = {};
      Object.values(data).forEach((group) => { Object.entries(group).forEach(([k, v]) => { flat[k] = v || ''; }); });
      setValues(flat);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (group: string) => {
      const fields = FIELDS[group];
      const settings = fields.map((f) => ({ key: f.key, value: values[f.key] || '', group }));
      return api.put('/admin/settings', { settings });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-settings'] }); setSuccess('Settings saved!'); setTimeout(() => setSuccess(''), 3000); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="flex border-b">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
          ))}
        </div>
        <div className="p-6 space-y-4 max-w-2xl">
          {FIELDS[tab]?.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea value={values[field.key] || ''} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
              ) : (
                <input value={values[field.key] || ''} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              )}
            </div>
          ))}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button onClick={() => updateMutation.mutate(tab)} disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save {TABS.find((t) => t.key === tab)?.label}
          </button>
        </div>
      </div>
    </div>
  );
}
