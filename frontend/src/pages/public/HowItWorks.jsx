import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const studentSteps = [
    { step: '01', title: 'Create Your Account', desc: 'Sign up free and tell us your learning goals.', icon: '👤' },
    { step: '02', title: 'Find Your Tutor', desc: 'Browse tutors or let our AI match you with the perfect fit based on subject, budget, and schedule.', icon: '🔍' },
    { step: '03', title: 'Book & Learn', desc: 'Select an available time slot, book your session, and start learning with your expert tutor.', icon: '📚' },
  ];

  const tutorSteps = [
    { step: '01', title: 'Apply as a Tutor', desc: 'Create your profile with subjects, qualifications, and hourly rate.', icon: '📝' },
    { step: '02', title: 'Get Approved', desc: 'Our admin team reviews and approves your profile to ensure quality.', icon: '✅' },
    { step: '03', title: 'Start Teaching', desc: 'Set your availability, accept bookings, and earn while sharing your expertise.', icon: '🎓' },
  ];

  return (
    <div className="page-container">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-surface-50 mb-4 animate-slide-up">
          How It <span className="gradient-text">Works</span>
        </h1>
        <p className="text-surface-400 text-lg max-w-2xl mx-auto animate-slide-up">
          Getting started with TutorConnect is simple — whether you're a student or a tutor.
        </p>
      </div>

      {/* For Students */}
      <div className="mb-20">
        <h2 className="text-2xl font-display font-bold text-surface-100 mb-8 text-center">
          For <span className="text-primary-400">Students</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentSteps.map((s, i) => (
            <div key={i} className="card text-center group relative">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-2">{s.step}</div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 font-display">{s.title}</h3>
              <p className="text-sm text-surface-400">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-surface-600 z-10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* For Tutors */}
      <div className="mb-20">
        <h2 className="text-2xl font-display font-bold text-surface-100 mb-8 text-center">
          For <span className="text-accent-400">Tutors</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorSteps.map((s, i) => (
            <div key={i} className="card text-center group relative">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-xs font-bold text-accent-500 uppercase tracking-widest mb-2">{s.step}</div>
              <h3 className="text-lg font-semibold text-surface-100 mb-2 font-display">{s.title}</h3>
              <p className="text-sm text-surface-400">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-surface-600 z-10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="card-flat inline-block px-12 py-10">
          <h3 className="text-2xl font-display font-bold text-surface-50 mb-3">Ready to get started?</h3>
          <p className="text-surface-400 mb-6">Join TutorConnect today and start your learning journey.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
            <Link to="/tutors" className="btn btn-secondary">Browse Tutors</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
