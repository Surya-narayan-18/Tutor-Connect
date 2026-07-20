import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTutorProfile } from '../../store/slices/tutorsSlice';
import { fetchMyBookings } from '../../store/slices/bookingsSlice';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getStatusColor, capitalize, formatDate } from '../../utils/helpers';

const TutorDashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { myProfile: profile, loading: profileLoading } = useSelector((s) => s.tutors);
  const { list: bookings, loading: bookingsLoading } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchMyTutorProfile());
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const completed = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completed.reduce((sum, b) => sum + b.amount, 0);
  const loading = profileLoading || bookingsLoading;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 🎓</h1>
        <p className="page-subtitle">Your tutor dashboard overview</p>
      </div>

      {!profile && !loading && (
        <div className="card border-accent-500/30 mb-8 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📋</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-surface-100 font-display">Complete Your Profile</h3>
              <p className="text-sm text-surface-400">Set up your tutor profile to start receiving bookings</p>
            </div>
            <Link to="/tutor/profile" className="btn btn-primary">Create Profile</Link>
          </div>
        </div>
      )}

      {profile && !profile.isApproved && (
        <div className="p-4 rounded-xl bg-warning-500/10 border border-warning-500/20 text-warning-500 text-sm mb-6 animate-slide-down">
          ⏳ Your profile is pending admin approval. You'll be able to receive bookings once approved.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-500/10 flex items-center justify-center text-warning-500">📩</div>
            <div>
              <div className="stat-value text-xl">{pending.length}</div>
              <div className="stat-label text-xs">Pending Requests</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">📅</div>
            <div>
              <div className="stat-value text-xl">{confirmed.length}</div>
              <div className="stat-label text-xs">Upcoming Sessions</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center text-success-500">✅</div>
            <div>
              <div className="stat-value text-xl">{completed.length}</div>
              <div className="stat-label text-xs">Completed</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400">💰</div>
            <div>
              <div className="stat-value text-xl">${totalEarnings}</div>
              <div className="stat-label text-xs">Total Earnings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        {profile && (
          <div className="card-flat">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-surface-100">Your Profile</h2>
              <Link to="/tutor/profile" className="text-sm text-primary-400 hover:text-primary-300">Edit →</Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <StarRating rating={profile.averageRating} size="sm" />
                <span className="text-sm text-surface-400">({profile.totalReviews} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.subjects?.map((s) => (<span key={s} className="badge badge-primary">{s}</span>))}
              </div>
              <p className="text-sm text-surface-400">${profile.hourlyRate}/hr • {profile.yearsOfExperience} yrs experience</p>
              <div className="flex items-center gap-2">
                <span className={`badge ${profile.isApproved ? 'badge-success' : 'badge-warning'}`}>
                  {profile.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pending Bookings */}
        <div className="card-flat">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-surface-100">Pending Requests</h2>
            <Link to="/tutor/bookings" className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          {loading ? <LoadingSpinner /> : pending.length === 0 ? (
            <p className="text-sm text-surface-500 py-4">No pending requests</p>
          ) : (
            <div className="space-y-3 mt-4">
              {pending.slice(0, 4).map((b) => (
                <Link to={`/bookings/${b._id}`} key={b._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-surface-700 hover:border-warning-500/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-surface-200">{b.studentId?.name}</p>
                    <p className="text-xs text-surface-500">{b.subject} • {formatDate(b.createdAt)}</p>
                  </div>
                  <span className={`badge ${getStatusColor(b.status)}`}>{capitalize(b.status)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
