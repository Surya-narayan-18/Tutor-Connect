const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const TutorProfile = require('../models/TutorProfile');

/**
 * POST /api/bookings
 * Create a new booking (student only)
 */
const createBooking = async (req, res, next) => {
  try {
    const { tutorId, availabilitySlotId, subject, notes } = req.body;

    // Check slot exists and is not booked
    const slot = await Availability.findById(availabilitySlotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Availability slot not found.',
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked.',
      });
    }

    if (slot.tutorId.toString() !== tutorId) {
      return res.status(400).json({
        success: false,
        message: 'Slot does not belong to the specified tutor.',
      });
    }

    // Get tutor's hourly rate for booking amount
    const tutorProfile = await TutorProfile.findOne({ userId: tutorId });
    const amount = tutorProfile ? tutorProfile.hourlyRate : 0;

    // Prevent student from booking themselves
    if (req.user._id.toString() === tutorId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book yourself.',
      });
    }

    // Create booking
    const booking = await Booking.create({
      studentId: req.user._id,
      tutorId,
      availabilitySlotId,
      subject,
      notes: notes || '',
      amount,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    // Mark slot as booked
    slot.isBooked = true;
    await slot.save();

    await booking.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'tutorId', select: 'name email' },
      { path: 'availabilitySlotId' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/me
 * Get bookings for the current user (role-aware)
 */
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Role-aware filtering
    if (req.user.role === 'student') {
      filter.studentId = req.user._id;
    } else if (req.user.role === 'tutor') {
      filter.tutorId = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

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
 * GET /api/bookings/:id
 * Get a single booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('tutorId', 'name email')
      .populate('availabilitySlotId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ensure user is involved in the booking or is admin
    const userId = req.user._id.toString();
    const isInvolved =
      booking.studentId._id.toString() === userId ||
      booking.tutorId._id.toString() === userId ||
      req.user.role === 'admin';

    if (!isInvolved) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.',
      });
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/bookings/:id/status
 * Update booking status (confirm/reject/cancel/complete)
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const userId = req.user._id.toString();
    const isStudent = booking.studentId.toString() === userId;
    const isTutor = booking.tutorId.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    // Authorization and state-transition rules
    if (status === 'confirmed') {
      if (!isTutor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the tutor can confirm a booking.',
        });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending bookings can be confirmed.',
        });
      }
    }

    if (status === 'cancelled') {
      if (!isStudent && !isTutor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this booking.',
        });
      }
      if (booking.status === 'completed' || booking.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a ${booking.status} booking.`,
        });
      }
      // Free up the availability slot
      await Availability.findByIdAndUpdate(booking.availabilitySlotId, {
        isBooked: false,
      });
    }

    if (status === 'completed') {
      if (!isTutor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the tutor can mark a booking as completed.',
        });
      }
      if (booking.status !== 'confirmed') {
        return res.status(400).json({
          success: false,
          message: 'Only confirmed bookings can be completed.',
        });
      }
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'tutorId', select: 'name email' },
      { path: 'availabilitySlotId' },
    ]);

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, updateBookingStatus };
