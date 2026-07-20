const TutorProfile = require('../models/TutorProfile');
const Availability = require('../models/Availability');
const User = require('../models/User');

/**
 * GET /api/tutors
 * Search/filter approved tutors
 */
const getTutors = async (req, res, next) => {
  try {
    const { subject, minPrice, maxPrice, rating, page = 1, limit = 12 } = req.query;

    const filter = { isApproved: true };

    // Subject filter (case-insensitive partial match)
    if (subject) {
      filter.subjects = { $elemMatch: { $regex: subject, $options: 'i' } };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.hourlyRate = {};
      if (minPrice) filter.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) filter.hourlyRate.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tutors, total] = await Promise.all([
      TutorProfile.find(filter)
        .populate('userId', 'name email')
        .sort({ averageRating: -1, totalReviews: -1 })
        .skip(skip)
        .limit(Number(limit)),
      TutorProfile.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        tutors,
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
 * GET /api/tutors/:id
 * Get a single tutor's public profile with reviews
 */
const getTutorById = async (req, res, next) => {
  try {
    const tutor = await TutorProfile.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('reviews');

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found.',
      });
    }

    // Also fetch availability slots
    const availability = await Availability.find({
      tutorId: tutor.userId._id,
      isBooked: false,
    }).sort({ dayOfWeek: 1, startTime: 1 });

    res.json({
      success: true,
      data: {
        tutor,
        availability,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tutors/profile
 * Create or update own tutor profile (tutor only)
 */
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const { subjects, bio, hourlyRate, qualifications, yearsOfExperience, profileImage } = req.body;

    let profile = await TutorProfile.findOne({ userId: req.user._id });

    if (profile) {
      // Update existing profile
      profile.subjects = subjects;
      profile.bio = bio;
      profile.hourlyRate = hourlyRate;
      if (qualifications) profile.qualifications = qualifications;
      if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
      if (profileImage !== undefined) profile.profileImage = profileImage;
      await profile.save();
    } else {
      // Create new profile — needs admin approval
      profile = await TutorProfile.create({
        userId: req.user._id,
        subjects,
        bio,
        hourlyRate,
        qualifications: qualifications || [],
        yearsOfExperience: yearsOfExperience || 0,
        profileImage: profileImage || '',
        isApproved: false,
      });
    }

    await profile.populate('userId', 'name email');

    res.status(profile.isNew ? 201 : 200).json({
      success: true,
      message: profile.isApproved
        ? 'Profile updated successfully'
        : 'Profile submitted for admin approval',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tutors/availability
 * Set/replace availability slots (tutor only)
 */
const setAvailability = async (req, res, next) => {
  try {
    const { slots } = req.body;
    const tutorId = req.user._id;

    // Remove all non-booked slots for this tutor (keep booked ones intact)
    await Availability.deleteMany({ tutorId, isBooked: false });

    // Create new slots
    const newSlots = slots.map((slot) => ({
      tutorId,
      dayOfWeek: slot.dayOfWeek,
      date: slot.date || null,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: false,
    }));

    const created = await Availability.insertMany(newSlots);

    res.json({
      success: true,
      message: `${created.length} availability slots set successfully`,
      data: { slots: created },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tutors/my-profile
 * Get current tutor's own profile
 */
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await TutorProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Tutor profile not found. Please create one.',
      });
    }

    const availability = await Availability.find({ tutorId: req.user._id })
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json({
      success: true,
      data: { profile, availability },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTutors,
  getTutorById,
  createOrUpdateProfile,
  setAvailability,
  getMyProfile,
};
