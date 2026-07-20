const { body } = require('express-validator');

const createBookingValidation = [
  body('tutorId')
    .notEmpty()
    .withMessage('Tutor ID is required')
    .isMongoId()
    .withMessage('Invalid tutor ID'),
  body('availabilitySlotId')
    .notEmpty()
    .withMessage('Availability slot ID is required')
    .isMongoId()
    .withMessage('Invalid availability slot ID'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

const updateBookingStatusValidation = [
  body('status')
    .isIn(['confirmed', 'cancelled', 'completed'])
    .withMessage('Status must be confirmed, cancelled, or completed'),
];

module.exports = { createBookingValidation, updateBookingStatusValidation };
