import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStatusColor, capitalize, formatDate, formatTime } from '../../utils/helpers';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const fetchBookings = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    api.get('/admin/bookings', { params })
      .then((res) => {
        setBookings(res.data.data.bookings);
        setPagination(res.data.data.pagination);
        setLoading(false);
      })
      .catch((err) => { setError(err.response?.data?.message || 'Failed'); setLoading(false); });
  };

  useEffect(() => { fetchBookings(); }, [statusFilter, page]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All <span className="gradient-text">Bookings</span></h1>
        <p className="page-subtitle">View and monitor all platform bookings</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status ? 'bg-primary-500/10 text-primary-400' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
            }`}
          >
            {status ? capitalize(status) : 'All'}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchBookings} />}

      {loading ? <LoadingSpinner text="Loading bookings..." /> : (
        <>
          <div className="table-container mb-6">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Tutor</th>
                  <th>Subject</th>
                  <th>Schedule</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-surface-500">No bookings found</td></tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="font-medium text-surface-200">{b.studentId?.name}</td>
                      <td className="text-surface-300">{b.tutorId?.name}</td>
                      <td className="text-surface-300">{b.subject}</td>
                      <td className="text-surface-400 text-sm">
                        {b.availabilitySlotId ? `${capitalize(b.availabilitySlotId.dayOfWeek)} ${formatTime(b.availabilitySlotId.startTime)}` : '—'}
                      </td>
                      <td className="text-primary-400 font-semibold">${b.amount}</td>
                      <td><span className={`badge ${getStatusColor(b.status)}`}>{capitalize(b.status)}</span></td>
                      <td className="text-surface-400 text-sm">{formatDate(b.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-secondary btn-sm">← Prev</button>
              <span className="text-sm text-surface-400">Page {page} of {pagination.pages}</span>
              <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn btn-secondary btn-sm">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBookings;
