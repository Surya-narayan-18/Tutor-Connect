import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StarRating from '../../components/common/StarRating';
import { getInitials } from '../../utils/helpers';

const AdminTutorApprovals = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    api.get('/admin/tutors/pending')
      .then((res) => { setTutors(res.data.data.tutors); setLoading(false); })
      .catch((err) => { setError(err.response?.data?.message || 'Failed'); setLoading(false); });
  }, []);

  const handleAction = async (id, approved) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/tutors/${id}/approve`, { approved });
      setTutors(tutors.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading pending tutors..." /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Tutor <span className="gradient-text">Approvals</span></h1>
        <p className="page-subtitle">Review and approve tutor applications</p>
      </div>

      {error && <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm mb-6">{error}</div>}

      {tutors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">All caught up!</h3>
          <p className="text-sm">No pending tutor applications to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tutors.map((t) => (
            <div key={t._id} className="card-flat animate-slide-up">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {getInitials(t.userId?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-display font-semibold text-surface-100">{t.userId?.name}</h3>
                  <p className="text-sm text-surface-400">{t.userId?.email}</p>
                  <p className="text-sm text-primary-400 mt-1">${t.hourlyRate}/hr • {t.yearsOfExperience} yrs exp.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {t.subjects?.map((s) => (<span key={s} className="badge badge-primary">{s}</span>))}
              </div>

              <p className="text-sm text-surface-300 mb-3 line-clamp-3">{t.bio}</p>

              {t.qualifications?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Qualifications</p>
                  <ul className="space-y-1">
                    {t.qualifications.map((q, i) => (
                      <li key={i} className="text-xs text-surface-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary-400" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-surface-700">
                <button
                  onClick={() => handleAction(t._id, true)}
                  disabled={actionLoading === t._id}
                  className="btn btn-success flex-1"
                >
                  {actionLoading === t._id ? '...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleAction(t._id, false)}
                  disabled={actionLoading === t._id}
                  className="btn btn-danger flex-1"
                >
                  {actionLoading === t._id ? '...' : '✗ Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTutorApprovals;
