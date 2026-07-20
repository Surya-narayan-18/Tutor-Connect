import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'tutor' ? '/tutor/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-surface-50 mb-2">Create Account</h1>
          <p className="text-surface-400">Join TutorConnect as a student or tutor</p>
        </div>

        <div className="card-flat">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm animate-slide-down">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Learn', icon: '📖', desc: 'Find tutors' },
                  { value: 'tutor', label: 'Teach', icon: '🎓', desc: 'Share expertise' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.role === opt.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-surface-600 hover:border-surface-500 bg-surface-800'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="text-sm font-semibold text-surface-100">{opt.label}</div>
                    <div className="text-xs text-surface-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input
                id="reg-name" name="name" type="text" className="form-input"
                placeholder="John Doe" value={form.name} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">Email</label>
              <input
                id="reg-email" name="email" type="email" className="form-input"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <input
                id="reg-password" name="password" type="password" className="form-input"
                placeholder="At least 6 characters" value={form.password} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
              <input
                id="reg-confirm" name="confirmPassword" type="password" className="form-input"
                placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                `Create ${form.role === 'tutor' ? 'Tutor' : 'Student'} Account`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
