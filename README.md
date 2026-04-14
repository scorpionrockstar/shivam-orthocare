# Shivam OrthoCare

Full-stack website for Shivam OrthoCare, Una - an orthopedic clinic in Gujarat, India.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Backend**: Laravel 13 (REST API, JWT auth)
- **Database**: MySQL
- **Admin Panel**: Integrated into Next.js under `/admin`

## Features

### Public Website (11 pages)
Home, About, Services, Doctors, Gallery, Contact, Book Appointment, Blog, Testimonials, FAQ, Insurance Partners

### Admin Panel
- Dashboard with analytics
- CRUD for doctors, services, blog posts, testimonials, gallery, FAQs, insurance partners
- Appointment management with status tracking
- Patient records with visit history
- Contact inquiry management
- User management (admin/editor/receptionist roles)
- Website settings (clinic info, contact, hours, social media)

## Local Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
# Edit .env with your database credentials
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login
  - Email: `admin@shivamorthocare.com`
  - Password: `password`

## Deployment

- **Frontend**: Vercel (connect GitHub repo, set env vars)
- **Backend**: Render (connect GitHub repo, set env vars)
- **Database**: Aiven / PlanetScale (free MySQL tier)
- **Images**: Cloudinary (optional, for production image hosting)

## License

Proprietary - All rights reserved.
