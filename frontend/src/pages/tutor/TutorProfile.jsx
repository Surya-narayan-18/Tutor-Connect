import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTutorProfile, createOrUpdateProfile } from '../../store/slices/tutorsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TutorProfile = () => {
  const dispatch = useDispatch();
  const { myProfile: profile, loading, error } = useSelector((s) => s.tutors);
  const [form, setForm] = useState({
    subjects: '', bio: '', hourlyRate: '', qualifications: '', yearsOfExperience: '', profileImage: '',
  });
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => { dispatch(fetchMyTutorProfile()); }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        subjects: profile.subjects?.join(', ') || '',
        bio: profile.bio || '',
        hourlyRate: profile.hourlyRate || '',
        qualifications: profile.qualifications?.join(', ') || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        profileImage: profile.profileImage || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    const subjects = form.subjects.split(',').map((s) => s.trim()).filter(Boolean);
    if (subjects.length === 0) { setFormError('At least one subject is required'); return; }
    if (!form.bio.trim()) { setFormError('Bio is required'); return; }
    if (!form.hourlyRate || Number(form.hourlyRate) < 1) { setFormError('Valid hourly rate is required'); return; }

    const qualifications = form.qualifications ? form.qualifications.split(',').map((q) => q.trim()).filter(Boolean) : [];

    try {
      await dispatch(createOrUpdateProfile({
        subjects,
        bio: form.bio.trim(),
        hourlyRate: Number(form.hourlyRate),
        qualifications,
        yearsOfExperience: Number(form.yearsOfExperience) || 0,
        profileImage: form.profileImage,
      })).unwrap();
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err || 'Failed to save profile');
    }
  };

  if (loading && !profile) return <div className="page-container"><LoadingSpinner text="Loading profile..." /></div>;

  return (
    <div className="page-container max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">{profile ? 'Edit' : 'Create'} <span className="gradient-text">Tutor Profile</span></h1>
        <p className="page-subtitle">{profile ? 'Update your tutor information' : 'Set up your profile to start receiving bookings'}</p>
      </div>

      {success && <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm mb-6 animate-slide-down">✓ {success}</div>}
      {formError && <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm mb-6 animate-slide-down">{formError}</div>}

      <div className="card-flat animate-slide-up">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-group">
            <label className="form-label">Subjects (comma separated) *</label>
            <input className="form-input" placeholder="e.g. Mathematics, Calculus, Statistics" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
            <p className="text-xs text-surface-500">Separate multiple subjects with commas</p>
          </div>

          <div className="form-group">
            <label className="form-label">Bio *</label>
            <textarea className="form-input form-textarea min-h-[150px]" placeholder="Tell students about your teaching experience, style, and specialties..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={2000} />
            <span className="text-xs text-surface-500 self-end">{form.bio.length}/2000</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Hourly Rate ($) *</label>
              <input type="number" className="form-input" placeholder="e.g. 35" min="1" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input type="number" className="form-input" placeholder="e.g. 5" min="0" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Qualifications (comma separated)</label>
            <input className="form-input" placeholder="e.g. PhD Mathematics - MIT, B.Sc Physics - Stanford" value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image URL</label>
            <input className="form-input" placeholder="https://example.com/photo.jpg" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
            {loading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorProfile;
