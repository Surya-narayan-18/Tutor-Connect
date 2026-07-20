import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorById } from '../../store/slices/tutorsSlice';
import { createBooking } from '../../store/slices/bookingsSlice';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { getInitials, capitalize, formatTime, formatDate } from '../../utils/helpers';
import api from '../../api/axios';

const TutorPublicProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { selectedTutor: tutor, selectedTutorAvailability: availability, loading, error } = useSelector((s) => s.tutors);
  const [reviews, setReviews] = useState([]);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => { dispatch(fetchTutorById(id)); }, [dispatch, id]);

  useEffect(() => {
    if (tutor?.userId?._id) {
      api.get(`/reviews/tutor/${tutor.userId._id}`).then((res) => setReviews(res.data.data.reviews)).catch(() => {});
    }
  }, [tutor]);

  const handleBook = async () => {
    if (!selectedSlot || !bookingSubject.trim()) {
      setBookingError('Please select a slot and enter a subject.');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    try {
      await dispatch(createBooking({
        tutorId: tutor.userId._id,
        availabilitySlotId: selectedSlot._id,
        subject: bookingSubject,
        notes: bookingNotes,
      })).unwrap();
      setBookingModal(false);
      navigate('/bookings');
    } catch (err) {
      setBookingError(err || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading profile..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!tutor) return <div className="page-container"><ErrorMessage message="Tutor not found" /></div>;

  // Group availability by day
  const slotsByDay = {};
  availability?.forEach((s) => {
    if (!slotsByDay[s.dayOfWeek]) slotsByDay[s.dayOfWeek] = [];
    slotsByDay[s.dayOfWeek].push(s);
  });

  return (
    <div className="page-container max-w-5xl">
      {/* Profile Header */}
      <div className="card-flat mb-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {getInitials(tutor.userId?.name)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-50 mb-2">{tutor.userId?.name}</h1>
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={tutor.averageRating} />
              <span className="text-sm text-surface-400">({tutor.totalReviews} reviews)</span>
              <span className="text-surface-600">•</span>
              <span className="text-sm text-surface-400">{tutor.yearsOfExperience} years experience</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tutor.subjects?.map((s) => (<span key={s} className="badge badge-primary">{s}</span>))}
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold text-primary-400 font-display">${tutor.hourlyRate}</span>
                <span className="text-surface-400">/hour</span>
              </div>
              {isAuthenticated && user?.role === 'student' && (
                <button onClick={() => setBookingModal(true)} className="btn btn-primary">
                  Book a Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bio + Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-flat">
            <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">About</h2>
            <p className="text-surface-300 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
          </div>
          {tutor.qualifications?.length > 0 && (
            <div className="card-flat">
              <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">Qualifications</h2>
              <ul className="space-y-2">
                {tutor.qualifications.map((q, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-surface-300">
                    <svg className="w-4 h-4 text-success-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card-flat">
            <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-surface-500">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="p-4 rounded-xl bg-surface-900 border border-surface-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-400">
                          {getInitials(r.studentId?.name)}
                        </div>
                        <span className="text-sm font-medium text-surface-200">{r.studentId?.name}</span>
                      </div>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-sm text-surface-400">{r.comment}</p>
                    <p className="text-xs text-surface-600 mt-2">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Availability */}
        <div className="space-y-6">
          <div className="card-flat">
            <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">Available Slots</h2>
            {Object.keys(slotsByDay).length === 0 ? (
              <p className="text-sm text-surface-500">No availability set</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(slotsByDay).map(([day, slots]) => (
                  <div key={day}>
                    <h4 className="text-sm font-semibold text-surface-300 mb-2">{capitalize(day)}</h4>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => { if (isAuthenticated && user?.role === 'student') { setSelectedSlot(s); setBookingModal(true); } }}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            isAuthenticated && user?.role === 'student'
                              ? 'border-primary-500/30 bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 cursor-pointer'
                              : 'border-surface-600 bg-surface-800 text-surface-400 cursor-default'
                          }`}
                        >
                          {formatTime(s.startTime)} – {formatTime(s.endTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={bookingModal} onClose={() => { setBookingModal(false); setBookingError(''); }} title="Book a Session" size="md">
        <div className="flex flex-col gap-4">
          {bookingError && <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">{bookingError}</div>}
          <div className="p-4 rounded-xl bg-surface-900 border border-surface-700">
            <p className="text-sm text-surface-400 mb-1">Tutor</p>
            <p className="font-semibold text-surface-100">{tutor.userId?.name}</p>
            <p className="text-sm text-primary-400 mt-1">${tutor.hourlyRate}/hour</p>
          </div>
          {selectedSlot && (
            <div className="p-4 rounded-xl bg-surface-900 border border-surface-700">
              <p className="text-sm text-surface-400 mb-1">Time Slot</p>
              <p className="font-semibold text-surface-100">{capitalize(selectedSlot.dayOfWeek)} {formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)}</p>
            </div>
          )}
          {!selectedSlot && (
            <div className="form-group">
              <label className="form-label">Select a Time Slot</label>
              <select className="form-input" onChange={(e) => setSelectedSlot(availability.find(s => s._id === e.target.value))}>
                <option value="">Choose a slot...</option>
                {availability?.map((s) => (<option key={s._id} value={s._id}>{capitalize(s.dayOfWeek)} {formatTime(s.startTime)} – {formatTime(s.endTime)}</option>))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-input" value={bookingSubject} onChange={(e) => setBookingSubject(e.target.value)}>
              <option value="">Select subject...</option>
              {tutor.subjects?.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea className="form-input form-textarea" placeholder="Any specific topics or goals..." value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} />
          </div>
          <button onClick={handleBook} disabled={bookingLoading} className="btn btn-primary w-full">
            {bookingLoading ? 'Booking...' : `Book Session — $${tutor.hourlyRate}`}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TutorPublicProfile;
