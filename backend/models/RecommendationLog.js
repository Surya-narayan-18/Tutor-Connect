const mongoose = require('mongoose');

const recommendationLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    queryText: {
      type: String,
      required: [true, 'Query text is required'],
    },
    recommendedTutorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

recommendationLogSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('RecommendationLog', recommendationLogSchema);
