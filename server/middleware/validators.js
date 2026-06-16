const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateEnquiry = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('eventType')
    .notEmpty().withMessage('Event type is required')
    .isIn(['Wedding', 'Corporate Event', 'Birthday Party', 'Private Dining', 'Brand Launch', 'Gala Dinner', 'Other'])
    .withMessage('Invalid event type'),
  body('eventDate')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((val) => {
      if (new Date(val) < new Date()) throw new Error('Event date must be in the future');
      return true;
    }),
  body('guestCount')
    .notEmpty().withMessage('Guest count is required')
    .isInt({ min: 1, max: 5000 }).withMessage('Guest count must be between 1 and 5000'),
  body('budget').optional().isIn([
    'Under £500', '£500 - £1,000', '£1,000 - £2,500', '£2,500 - £5,000',
    '£5,000 - £10,000', 'Over £10,000', 'To be discussed',
  ]).withMessage('Invalid budget range'),
  body('venue').optional().trim().isLength({ max: 200 }).escape(),
  body('serviceStyle').optional().isIn([
    'Full-Service Catering', 'Grazing Table', 'Platter Delivery',
    'Buffet', 'Fine Dining / Plated', 'Not sure yet',
  ]).withMessage('Invalid service style'),
  body('message').optional().trim().isLength({ max: 2000 }).withMessage('Message too long').escape(),
  handleValidationErrors,
];

module.exports = { validateEnquiry };
