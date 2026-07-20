import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Landing from './pages/public/Landing';
import HowItWorks from './pages/public/HowItWorks';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import TutorBrowse from './pages/public/TutorBrowse';
import TutorPublicProfile from './pages/public/TutorPublicProfile';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import Recommendations from './pages/student/Recommendations';
import Bookings from './pages/student/Bookings';
import BookingDetail from './pages/student/BookingDetail';
import NewReview from './pages/student/NewReview';
import StudentProfile from './pages/student/StudentProfile';

// Tutor pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorProfile from './pages/tutor/TutorProfile';
import TutorAvailability from './pages/tutor/TutorAvailability';
import TutorBookings from './pages/tutor/TutorBookings';
import TutorReviews from './pages/tutor/TutorReviews';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTutorApprovals from './pages/admin/AdminTutorApprovals';
import AdminBookings from './pages/admin/AdminBookings';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tutors" element={<TutorBrowse />} />
                <Route path="/tutors/:id" element={<TutorPublicProfile />} />

                {/* Student Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/recommendations" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Recommendations />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Bookings />
                  </ProtectedRoute>
                } />
                <Route path="/bookings/:id" element={
                  <ProtectedRoute allowedRoles={['student', 'tutor', 'admin']}>
                    <BookingDetail />
                  </ProtectedRoute>
                } />
                <Route path="/reviews/new/:bookingId" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <NewReview />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfile />
                  </ProtectedRoute>
                } />

                {/* Tutor Routes */}
                <Route path="/tutor/dashboard" element={
                  <ProtectedRoute allowedRoles={['tutor']}>
                    <TutorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/tutor/profile" element={
                  <ProtectedRoute allowedRoles={['tutor']}>
                    <TutorProfile />
                  </ProtectedRoute>
                } />
                <Route path="/tutor/availability" element={
                  <ProtectedRoute allowedRoles={['tutor']}>
                    <TutorAvailability />
                  </ProtectedRoute>
                } />
                <Route path="/tutor/bookings" element={
                  <ProtectedRoute allowedRoles={['tutor']}>
                    <TutorBookings />
                  </ProtectedRoute>
                } />
                <Route path="/tutor/reviews" element={
                  <ProtectedRoute allowedRoles={['tutor']}>
                    <TutorReviews />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/tutor-approvals" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTutorApprovals />
                  </ProtectedRoute>
                } />
                <Route path="/admin/bookings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminBookings />
                  </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={
                  <div className="page-container text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-3xl font-display font-bold text-surface-100 mb-2">Page Not Found</h1>
                    <p className="text-surface-400 mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
