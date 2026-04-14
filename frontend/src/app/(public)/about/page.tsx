import { Award, Users, Heart, Target, Eye, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Shivam OrthoCare, Una - our mission, values, and commitment to providing the best orthopedic care in Himachal Pradesh.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              About <span className="text-primary">Shivam OrthoCare</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Shivam OrthoCare is a premier orthopedic clinic located in Una, Himachal Pradesh,
              dedicated to providing world-class bone and joint care to patients across the region.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded with a vision to bring advanced orthopedic care to Una and
                  surrounding areas, Shivam OrthoCare has been serving the community
                  with dedication and expertise.
                </p>
                <p>
                  Our clinic is equipped with the latest diagnostic and surgical technology,
                  enabling our team of experienced orthopedic surgeons to provide the highest
                  standard of care for conditions ranging from simple fractures to complex
                  joint replacement surgeries.
                </p>
                <p>
                  We believe that every patient deserves access to quality orthopedic care
                  close to home. That&apos;s why we&apos;ve invested in building a
                  state-of-the-art facility right here in Una, so you don&apos;t have to
                  travel far for expert treatment.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '10+', label: 'Years of Service' },
                  { value: '5000+', label: 'Patients Treated' },
                  { value: '2000+', label: 'Surgeries Performed' },
                  { value: '98%', label: 'Patient Satisfaction' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, affordable, and advanced orthopedic care to the
                people of Una and surrounding areas, using the latest medical technology
                and evidence-based treatment approaches.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted orthopedic care center in Gujarat, known for
                clinical excellence, patient-centric care, and positive outcomes that
                help people return to active, pain-free lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Compassion', desc: 'We treat every patient with empathy, respect, and genuine care.' },
              { icon: Award, title: 'Excellence', desc: 'We pursue the highest standards in orthopedic treatment and outcomes.' },
              { icon: Users, title: 'Patient First', desc: 'Every decision we make prioritizes patient well-being and satisfaction.' },
              { icon: Shield, title: 'Integrity', desc: 'We practice transparent, honest, and ethical healthcare.' },
            ].map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
