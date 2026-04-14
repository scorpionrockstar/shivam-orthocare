export interface Doctor {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
  qualifications: string;
  specialization: string;
  experience_years: number;
  bio: string | null;
  consultation_fee: string | null;
  available_days: string[] | null;
  available_time_start: string | null;
  available_time_end: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Appointment {
  id: number;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  admin_notes: string | null;
  doctor?: Doctor;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: number;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  views_count: number;
  author?: { id: number; name: string };
}

export interface Testimonial {
  id: number;
  patient_name: string;
  patient_photo: string | null;
  rating: number;
  content: string;
  video_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface GalleryImage {
  id: number;
  title: string | null;
  image_path: string;
  category: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface InsurancePartner {
  id: number;
  name: string;
  logo: string | null;
  website_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  admin_notes: string | null;
  created_at: string;
}

export interface PatientRecord {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  address: string | null;
  medical_history: string | null;
  visits?: PatientVisit[];
  visits_count?: number;
}

export interface PatientVisit {
  id: number;
  patient_record_id: number;
  doctor_id: number;
  visit_date: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  next_visit_date: string | null;
  doctor?: { id: number; name: string };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'editor' | 'receptionist';
  avatar: string | null;
  is_active: boolean;
}

export interface DashboardData {
  stats: {
    today_appointments: number;
    pending_appointments: number;
    total_patients: number;
    unread_inquiries: number;
    total_doctors: number;
    total_blog_views: number;
  };
  recent_appointments: Appointment[];
  recent_inquiries: ContactInquiry[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Settings {
  [key: string]: string;
}
