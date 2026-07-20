const express = require('express');
const router = express.Router();
const {
  getTutors,
  getTutorById,
  createOrUpdateProfile,
  setAvailability,
  getMyProfile,
} = require('../controllers/tutorController');
const { profileValidation, availabilityValidation } = require('../validators/tutorValidators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Public routes
router.get('/', getTutors);
router.get('/profile/me', auth, authorize('tutor'), getMyProfile);
router.get('/:id', getTutorById);

// Tutor-only routes
router.post('/profile', auth, authorize('tutor'), profileValidation, validate, createOrUpdateProfile);
router.put('/availability', auth, authorize('tutor'), availabilityValidation, validate, setAvailability);

module.exports = router;
