import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-surface-800 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <span className="text-lg font-bold font-display text-surface-50">
                Tutor<span className="text-primary-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-surface-500 leading-relaxed">
              Connecting students with expert tutors for personalized learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {['Browse Tutors', 'How It Works', 'Register'].map((text) => (
                <li key={text}>
                  <Link
                    to={`/${text.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-surface-400 hover:text-primary-400 transition-colors"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4 uppercase tracking-wider">For Tutors</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Become a Tutor</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">Tutor Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-surface-200 mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-surface-400">help@tutorconnect.com</span></li>
              <li><span className="text-sm text-surface-400">Available 24/7</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} TutorConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 hover:text-surface-300 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-surface-500 hover:text-surface-300 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
