import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingById, updateBookingStatus, clearBookingSuccess } from '../../store/slices/bookingsSlice';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStatusColor, capitalize, formatDate, formatTime } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBooking: booking, loading, error, successMessage } = useSelector((s) => s.bookings);

  useEffect(() => { dispatch(fetchBookingById(id)); }, [dispatch, id]);
  useEffect(() => { if (successMessage) { setTimeout(() => dispatch(clearBookingSuccess()), 3000); } }, [successMessage, dispatch]);

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading booking..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!booking) return <div className="page-container"><ErrorMessage message="Booking not found" /></div>;

  const isStudent = user?.role === 'student';
  const isTutor = user?.role === 'tutor';

  return (
    <div className="page-container max-w-3xl">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-6">
        ← Back
      </button>

      {successMessage && (
        <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm mb-6 animate-slide-down">
          ✓ {successMessage}
        </div>
      )}

      <div className="card-flat animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-surface-50">Booking Details</h1>
          <span className={`badge ${getStatusColor(booking.status)} text-sm px-4 py-1`}>
            {capitalize(booking.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Tutor</p>
              <p className="text-lg font-semibold text-surface-100">{booking.tutorId?.name}</p>
              <p className="text-sm text-surface-400">{booking.tutorId?.email}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Student</p>
              <p className="text-lg font-semibold text-surface-100">{booking.studentId?.name}</p>
              <p className="text-sm text-surface-400">{booking.studentId?.email}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Subject</p>
              <p className="text-surface-200 font-medium">{booking.subject}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Schedule</p>
              {booking.availabilitySlotId && (
                <p className="text-surface-200">
                  {capitalize(booking.availabilitySlotId.dayOfWeek)},{' '}
                  {formatTime(booking.availabilitySlotId.startTime)} – {formatTime(booking.availabilitySlotId.endTime)}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Amount</p>
              <p className="text-2xl font-bold text-primary-400 font-display">${booking.amount}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Booked On</p>
              <p className="text-surface-200">{formatDate(booking.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Payment</p>
              <span className={`badge ${booking.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                {capitalize(booking.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="mt-6 p-4 rounded-xl bg-surface-900 border border-surface-700">
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-surface-300">{booking.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-surface-700">
          {isStudent && booking.status === 'completed' && (
            <Link to={`/reviews/new/${booking._id}`} className="btn btn-accent">Write a Review</Link>
          )}
          {isStudent && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'cancelled' }))} className="btn btn-danger">
              Cancel Booking
            </button>
          )}
          {isTutor && booking.status === 'pending' && (
            <>
              <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'confirmed' }))} className="btn btn-success">
                Accept
              </button>
              <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'cancelled' }))} className="btn btn-danger">
                Reject
              </button>
            </>
          )}
          {isTutor && booking.status === 'confirmed' && (
            <button onClick={() => dispatch(updateBookingStatus({ id: booking._id, status: 'completed' }))} className="btn btn-success">
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
