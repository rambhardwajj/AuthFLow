🔐 AuthFlow
A full-stack, secure authentication system built with Node.js, Prisma, and TypeScript. AuthFlow supports session management, Google OAuth, role-based access control, and more — designed for modern, scalable applications.

🚀 Features
✅ Authentication & Authorization
JWT-based Access & Refresh Tokens

Refresh token rotation and expiry

Session limit enforcement (e.g., max 5 devices)

Google OAuth 2.0 login (via token verification)

Password hashing with bcrypt

Role-based access (Admin/User)

🛡️ Security
Refresh tokens are hashed in the DB

Session-bound by IP + User-Agent

Auto logout on mismatch or token reuse

Support for logout from current, specific, or all sessions

📧 Email Support
Mailgen + Mailtrap for:

📬 Email verification

🔑 Password reset

Custom templated email content

👤 User Management
Admin-only:

View all users (with last activity + session count)

Change user roles

Delete users or force-logout their sessions

Profile fetch with sanitized user data

🧠 Tech Stack
Backend: Node.js, Express.js, TypeScript

ORM: Prisma + PostgreSQL (or MongoDB if customized)

Auth: JWT (access & refresh), Google OAuth

Email: Mailtrap, Mailgen

Security: Bcrypt, Hashed tokens, Session validation

Logging: Custom logger using Winston

🗂️ Folder Structure
bash
Copy
Edit
src/
├── configs/
│   ├── db.ts              # Prisma client
│   ├── env.ts             # Environment variables
│   └── logger.ts          # Winston logger setup
├── controllers/
│   ├── auth.controller.ts
│   ├── session.controller.ts
│   └── admin.controller.ts
├── middlewares/
│   ├── auth.ts
│   ├── error.ts
│   └── rateLimiter.ts
├── models/                # Prisma schema definitions
├── routes/
├── utils/
│   ├── asyncHandler.ts
│   ├── CustomError.ts
│   ├── sendMail.ts
│   ├── helper.ts
│   └── sanitizeUser.ts
🧪 API Endpoints (Highlights)
🔑 Auth Routes
POST /auth/login

POST /auth/register

POST /auth/google

POST /auth/refresh-token

POST /auth/logout

POST /auth/logout-all

GET /auth/sessions

DELETE /auth/sessions/:sessionId

GET /auth/profile

👑 Admin Routes
GET /admin/users

GET /admin/users/:userId/sessions

PATCH /admin/users/:userId/role

DELETE /admin/users/:userId

DELETE /admin/sessions/:sessionId

🧾 Environment Variables
env
Copy
Edit
# Auth
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=30d

# Session Control
MAX_SESSIONS=5

# Mailtrap
MAILTRAP_TOKEN=
MAILTRAP_SENDERMAIL=

# General
CLIENT_URL=http://localhost:3000
🛠️ Scripts
bash
Copy
Edit
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
📦 Deployment Notes
Refresh tokens are set as HttpOnly cookies

Ensure HTTPS and same-site policies in production

Prisma migrations must be applied before production build:

bash
Copy
Edit
npx prisma migrate deploy
