import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const StudentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="page-container max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Your account details</p>
      </div>

      <div className="card-flat animate-slide-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold mb-4">
            {getInitials(user?.name)}
          </div>
          <h2 className="text-xl font-display font-bold text-surface-50">{user?.name}</h2>
          <span className="badge badge-primary mt-2">{user?.role}</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-700">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider">Name</p>
              <p className="text-surface-200 font-medium">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-700">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider">Email</p>
              <p className="text-surface-200 font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-700">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider">Role</p>
              <p className="text-surface-200 font-medium capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-700">
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider">Member Since</p>
              <p className="text-surface-200 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
