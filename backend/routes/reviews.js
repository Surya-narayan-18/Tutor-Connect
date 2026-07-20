const express = require('express');
const router = express.Router();
const { createReview, getTutorReviews } = require('../controllers/reviewController');
const { createReviewValidation } = require('../validators/reviewValidators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Public
router.get('/tutor/:tutorId', getTutorReviews);

// Student only
router.post('/', auth, authorize('student'), createReviewValidation, validate, createReview);

module.exports = router;
