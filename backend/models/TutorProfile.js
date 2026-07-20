const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subjects: {
      type: [String],
      required: [true, 'At least one subject is required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one subject is required',
      },
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [1, 'Hourly rate must be at least $1'],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: [0, 'Years of experience cannot be negative'],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for reviews
tutorProfileSchema.virtual('reviews', {
  ref: 'Review',
  localField: 'userId',
  foreignField: 'tutorId',
});

// Index for search/filter queries
tutorProfileSchema.index({ subjects: 1 });
tutorProfileSchema.index({ hourlyRate: 1 });
tutorProfileSchema.index({ averageRating: -1 });
tutorProfileSchema.index({ isApproved: 1 });

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
