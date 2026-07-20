import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NewReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then((res) => { setBooking(res.data.data.booking); setLoading(false); })
      .catch((err) => { setError(err.response?.data?.message || 'Failed to load booking'); setLoading(false); });
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    if (!comment.trim()) { setError('Please write a comment'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reviews', { bookingId, rating, comment });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="page-container max-w-2xl">
      <div className="page-header text-center">
        <h1 className="page-title">Leave a Review</h1>
        <p className="page-subtitle">Share your experience with {booking?.tutorId?.name}</p>
      </div>

      <div className="card-flat">
        {/* Booking Info */}
        <div className="p-4 rounded-xl bg-surface-900 border border-surface-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">
              {booking?.tutorId?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-surface-100">{booking?.tutorId?.name}</p>
              <p className="text-sm text-surface-400">{booking?.subject}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm">{error}</div>
          )}

          <div className="form-group items-center">
            <label className="form-label text-center text-lg">How was your session?</label>
            <StarRating rating={rating} onChange={setRating} readonly={false} size="lg" />
          </div>

          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea
              className="form-input form-textarea min-h-[150px]"
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            />
            <span className="text-xs text-surface-500 self-end">{comment.length}/1000</span>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReview;
