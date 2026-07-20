const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserStatus,
  getPendingTutors,
  approveTutor,
  getAnalytics,
  getAllBookings,
  deleteReview,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All admin routes require auth + admin role
router.use(auth, authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/tutors/pending', getPendingTutors);
router.put('/tutors/:id/approve', approveTutor);
router.get('/analytics', getAnalytics);
router.get('/bookings', getAllBookings);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
