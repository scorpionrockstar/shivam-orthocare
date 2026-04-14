import Link from 'next/link';
import {
  Activity, Bone, Dumbbell, HeartPulse, Shield, Microscope,
  ArrowRight, Phone, Calendar, Star, Users, Award, Clock,
} from 'lucide-react';

const services = [
  { icon: Activity, title: 'Joint Replacement', desc: 'Advanced knee and hip replacement surgery for pain-free mobility.' },
  { icon: Bone, title: 'Fracture Treatment', desc: 'Expert fracture care with modern fixation techniques.' },
  { icon: Dumbbell, title: 'Sports Injuries', desc: 'Specialized treatment for sports-related injuries.' },
  { icon: HeartPulse, title: 'Physiotherapy', desc: 'Professional physiotherapy for recovery and pain management.' },
  { icon: Shield, title: 'Pain Management', desc: 'Advanced solutions for chronic orthopedic pain.' },
  { icon: Microscope, title: 'Arthroscopy', desc: 'Minimally invasive surgery for joint diagnosis and treatment.' },
];

const stats = [
  { icon: Users, value: '5000+', label: 'Happy Patients' },
  { icon: Award, value: '10+', label: 'Years Experience' },
  { icon: Activity, value: '2000+', label: 'Surgeries Done' },
  { icon: Star, value: '4.9', label: 'Patient Rating' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              Trusted Orthopedic Care in Una
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Expert{' '}
              <span className="text-primary">Orthopedic Care</span>{' '}
              for a Pain-Free Life
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
              At Shivam OrthoCare, we provide comprehensive bone and joint care with
              state-of-the-art facilities. From fracture treatment to joint replacement,
              trust our experienced team for the best orthopedic care in Una.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Our Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-gray-600">
              <Phone className="w-5 h-5 text-primary" />
              <span>Emergency? Call us at</span>
              <a href="tel:+919876543210" className="font-bold text-primary">
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-40 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Stats */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl lg:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Comprehensive orthopedic care under one roof with state-of-the-art technology
              and experienced specialists.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`}
                className="group p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <service.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-primary">Shivam OrthoCare</span>?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Experienced Doctors', desc: 'Our specialists bring years of expertise in orthopedic care.' },
              { icon: Activity, title: 'Modern Equipment', desc: 'State-of-the-art diagnostic and surgical equipment.' },
              { icon: Clock, title: 'Quick Recovery', desc: 'Minimally invasive techniques for faster recovery.' },
              { icon: HeartPulse, title: 'Complete Care', desc: 'From diagnosis to rehabilitation, all under one roof.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Book Your Appointment Today
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Don&apos;t let bone and joint pain hold you back. Schedule a consultation with
            our expert orthopedic surgeons.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book-appointment"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book Online
            </Link>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
