const Groq = require('groq-sdk');
const { filterTutors, scoreTutors } = require('../utils/scoringEngine');
const RecommendationLog = require('../models/RecommendationLog');

/**
 * Call Groq LLM to generate per-tutor explanations
 */
async function getGroqExplanations(queryText, candidates) {
  // Check if Groq API key is configured
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const candidateData = candidates.map((c) => ({
      tutorId: c.tutor._id.toString(),
      name: c.tutor.userId?.name || 'Unknown',
      subjects: c.tutor.subjects,
      bio: c.tutor.bio,
      hourlyRate: c.tutor.hourlyRate,
      averageRating: c.tutor.averageRating,
      totalReviews: c.tutor.totalReviews,
      yearsOfExperience: c.tutor.yearsOfExperience,
      score: c.scores.composite,
    }));

    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    const completion = await Promise.race([
      groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are TutorConnect\'s tutor-matching assistant. Given a student\'s ' +
              'stated learning need and a list of candidate tutors, write exactly ' +
              'one short, specific sentence per tutor explaining why they fit this ' +
              'student. Be concrete (mention subject, rating, price, or availability ' +
              'where relevant). Never invent facts not present in the candidate data. ' +
              'Respond ONLY with valid JSON in this exact shape: ' +
              '[{"tutorId": string, "reason": string}]. No prose, no markdown.',
          },
          {
            role: 'user',
            content: `Student's learning need: "${queryText}"\n\nCandidate tutors:\n${JSON.stringify(candidateData)}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1024,
      }),
      // 5-second timeout
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Groq API timeout')), 5000)
      ),
    ]);

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    let parsed = JSON.parse(content);

    // Handle if Groq wraps in an object like { recommendations: [...] }
    if (!Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      const arrKey = keys.find((k) => Array.isArray(parsed[k]));
      if (arrKey) {
        parsed = parsed[arrKey];
      } else {
        return null;
      }
    }

    return parsed;
  } catch (error) {
    console.warn('⚠️ Groq API call failed, falling back to generic reasons:', error.message);
    return null;
  }
}

/**
 * POST /api/recommendations
 * AI-powered tutor recommendation (student only)
 */
const getRecommendations = async (req, res, next) => {
  try {
    const { queryText, budget, preferredTime } = req.body;

    if (!queryText || queryText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please describe what you need help with.',
      });
    }

    // Step 1 — Hard filter
    const filteredTutors = await filterTutors(queryText, budget);

    if (filteredTutors.length === 0) {
      return res.json({
        success: true,
        data: {
          recommendations: [],
          message: 'No tutors found matching your criteria. Try broadening your search.',
        },
      });
    }

    // Step 2 — Score and rank
    const scoredTutors = await scoreTutors(filteredTutors, queryText, budget, preferredTime);

    // Step 3 — LLM explanations (graceful fallback)
    const groqReasons = await getGroqExplanations(queryText, scoredTutors);

    // Build final recommendations
    const recommendations = scoredTutors.map((item) => {
      // Try to find LLM reason for this tutor
      let reason = 'Strong subject and rating match';
      if (groqReasons) {
        const llmEntry = groqReasons.find(
          (r) => r.tutorId === item.tutor._id.toString()
        );
        if (llmEntry?.reason) {
          reason = llmEntry.reason;
        }
      }

      return {
        tutor: {
          _id: item.tutor._id,
          userId: item.tutor.userId,
          subjects: item.tutor.subjects,
          bio: item.tutor.bio,
          hourlyRate: item.tutor.hourlyRate,
          averageRating: item.tutor.averageRating,
          totalReviews: item.tutor.totalReviews,
          yearsOfExperience: item.tutor.yearsOfExperience,
          profileImage: item.tutor.profileImage,
        },
        scores: item.scores,
        reason,
      };
    });

    // Step 4 — Log the query
    await RecommendationLog.create({
      studentId: req.user._id,
      queryText,
      recommendedTutorIds: scoredTutors.map((s) => s.tutor.userId._id),
    });

    res.json({
      success: true,
      data: {
        recommendations,
        query: { queryText, budget, preferredTime },
        aiPowered: !!groqReasons,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
