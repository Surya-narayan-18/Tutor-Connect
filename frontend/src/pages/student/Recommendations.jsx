import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations, clearRecommendations } from '../../store/slices/recommendationsSlice';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getInitials } from '../../utils/helpers';

const Recommendations = () => {
  const dispatch = useDispatch();
  const { results, aiPowered, loading, error } = useSelector((s) => s.recommendations);
  const [queryText, setQueryText] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    dispatch(fetchRecommendations({
      queryText,
      ...(budget && { budget: Number(budget) }),
      ...(preferredTime && { preferredTime }),
    }));
  };

  return (
    <div className="page-container max-w-4xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
          <span className="text-lg">✨</span>
          <span className="text-sm text-primary-300 font-medium">AI-Powered Matching</span>
        </div>
        <h1 className="page-title text-3xl">Find Your <span className="gradient-text">Perfect Tutor</span></h1>
        <p className="page-subtitle">Describe what you need help with and let our AI find the best match</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="card-flat mb-8">
        <div className="form-group mb-4">
          <label className="form-label">What do you need help with?</label>
          <textarea
            className="form-input form-textarea min-h-[120px]"
            placeholder="e.g. I need help with calculus before my finals, prefer evening sessions, budget under $40/hr. I'm struggling with integration techniques and series convergence."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="form-label">Budget ($/hr) — optional</label>
            <input type="number" className="form-input" placeholder="e.g. 40" min="1" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Time — optional</label>
            <select className="form-input" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
              <option value="">Any time</option>
              <option value="morning">Morning (6AM – 12PM)</option>
              <option value="afternoon">Afternoon (12PM – 5PM)</option>
              <option value="evening">Evening (5PM – 9PM)</option>
              <option value="night">Night (7PM – 11PM)</option>
              <option value="weekend">Weekends</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading || !queryText.trim()} className="btn btn-primary">
            {loading ? 'Finding matches...' : '🔍 Find My Tutor'}
          </button>
          {results.length > 0 && (
            <button type="button" onClick={() => dispatch(clearRecommendations())} className="btn btn-ghost btn-sm">
              Clear Results
            </button>
          )}
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 animate-pulse-soft">
            <svg className="w-6 h-6 text-primary-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="text-primary-300 font-medium">AI is analyzing your needs and matching tutors...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold text-surface-100">
              Top Matches
              {aiPowered && <span className="ml-2 badge badge-primary text-xs">AI Enhanced</span>}
            </h2>
            <span className="text-sm text-surface-400">{results.length} tutors found</span>
          </div>

          <div className="space-y-4">
            {results.map((item, idx) => (
              <div key={item.tutor._id} className="card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">#{idx + 1}</span>
                  <span className="text-xs text-surface-500">Match score: {Math.round(item.scores.composite * 100)}%</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {getInitials(item.tutor.userId?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-surface-100 font-display">{item.tutor.userId?.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={item.tutor.averageRating} size="sm" />
                          <span className="text-xs text-surface-500">({item.tutor.totalReviews} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-bold text-primary-400">${item.tutor.hourlyRate}</span>
                        <span className="text-sm text-surface-500">/hr</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tutor.subjects?.map((s) => (<span key={s} className="badge badge-primary">{s}</span>))}
                    </div>
                    {item.reason && (
                      <div className="mt-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                        <p className="text-sm text-primary-300 flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">💡</span>
                          {item.reason}
                        </p>
                      </div>
                    )}
                    <div className="mt-4">
                      <Link to={`/tutors/${item.tutor._id}`} className="btn btn-primary btn-sm">
                        View Profile & Book
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
