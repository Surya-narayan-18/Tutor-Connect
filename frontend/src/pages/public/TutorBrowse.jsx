import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutors } from '../../store/slices/tutorsSlice';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getInitials } from '../../utils/helpers';

const TutorBrowse = () => {
  const dispatch = useDispatch();
  const { list: tutors, pagination, loading, error } = useSelector((s) => s.tutors);
  const [filters, setFilters] = useState({ subject: '', minPrice: '', maxPrice: '', rating: '' });
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => { dispatch(fetchTutors(activeFilters)); }, [dispatch, activeFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.subject) params.subject = filters.subject;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.rating) params.rating = filters.rating;
    setActiveFilters(params);
  };

  const clearFilters = () => { setFilters({ subject: '', minPrice: '', maxPrice: '', rating: '' }); setActiveFilters({}); };

  return (
    <div className="page-container">
      <div className="page-header text-center">
        <h1 className="page-title text-3xl sm:text-4xl">Find Your <span className="gradient-text">Perfect Tutor</span></h1>
        <p className="page-subtitle">Browse our verified expert tutors and find the right match for you</p>
      </div>

      {/* Search/Filter */}
      <form onSubmit={handleSearch} className="card-flat mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="form-group lg:col-span-2">
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="e.g. Mathematics, Python..." value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Min Price ($)</label>
            <input type="number" className="form-input" placeholder="0" min="0" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Price ($)</label>
            <input type="number" className="form-input" placeholder="Any" min="0" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Min Rating</label>
            <select className="form-input" value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
              <option value="">Any</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
          <button type="button" onClick={clearFilters} className="btn btn-ghost btn-sm">Clear Filters</button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Finding tutors..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchTutors(activeFilters))} />
      ) : tutors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="text-lg font-semibold text-surface-200 mb-2">No tutors found</h3>
          <p className="text-sm">Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-400 mb-6">{pagination?.total || tutors.length} tutors found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <Link to={`/tutors/${tutor._id}`} key={tutor._id} className="card group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {getInitials(tutor.userId?.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-surface-100 font-display truncate">{tutor.userId?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={tutor.averageRating} size="sm" />
                      <span className="text-xs text-surface-500">({tutor.totalReviews})</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-surface-400 mb-4 line-clamp-2">{tutor.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tutor.subjects?.slice(0, 3).map((s) => (
                    <span key={s} className="badge badge-primary">{s}</span>
                  ))}
                  {tutor.subjects?.length > 3 && (
                    <span className="badge badge-neutral">+{tutor.subjects.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-700">
                  <div>
                    <span className="text-2xl font-bold text-primary-400 font-display">${tutor.hourlyRate}</span>
                    <span className="text-sm text-surface-500">/hr</span>
                  </div>
                  <span className="text-xs text-surface-500">{tutor.yearsOfExperience}+ yrs exp.</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TutorBrowse;
