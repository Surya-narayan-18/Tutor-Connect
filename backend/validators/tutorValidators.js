const { body } = require('express-validator');

const profileValidation = [
  body('subjects')
    .isArray({ min: 1 })
    .withMessage('At least one subject is required'),
  body('subjects.*')
    .trim()
    .notEmpty()
    .withMessage('Subject cannot be empty'),
  body('bio')
    .trim()
    .notEmpty()
    .withMessage('Bio is required')
    .isLength({ max: 2000 })
    .withMessage('Bio cannot exceed 2000 characters'),
  body('hourlyRate')
    .isFloat({ min: 1 })
    .withMessage('Hourly rate must be at least $1'),
  body('qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be an array'),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years of experience must be a non-negative integer'),
  body('profileImage')
    .optional()
    .trim(),
];

const availabilityValidation = [
  body('slots')
    .isArray({ min: 1 })
    .withMessage('At least one availability slot is required'),
  body('slots.*.dayOfWeek')
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),
  body('slots.*.startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:MM format'),
  body('slots.*.endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:MM format'),
];

module.exports = { profileValidation, availabilityValidation };
