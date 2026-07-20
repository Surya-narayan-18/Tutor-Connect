import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate, capitalize } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    api.get('/admin/users', { params })
      .then((res) => { setUsers(res.data.data.users); setLoading(false); })
      .catch((err) => { setError(err.response?.data?.message || 'Failed'); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const toggleStatus = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setUsers(users.map((u) => u._id === userId ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setActionLoading('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage <span className="gradient-text">Users</span></h1>
        <p className="page-subtitle">View and manage all platform users</p>
      </div>

      {/* Filters */}
      <div className="card-flat mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input className="form-input flex-1" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-input w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="admin">Admins</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {error && <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm mb-6">{error}</div>}

      {loading ? <LoadingSpinner text="Loading users..." /> : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-surface-500">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-surface-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-surface-400">{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'tutor' ? 'badge-primary' : 'badge-neutral'}`}>{capitalize(u.role)}</span></td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-surface-400 text-sm">{formatDate(u.createdAt)}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleStatus(u._id, u.isActive)}
                          disabled={actionLoading === u._id}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                        >
                          {actionLoading === u._id ? '...' : u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
