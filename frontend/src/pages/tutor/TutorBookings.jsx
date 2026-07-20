import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, updateBookingStatus, clearBookingSuccess } from '../../store/slices/bookingsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStatusColor, capitalize, formatDate, formatTime } from '../../utils/helpers';

const TutorBookings = () => {
  const dispatch = useDispatch();
  const { list: bookings, loading, error, successMessage } = useSelector((s) => s.bookings);
  const [tab, setTab] = useState('pending');

  useEffect(() => { dispatch(fetchMyBookings()); }, [dispatch]);
  useEffect(() => { if (successMessage) setTimeout(() => dispatch(clearBookingSuccess()), 3000); }, [successMessage, dispatch]);

  const filtered = tab === 'all' ? bookings : bookings.filter((b) => b.status === tab);
  const tabs = [
    { key: 'pending', label: 'Pending', count: bookings.filter((b) => b.status === 'pending').length },
    { key: 'confirmed', label: 'Upcoming', count: bookings.filter((b) => b.status === 'confirmed').length },
    { key: 'completed', label: 'Completed', count: bookings.filter((b) => b.status === 'completed').length },
    { key: 'all', label: 'All', count: bookings.length },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage <span className="gradient-text">Bookings</span></h1>
        <p className="page-subtitle">Review and manage your tutoring sessions</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm mb-6 animate-slide-down">✓ {successMessage}</div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-primary-500/10 text-primary-400' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
            }`}
          >
            {t.label} <span className="text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner text="Loading bookings..." /> : error ? <ErrorMessage message={error} /> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📅</div><h3 className="text-lg font-semibold text-surface-200 mb-2">No bookings found</h3></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b._id} className="card-flat animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 font-bold shrink-0">
                    {b.studentId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-100">{b.studentId?.name}</h3>
                    <p className="text-sm text-surface-400">{b.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${getStatusColor(b.status)}`}>{capitalize(b.status)}</span>
                      <span className="text-xs text-surface-500">{formatDate(b.createdAt)}</span>
                      {b.availabilitySlotId && (
                        <span className="text-xs text-surface-500">• {capitalize(b.availabilitySlotId.dayOfWeek)} {formatTime(b.availabilitySlotId.startTime)}</span>
                      )}
                    </div>
                    {b.notes && <p className="text-xs text-surface-500 mt-1 italic">"{b.notes}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-400">${b.amount}</span>
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => dispatch(updateBookingStatus({ id: b._id, status: 'confirmed' }))} className="btn btn-success btn-sm">Accept</button>
                      <button onClick={() => dispatch(updateBookingStatus({ id: b._id, status: 'cancelled' }))} className="btn btn-danger btn-sm">Reject</button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <>
                      <button onClick={() => dispatch(updateBookingStatus({ id: b._id, status: 'completed' }))} className="btn btn-success btn-sm">Complete</button>
                      <button onClick={() => dispatch(updateBookingStatus({ id: b._id, status: 'cancelled' }))} className="btn btn-danger btn-sm">Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorBookings;
