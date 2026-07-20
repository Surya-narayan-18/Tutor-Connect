import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getInitials, formatDate } from '../../utils/helpers';

const TutorReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reviews/tutor/${user._id}`)
      .then((res) => { setReviews(res.data.data.reviews); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user._id]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading reviews..." /></div>;

  return (
    <div className="page-container max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">My <span className="gradient-text">Reviews</span></h1>
        <p className="page-subtitle">See what students think about your teaching</p>
      </div>

      {/* Rating Summary */}
      <div className="card-flat mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-display font-bold gradient-text mb-1">{avgRating}</div>
            <StarRating rating={Number(avgRating)} />
            <p className="text-sm text-surface-400 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {ratingDist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-surface-400 w-12">{star} star</span>
                <div className="flex-1 h-2.5 rounded-full bg-surface-700 overflow-hidden">
                  <div className="h-full rounded-full bg-accent-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-surface-500 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⭐</div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">No reviews yet</h3>
          <p className="text-sm">Complete sessions to start receiving reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card-flat animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-400">
                    {getInitials(r.studentId?.name)}
                  </div>
                  <div>
                    <p className="font-medium text-surface-200">{r.studentId?.name}</p>
                    <p className="text-xs text-surface-500">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={r.rating} size="sm" />
              </div>
              <p className="text-sm text-surface-300 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorReviews;
