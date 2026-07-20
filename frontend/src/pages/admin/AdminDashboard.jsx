import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StarRating from '../../components/common/StarRating';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => { setAnalytics(res.data.data); setLoading(false); })
      .catch((err) => { setError(err.response?.data?.message || 'Failed to load analytics'); setLoading(false); });
  }, []);

  if (loading) return <div className="page-container"><LoadingSpinner text="Loading analytics..." /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;

  const stats = [
    { label: 'Total Users', value: analytics.users.total, icon: '👥', color: 'primary' },
    { label: 'Students', value: analytics.users.students, icon: '📖', color: 'primary' },
    { label: 'Tutors', value: analytics.users.tutors, icon: '🎓', color: 'accent' },
    { label: 'Pending Tutors', value: analytics.tutors.pending, icon: '⏳', color: 'warning' },
    { label: 'Total Bookings', value: analytics.bookings.total, icon: '📅', color: 'primary' },
    { label: 'Completed', value: analytics.bookings.byStatus?.completed || 0, icon: '✅', color: 'success' },
    { label: 'Revenue', value: `$${analytics.revenue}`, icon: '💰', color: 'accent' },
    { label: 'Active', value: analytics.bookings.byStatus?.confirmed || 0, icon: '🔄', color: 'primary' },
  ];

  const colorMap = {
    primary: 'bg-primary-500/10 text-primary-400',
    accent: 'bg-accent-500/10 text-accent-400',
    success: 'bg-success-500/10 text-success-500',
    warning: 'bg-warning-500/10 text-warning-500',
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin <span className="gradient-text">Dashboard</span></h1>
        <p className="page-subtitle">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colorMap[s.color]}`}>
                {s.icon}
              </div>
              <div>
                <div className="stat-value text-xl">{s.value}</div>
                <div className="stat-label text-xs">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Tutors */}
        <div className="card-flat">
          <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">🏆 Top Rated Tutors</h2>
          {analytics.topTutors?.length === 0 ? (
            <p className="text-sm text-surface-500">No rated tutors yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.topTutors?.map((t, i) => (
                <div key={t._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-surface-700">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-surface-200">{t.name}</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {t.subjects?.slice(0, 2).map((s) => (
                          <span key={s} className="text-[10px] text-surface-500">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRating rating={t.averageRating} size="sm" />
                    <p className="text-xs text-surface-500">${t.hourlyRate}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card-flat">
          <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">📋 Recent Bookings</h2>
          {analytics.recentBookings?.length === 0 ? (
            <p className="text-sm text-surface-500">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.recentBookings?.slice(0, 6).map((b) => (
                <div key={b._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-surface-700">
                  <div>
                    <p className="text-sm text-surface-200">
                      <span className="font-medium">{b.studentId?.name}</span>
                      <span className="text-surface-500"> → </span>
                      <span className="font-medium">{b.tutorId?.name}</span>
                    </p>
                    <p className="text-xs text-surface-500">{b.subject}</p>
                  </div>
                  <span className={`badge ${
                    b.status === 'completed' ? 'badge-success' :
                    b.status === 'confirmed' ? 'badge-primary' :
                    b.status === 'pending' ? 'badge-warning' : 'badge-danger'
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="card-flat mt-8">
        <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">📊 Booking Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
            const count = analytics.bookings.byStatus?.[status] || 0;
            const pct = analytics.bookings.total > 0 ? Math.round((count / analytics.bookings.total) * 100) : 0;
            const colors = { pending: 'accent', confirmed: 'primary', completed: 'success', cancelled: 'danger' };
            return (
              <div key={status} className="text-center p-4 rounded-xl bg-surface-900 border border-surface-700">
                <div className="text-2xl font-display font-bold text-surface-100 mb-1">{count}</div>
                <div className="text-xs text-surface-400 capitalize mb-2">{status}</div>
                <div className="w-full h-2 rounded-full bg-surface-700 overflow-hidden">
                  <div className={`h-full rounded-full bg-${colors[status]}-500 transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-surface-500 mt-1">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
