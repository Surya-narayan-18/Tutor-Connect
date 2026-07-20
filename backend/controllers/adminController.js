const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

/**
 * GET /api/admin/users
 * List all users with pagination and optional role filter
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
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

/**
 * PUT /api/admin/users/:id/status
 * Activate or deactivate a user
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/tutors/pending
 * List unapproved tutor profiles
 */
const getPendingTutors = async (req, res, next) => {
  try {
    const tutors = await TutorProfile.find({ isApproved: false })
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { tutors },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/tutors/:id/approve
 * Approve or reject a tutor profile
 */
const approveTutor = async (req, res, next) => {
  try {
    const { approved } = req.body;
    const profile = await TutorProfile.findById(req.params.id)
      .populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Tutor profile not found.',
      });
    }

    profile.isApproved = approved;
    await profile.save();

    res.json({
      success: true,
      message: `Tutor ${approved ? 'approved' : 'rejected'} successfully`,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics
 * Platform-wide analytics
 */
const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins,
      approvedTutors,
      pendingTutors,
      totalBookings,
      bookingsByStatus,
      totalRevenue,
      topTutors,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor' }),
      User.countDocuments({ role: 'admin' }),
      TutorProfile.countDocuments({ isApproved: true }),
      TutorProfile.countDocuments({ isApproved: false }),
      Booking.countDocuments(),
      Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      TutorProfile.find({ isApproved: true })
        .populate('userId', 'name')
        .sort({ averageRating: -1, totalReviews: -1 })
        .limit(5),
      Booking.find()
        .populate('studentId', 'name')
        .populate('tutorId', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Transform bookings by status into an object
    const statusCounts = {};
    bookingsByStatus.forEach((b) => {
      statusCounts[b._id] = b.count;
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          tutors: totalTutors,
          admins: totalAdmins,
        },
        tutors: {
          approved: approvedTutors,
          pending: pendingTutors,
        },
        bookings: {
          total: totalBookings,
          byStatus: statusCounts,
        },
        revenue: totalRevenue[0]?.total || 0,
        topTutors: topTutors.map((t) => ({
          _id: t._id,
          name: t.userId?.name,
          subjects: t.subjects,
          averageRating: t.averageRating,
          totalReviews: t.totalReviews,
          hourlyRate: t.hourlyRate,
        })),
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/bookings
 * Get all bookings (admin)
 */
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('studentId', 'name email')
        .populate('tutorId', 'name email')
        .populate('availabilitySlotId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        bookings,
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

/**
 * DELETE /api/admin/reviews/:id
 * Moderate (remove) a review
 */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    const tutorId = review.tutorId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate tutor rating
    const remainingReviews = await Review.find({ tutorId });
    let avgRating = 0;
    if (remainingReviews.length > 0) {
      avgRating =
        remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
        remainingReviews.length;
    }

    await TutorProfile.findOneAndUpdate(
      { userId: tutorId },
      {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: remainingReviews.length,
      }
    );

    res.json({
      success: true,
      message: 'Review removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
  getPendingTutors,
  approveTutor,
  getAnalytics,
  getAllBookings,
  deleteReview,
};
