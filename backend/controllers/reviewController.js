const Review = require('../models/Review');
const Booking = require('../models/Booking');
const TutorProfile = require('../models/TutorProfile');

/**
 * POST /api/reviews
 * Create a review for a completed booking (student only)
 */
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Verify booking exists, is completed, and belongs to this student
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (booking.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings.',
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed sessions.',
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking.',
      });
    }

    // Create review
    const review = await Review.create({
      bookingId,
      studentId: req.user._id,
      tutorId: booking.tutorId,
      rating,
      comment,
    });

    // Recalculate tutor's average rating
    const allReviews = await Review.find({ tutorId: booking.tutorId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await TutorProfile.findOneAndUpdate(
      { userId: booking.tutorId },
      {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length,
      }
    );

    await review.populate('studentId', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/tutor/:tutorId
 * Get all reviews for a tutor
 */
const getTutorReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ tutorId: req.params.tutorId })
        .populate('studentId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ tutorId: req.params.tutorId }),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getTutorReviews };
