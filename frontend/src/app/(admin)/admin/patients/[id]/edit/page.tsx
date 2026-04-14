'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PatientRecord, Doctor } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, Save, ArrowLeft, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function EditPatientPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [showVisitForm, setShowVisitForm] = useState(false);

  const { data: patient, isLoading } = useQuery<PatientRecord>({ queryKey: ['admin-patient', id], queryFn: async () => (await api.get(`/admin/patient-records/${id}`)).data });
  const { data: doctors } = useQuery<Doctor[]>({ queryKey: ['doctors'], queryFn: async () => (await api.get('/doctors')).data });

  const { register, handleSubmit, reset } = useForm();
  const { register: regVisit, handleSubmit: submitVisit, reset: resetVisit } = useForm();

  useEffect(() => { if (patient) reset({ name: patient.name, phone: patient.phone, email: patient.email || '', date_of_birth: patient.date_of_birth || '', gender: patient.gender || '', address: patient.address || '', medical_history: patient.medical_history || '' }); }, [patient, reset]);

  const updateMutation = useMutation({ mutationFn: async (data: Record<string, unknown>) => api.put(`/admin/patient-records/${id}`, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-patient', id] }); setError(''); }, onError: () => setError('Failed') });
  const addVisitMutation = useMutation({ mutationFn: async (data: Record<string, unknown>) => api.post(`/admin/patient-records/${id}/visits`, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-patient', id] }); setShowVisitForm(false); resetVisit(); } });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div>
      <Link href="/admin/patients" className="inline-flex items-center gap-1 text-primary mb-4 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient: {patient?.name}</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Patient Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input {...register('name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input {...register('phone')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input {...register('email')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">DOB</label><input type="date" {...register('date_of_birth')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label><textarea {...register('medical_history')} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" /></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={updateMutation.isPending} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50"><Save className="w-4 h-4" /> Update</button>
        </form>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Visit History</h2>
            <button onClick={() => setShowVisitForm(!showVisitForm)} className="inline-flex items-center gap-1 text-primary text-sm font-medium"><Plus className="w-4 h-4" /> Add Visit</button>
          </div>
          {showVisitForm && (
            <form onSubmit={submitVisit((data) => addVisitMutation.mutate(data))} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Doctor</label><select {...regVisit('doctor_id', { required: true })} className="w-full px-2 py-1.5 border rounded text-sm"><option value="">Select</option>{doctors?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Visit Date</label><input type="date" {...regVisit('visit_date', { required: true })} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Diagnosis</label><input {...regVisit('diagnosis')} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Treatment</label><input {...regVisit('treatment')} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Next Visit</label><input type="date" {...regVisit('next_visit_date')} className="w-full px-2 py-1.5 border rounded text-sm" /></div>
              <button type="submit" disabled={addVisitMutation.isPending} className="bg-primary text-white px-3 py-1.5 rounded text-sm font-medium">{addVisitMutation.isPending ? 'Saving...' : 'Save Visit'}</button>
            </form>
          )}
          <div className="space-y-3">
            {patient?.visits?.map((visit) => (
              <div key={visit.id} className="border rounded-lg p-3 text-sm">
                <div className="flex justify-between"><span className="font-medium">{formatDate(visit.visit_date)}</span><span className="text-gray-500">{visit.doctor?.name}</span></div>
                {visit.diagnosis && <p className="text-gray-600 mt-1"><strong>Diagnosis:</strong> {visit.diagnosis}</p>}
                {visit.treatment && <p className="text-gray-600"><strong>Treatment:</strong> {visit.treatment}</p>}
                {visit.next_visit_date && <p className="text-gray-500 text-xs mt-1">Next visit: {formatDate(visit.next_visit_date)}</p>}
              </div>
            ))}
            {(!patient?.visits || patient.visits.length === 0) && <p className="text-gray-500 text-sm">No visits recorded</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
