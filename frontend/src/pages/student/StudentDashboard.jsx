import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings } from '../../store/slices/bookingsSlice';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getStatusColor, capitalize, formatDate } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { list: bookings, loading } = useSelector((s) => s.bookings);

  useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);

  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const completed = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
        <p className="page-subtitle">Here's an overview of your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
            </div>
            <div>
              <div className="stat-value text-xl">{upcoming.length}</div>
              <div className="stat-label text-xs">Upcoming Sessions</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center text-success-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
            <div>
              <div className="stat-value text-xl">{completed.length}</div>
              <div className="stat-label text-xs">Completed Sessions</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <div>
              <div className="stat-value text-xl">${bookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.amount : 0), 0)}</div>
              <div className="stat-label text-xs">Total Invested</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/recommendations" className="card group border-primary-500/20 hover:border-primary-500/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-2xl shrink-0">✨</div>
            <div>
              <h3 className="text-lg font-semibold text-surface-100 font-display">AI Tutor Match</h3>
              <p className="text-sm text-surface-400">Describe your needs and let AI find the perfect tutor</p>
            </div>
          </div>
        </Link>
        <Link to="/tutors" className="card group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-2xl shrink-0">🔍</div>
            <div>
              <h3 className="text-lg font-semibold text-surface-100 font-display">Browse Tutors</h3>
              <p className="text-sm text-surface-400">Search and filter from our verified tutor network</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming Bookings */}
      <div className="card-flat">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-surface-100">Upcoming Sessions</h2>
          <Link to="/bookings" className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
        </div>
        {loading ? <LoadingSpinner /> : upcoming.length === 0 ? (
          <p className="text-sm text-surface-500 py-4">No upcoming sessions. <Link to="/tutors" className="text-primary-400">Find a tutor!</Link></p>
        ) : (
          <div className="space-y-3 mt-4">
            {upcoming.slice(0, 5).map((b) => (
              <Link to={`/bookings/${b._id}`} key={b._id} className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-700 hover:border-primary-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold text-sm">
                    {b.tutorId?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-200">{b.tutorId?.name}</p>
                    <p className="text-xs text-surface-500">{b.subject} • {formatDate(b.createdAt)}</p>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(b.status)}`}>{capitalize(b.status)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
