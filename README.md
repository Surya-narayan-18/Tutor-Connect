# TutorConnect — AI-Powered Tutor Marketplace

A full-stack tutor marketplace where students can search for tutors, get AI-powered recommendations, book sessions, and leave reviews. Tutors manage their profiles, availability, and bookings. Admins moderate the platform.

## Tech Stack

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB + Mongoose** — Database & ODM
- **JWT + bcrypt** — Authentication & password hashing
- **express-validator** — Input validation
- **Groq SDK** — AI-powered tutor recommendations (LLM explanations)
- **helmet, cors, morgan** — Security & logging

### Frontend
- **React (Vite)** — UI framework
- **Tailwind CSS v4** — Styling (via `@tailwindcss/vite` plugin)
- **React Router v6** — Client-side routing
- **Redux Toolkit** — State management (bookings, tutors, recommendations)
- **Context API** — Auth/session state
- **Axios** — API client
- **react-hook-form + zod** — Form validation

---

## Project Structure

```
Tutor Connect/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, role, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed/            # Database seed script
│   ├── utils/           # Scoring engine
│   ├── validators/      # Express-validator rules
│   ├── server.js        # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store & slices
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Routing
│   │   └── index.css    # Design system
│   └── .env.example
└── README.md
```

---

## Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (or Atlas URI)
- **Groq API Key** (optional — for AI recommendation explanations)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values:
#   MONGO_URI=mongodb://localhost:27017/tutorconnect
#   JWT_SECRET=<your-secret>
#   GROQ_API_KEY=<your-groq-key>  (optional)

# Seed the database with demo data
npm run seed

# Start the development server
npm run dev
```

The API will run on **http://localhost:5000**.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The app will run on **http://localhost:5173**.

---

## Demo Accounts (after seeding)

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@tutorconnect.com     | password123 |
| Student | alice@student.com          | password123 |
| Student | bob@student.com            | password123 |
| Tutor   | sarah@tutor.com            | password123 |
| Tutor   | james@tutor.com            | password123 |
| Tutor   | michael@tutor.com (pending)| password123 |

---

## API Endpoints

### Auth
| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | /api/auth/register | Register new user      |
| POST   | /api/auth/login    | Login                  |
| GET    | /api/auth/me       | Get current user       |

### Tutors
| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| GET    | /api/tutors             | Search/filter tutors           |
| GET    | /api/tutors/:id         | Get tutor profile              |
| POST   | /api/tutors/profile     | Create/update profile (tutor)  |
| GET    | /api/tutors/profile/me  | Get own profile (tutor)        |
| PUT    | /api/tutors/availability| Set availability (tutor)       |

### Recommendations
| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | /api/recommendations  | AI-powered tutor matching (student)|

### Bookings
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| POST   | /api/bookings              | Create booking (student) |
| GET    | /api/bookings/me           | Get my bookings          |
| GET    | /api/bookings/:id          | Get booking details      |
| PUT    | /api/bookings/:id/status   | Update booking status    |

### Reviews
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | /api/reviews              | Create review (student)   |
| GET    | /api/reviews/tutor/:id    | Get tutor reviews         |

### Admin
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| GET    | /api/admin/users              | List all users         |
| PUT    | /api/admin/users/:id/status   | Activate/deactivate    |
| GET    | /api/admin/tutors/pending     | Pending tutor profiles |
| PUT    | /api/admin/tutors/:id/approve | Approve/reject tutor   |
| GET    | /api/admin/analytics          | Platform analytics     |
| GET    | /api/admin/bookings           | All bookings           |
| DELETE | /api/admin/reviews/:id        | Remove a review        |

---

## AI Recommendation Engine

The recommendation system works in 4 steps:

1. **Hard Filter** — Pulls approved tutors matching budget and subject constraints
2. **Scoring Engine** — Ranks tutors with a weighted composite score:
   - Subject relevance (40%) — keyword matching against subjects and bio
   - Average rating (25%) — normalized to 0-1
   - Price fit (20%) — relative to student's budget
   - Availability match (15%) — checks preferred time window
3. **LLM Explanation** (Groq) — Generates personalized match reasons per tutor
4. **Logging** — Saves query and results for analytics

The AI feature gracefully degrades: if no `GROQ_API_KEY` is configured or the API call fails, the system returns scored results with generic reason strings.

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/tutorconnect
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key    # optional
GROQ_MODEL=llama-3.3-70b-versatile
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Security Notes

- Passwords are hashed with **bcrypt** (12 salt rounds) and never returned in API responses
- JWT tokens are stored in **localStorage** for simplicity
  - ⚠️ **Tradeoff**: localStorage is vulnerable to XSS attacks. For production, use httpOnly cookies with CSRF protection.
- All routes use input validation via `express-validator`
- `helmet` middleware adds security headers
- CORS is configured to accept requests only from the frontend origin
