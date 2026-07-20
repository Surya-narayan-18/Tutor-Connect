const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.post('/', auth, authorize('student'), getRecommendations);

module.exports = router;
