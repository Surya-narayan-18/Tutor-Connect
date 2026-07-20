import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, updateBookingStatus, clearBookingSuccess } from '../../store/slices/bookingsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStatusColor, capitalize, formatDate, formatTime } from '../../utils/helpers';

const Bookings = () => {
  const dispatch = useDispatch();
  const { list: bookings, loading, error, successMessage } = useSelector((s) => s.bookings);
  const [tab, setTab] = useState('all');

  useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);
  useEffect(() => { if (successMessage) { setTimeout(() => dispatch(clearBookingSuccess()), 3000); } }, [successMessage, dispatch]);

  const filtered = tab === 'all' ? bookings : bookings.filter((b) => b.status === tab);
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Manage your tutoring sessions</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm mb-6 animate-slide-down">
          ✓ {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-primary-500/10 text-primary-400' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
            }`}
          >
            {t.label}
            {t.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({bookings.filter((b) => b.status === t.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner text="Loading bookings..." /> : error ? <ErrorMessage message={error} onRetry={() => dispatch(fetchMyBookings())} /> : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">No bookings found</h3>
          <p className="text-sm mb-4">Start by finding a tutor and booking a session</p>
          <Link to="/tutors" className="btn btn-primary btn-sm">Find a Tutor</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b._id} className="card-flat animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                    {b.tutorId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-100">{b.tutorId?.name}</h3>
                    <p className="text-sm text-surface-400">{b.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${getStatusColor(b.status)}`}>{capitalize(b.status)}</span>
                      <span className="text-xs text-surface-500">{formatDate(b.createdAt)}</span>
                      {b.availabilitySlotId && (
                        <span className="text-xs text-surface-500">
                          • {capitalize(b.availabilitySlotId.dayOfWeek)} {formatTime(b.availabilitySlotId.startTime)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <span className="text-lg font-bold text-primary-400">${b.amount}</span>
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <button onClick={() => dispatch(updateBookingStatus({ id: b._id, status: 'cancelled' }))} className="btn btn-danger btn-sm">Cancel</button>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => dispatch(updateBookingStatus({ id: b._id, status: 'cancelled' }))} className="btn btn-danger btn-sm">Cancel</button>
                    )}
                    {b.status === 'completed' && (
                      <Link to={`/reviews/new/${b._id}`} className="btn btn-accent btn-sm">Review</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
