const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const TutorProfile = require('../models/TutorProfile');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const RecommendationLog = require('../models/RecommendationLog');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop existing data
    await Promise.all([
      User.deleteMany({}),
      TutorProfile.deleteMany({}),
      Availability.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
      RecommendationLog.deleteMany({}),
    ]);
    console.log('🗑️  Cleared all collections');

    // ========== USERS ==========
    const password = 'password123';

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@tutorconnect.com',
      password,
      role: 'admin',
    });

    const students = await User.create([
      { name: 'Alice Johnson', email: 'alice@student.com', password, role: 'student' },
      { name: 'Bob Williams', email: 'bob@student.com', password, role: 'student' },
      { name: 'Carol Davis', email: 'carol@student.com', password, role: 'student' },
      { name: 'David Brown', email: 'david@student.com', password, role: 'student' },
      { name: 'Emma Wilson', email: 'emma@student.com', password, role: 'student' },
    ]);

    const tutorUsers = await User.create([
      { name: 'Dr. Sarah Chen', email: 'sarah@tutor.com', password, role: 'tutor' },
      { name: 'Prof. James Miller', email: 'james@tutor.com', password, role: 'tutor' },
      { name: 'Maria Garcia', email: 'maria@tutor.com', password, role: 'tutor' },
      { name: 'Dr. Ahmed Khan', email: 'ahmed@tutor.com', password, role: 'tutor' },
      { name: 'Lisa Thompson', email: 'lisa@tutor.com', password, role: 'tutor' },
      { name: 'Dr. Robert Lee', email: 'robert@tutor.com', password, role: 'tutor' },
      { name: 'Jennifer Park', email: 'jennifer@tutor.com', password, role: 'tutor' },
      { name: 'Michael Scott', email: 'michael@tutor.com', password, role: 'tutor' },
    ]);

    console.log(`👥 Created ${1 + students.length + tutorUsers.length} users`);

    // ========== TUTOR PROFILES ==========
    const profileData = [
      {
        userId: tutorUsers[0]._id,
        subjects: ['Mathematics', 'Calculus', 'Linear Algebra', 'Statistics'],
        bio: 'PhD in Mathematics from MIT. 10+ years of teaching experience at university level. Specializing in making complex math concepts accessible and intuitive. I focus on building strong foundations and problem-solving skills.',
        hourlyRate: 45,
        qualifications: ['PhD Mathematics — MIT', 'M.Sc Mathematics — Stanford'],
        yearsOfExperience: 12,
        averageRating: 4.8,
        totalReviews: 5,
        isApproved: true,
      },
      {
        userId: tutorUsers[1]._id,
        subjects: ['Physics', 'Mechanics', 'Thermodynamics', 'Quantum Physics'],
        bio: 'Professor of Physics with expertise in classical and modern physics. Published researcher with a passion for teaching. I use real-world examples and experiments to make physics engaging.',
        hourlyRate: 50,
        qualifications: ['PhD Physics — Caltech', 'B.Sc Physics — Oxford'],
        yearsOfExperience: 15,
        averageRating: 4.6,
        totalReviews: 4,
        isApproved: true,
      },
      {
        userId: tutorUsers[2]._id,
        subjects: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
        bio: 'Chemistry enthusiast with a knack for simplifying organic chemistry mechanisms. Former lab researcher turned full-time tutor. I help students ace their exams with structured study plans and visual learning techniques.',
        hourlyRate: 35,
        qualifications: ['M.Sc Chemistry — UCLA', 'B.Sc Biochemistry — UC Berkeley'],
        yearsOfExperience: 7,
        averageRating: 4.9,
        totalReviews: 6,
        isApproved: true,
      },
      {
        userId: tutorUsers[3]._id,
        subjects: ['Computer Science', 'Python', 'JavaScript', 'Data Structures', 'Algorithms'],
        bio: 'Software engineer at a top tech company turned educator. I teach programming from scratch and prepare students for coding interviews. Hands-on approach with real projects.',
        hourlyRate: 55,
        qualifications: ['M.Sc Computer Science — Carnegie Mellon', 'AWS Certified'],
        yearsOfExperience: 9,
        averageRating: 4.7,
        totalReviews: 3,
        isApproved: true,
      },
      {
        userId: tutorUsers[4]._id,
        subjects: ['English', 'Essay Writing', 'Literature', 'TOEFL Prep'],
        bio: 'Published author and English language specialist. I help students improve their writing, critical thinking, and communication skills. Expert in standardized test preparation (TOEFL, IELTS).',
        hourlyRate: 30,
        qualifications: ['MFA Creative Writing — Columbia', 'TESOL Certified'],
        yearsOfExperience: 8,
        averageRating: 4.5,
        totalReviews: 4,
        isApproved: true,
      },
      {
        userId: tutorUsers[5]._id,
        subjects: ['Biology', 'Anatomy', 'Genetics', 'Molecular Biology'],
        bio: 'Medical doctor with a passion for teaching biological sciences. I break down complex biological concepts using clinical case studies. Perfect for pre-med students.',
        hourlyRate: 48,
        qualifications: ['MD — Johns Hopkins', 'B.Sc Biology — Duke'],
        yearsOfExperience: 11,
        averageRating: 4.4,
        totalReviews: 3,
        isApproved: true,
      },
      {
        userId: tutorUsers[6]._id,
        subjects: ['History', 'World History', 'Political Science', 'Economics'],
        bio: 'History buff with a focus on modern world history and its impact on current events. I make history come alive through storytelling and primary source analysis.',
        hourlyRate: 25,
        qualifications: ['MA History — Yale', 'BA Political Science — Georgetown'],
        yearsOfExperience: 6,
        averageRating: 4.3,
        totalReviews: 2,
        isApproved: true,
      },
      {
        userId: tutorUsers[7]._id,
        subjects: ['Economics', 'Microeconomics', 'Macroeconomics', 'Finance'],
        bio: 'Former Wall Street analyst with an MBA. I teach economics and finance with real-world market examples. Great for university students and those preparing for business school.',
        hourlyRate: 40,
        qualifications: ['MBA — Wharton', 'CFA Charterholder'],
        yearsOfExperience: 10,
        averageRating: 0,
        totalReviews: 0,
        isApproved: false, // Pending approval — for testing admin flow
      },
    ];

    const profiles = await TutorProfile.create(profileData);
    console.log(`📚 Created ${profiles.length} tutor profiles (${profiles.filter(p => p.isApproved).length} approved)`);

    // ========== AVAILABILITY SLOTS ==========
    const allSlots = [];
    const timeSlots = [
      { startTime: '08:00', endTime: '09:00' },
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '14:00', endTime: '15:00' },
      { startTime: '15:00', endTime: '16:00' },
      { startTime: '17:00', endTime: '18:00' },
      { startTime: '18:00', endTime: '19:00' },
      { startTime: '19:00', endTime: '20:00' },
    ];

    // Create varied availability for each approved tutor
    for (let i = 0; i < 7; i++) {
      const tutor = tutorUsers[i];
      // Each tutor gets 3-5 random days, 2-4 slots per day
      const numDays = 3 + Math.floor(Math.random() * 3);
      const shuffledDays = [...DAYS].sort(() => Math.random() - 0.5).slice(0, numDays);

      for (const day of shuffledDays) {
        const numSlots = 2 + Math.floor(Math.random() * 3);
        const daySlots = [...timeSlots].sort(() => Math.random() - 0.5).slice(0, numSlots);

        for (const slot of daySlots) {
          allSlots.push({
            tutorId: tutor._id,
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          });
        }
      }
    }

    const createdSlots = await Availability.create(allSlots);
    console.log(`📅 Created ${createdSlots.length} availability slots`);

    // ========== BOOKINGS ==========
    // Pick some slots to book
    const availableSlots = createdSlots.filter(s => !s.isBooked);
    const bookingsToCreate = [];

    const bookingConfigs = [
      { studentIdx: 0, slotIdx: 0, subject: 'Calculus', status: 'completed' },
      { studentIdx: 0, slotIdx: 1, subject: 'Linear Algebra', status: 'completed' },
      { studentIdx: 1, slotIdx: 2, subject: 'Physics', status: 'confirmed' },
      { studentIdx: 1, slotIdx: 3, subject: 'Mechanics', status: 'completed' },
      { studentIdx: 2, slotIdx: 4, subject: 'Organic Chemistry', status: 'completed' },
      { studentIdx: 2, slotIdx: 5, subject: 'Chemistry', status: 'pending' },
      { studentIdx: 3, slotIdx: 6, subject: 'Python', status: 'completed' },
      { studentIdx: 3, slotIdx: 7, subject: 'Data Structures', status: 'confirmed' },
      { studentIdx: 4, slotIdx: 8, subject: 'English', status: 'completed' },
      { studentIdx: 0, slotIdx: 9, subject: 'Statistics', status: 'completed' },
      { studentIdx: 1, slotIdx: 10, subject: 'Biology', status: 'completed' },
      { studentIdx: 2, slotIdx: 11, subject: 'History', status: 'confirmed' },
      { studentIdx: 3, slotIdx: 12, subject: 'Essay Writing', status: 'cancelled' },
      { studentIdx: 4, slotIdx: 13, subject: 'TOEFL Prep', status: 'pending' },
      { studentIdx: 0, slotIdx: 14, subject: 'Genetics', status: 'completed' },
      { studentIdx: 1, slotIdx: 15, subject: 'Calculus', status: 'pending' },
      { studentIdx: 4, slotIdx: 16, subject: 'Literature', status: 'completed' },
      { studentIdx: 2, slotIdx: 17, subject: 'Algorithms', status: 'completed' },
    ];

    for (const cfg of bookingConfigs) {
      if (cfg.slotIdx >= availableSlots.length) break;

      const slot = availableSlots[cfg.slotIdx];
      const tutorProfile = profiles.find(p => p.userId.toString() === slot.tutorId.toString());
      const amount = tutorProfile ? tutorProfile.hourlyRate : 30;

      bookingsToCreate.push({
        studentId: students[cfg.studentIdx]._id,
        tutorId: slot.tutorId,
        availabilitySlotId: slot._id,
        subject: cfg.subject,
        status: cfg.status,
        paymentStatus: cfg.status === 'completed' ? 'paid' : 'unpaid',
        amount,
        notes: `Session for ${cfg.subject} help`,
      });

      // Mark slot as booked (except cancelled)
      if (cfg.status !== 'cancelled') {
        slot.isBooked = true;
        await slot.save();
      }
    }

    const bookings = await Booking.create(bookingsToCreate);
    console.log(`📖 Created ${bookings.length} bookings`);

    // ========== REVIEWS ==========
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const reviewsToCreate = [];
    const reviewComments = [
      'Excellent tutor! Explained concepts very clearly and patiently.',
      'Really helped me understand the material. Would book again!',
      'Great session. Very knowledgeable and well-prepared.',
      'Fantastic experience! My grades improved significantly after our sessions.',
      'Very professional and thorough. Highly recommended!',
      'Good session overall. Could use more practice problems.',
      'Amazing tutor! Made a difficult subject fun and approachable.',
      'Solid teaching skills. Covered everything I needed for my exam.',
      'Patient and encouraging. Perfect for building confidence in the subject.',
      'Brilliant tutor. Really knows the subject inside out.',
      'Very helpful! Provided great study resources alongside the session.',
      'Wonderful experience. Will definitely be coming back for more sessions.',
    ];

    for (let i = 0; i < completedBookings.length && i < reviewComments.length; i++) {
      const booking = completedBookings[i];
      const rating = 3 + Math.floor(Math.random() * 3); // 3-5 stars

      reviewsToCreate.push({
        bookingId: booking._id,
        studentId: booking.studentId,
        tutorId: booking.tutorId,
        rating,
        comment: reviewComments[i],
      });
    }

    const reviews = await Review.create(reviewsToCreate);
    console.log(`⭐ Created ${reviews.length} reviews`);

    // Recalculate average ratings for all tutors
    for (const tutor of tutorUsers.slice(0, 7)) {
      const tutorReviews = reviews.filter(r => r.tutorId.toString() === tutor._id.toString());
      if (tutorReviews.length > 0) {
        const avg = tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length;
        await TutorProfile.findOneAndUpdate(
          { userId: tutor._id },
          {
            averageRating: Math.round(avg * 10) / 10,
            totalReviews: tutorReviews.length,
          }
        );
      }
    }
    console.log('📊 Recalculated tutor ratings');

    // ========== SUMMARY ==========
    console.log('\n🎉 Seed completed successfully!\n');
    console.log('=== Test Accounts ===');
    console.log('Admin:   admin@tutorconnect.com / password123');
    console.log('Student: alice@student.com / password123');
    console.log('Student: bob@student.com / password123');
    console.log('Tutor:   sarah@tutor.com / password123');
    console.log('Tutor:   james@tutor.com / password123');
    console.log('Tutor (pending): michael@tutor.com / password123');
    console.log('=====================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
