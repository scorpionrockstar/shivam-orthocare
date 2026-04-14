import { z } from 'zod';

export const appointmentSchema = z.object({
  patient_name: z.string().min(2, 'Name is required'),
  patient_phone: z.string().min(10, 'Valid phone number required'),
  patient_email: z.string().email('Invalid email').optional().or(z.literal('')),
  doctor_id: z.string().min(1, 'Please select a doctor'),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
  message: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
