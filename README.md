# Gym Management System ✅
Groq AI + JWT Auth + RBAC + Fitness Dashboard UI

✅ React (Vite) + TailwindCSS (Dark mode fitness dashboard + progress bar)  
✅ Node.js + Express + MongoDB Atlas  
✅ AI: Groq generates personalized workout/diet plans  
✅ AI triggers: when admin updates member OR member logs attendance  
✅ Security: JWT, bcrypt, RBAC, validation, sanitization, Helmet, rate-limit, optional CSRF  
✅ Optional emails via Resend free tier

---

## Folder Structure
```
gym-management-groq-rbac/
  frontend/
  backend/
  README.md
```

---

# Features

## Member (User)
- Signup/Login
- View membership details (plan/trainer/payment)
- Log attendance
- Receives AI personalized workout/diet plan

## Admin
- Add/update member profile by email
- Assign trainer and plan
- Track payment status
- AI plan auto-generated on update

---

# 1) Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

Backend: `http://localhost:5000`

Fill `.env`:
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`

---

# 2) Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

---

# RBAC - Create Admin
All signups are created as `role=user`.

Make admin:
MongoDB Atlas → `users` collection → change role:
```json
"role": "admin"
```

Login again → admin dashboard enabled.

---

# Groq AI Setup
From console.groq.com:
```
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-8b-instant
```

---

# Deployment (Free Tier)

## Backend → Render
- Root: `backend`
- Build: `npm install`
- Start: `npm start`

## Frontend → Vercel
- Root: `frontend`
- Env var:
```
VITE_API_BASE_URL=https://<render-backend-url>
```

---

# Security Notes (Viva)
- bcrypt hashing
- JWT + token expiry
- logout invalidation (blacklist TTL)
- helmet security headers
- rate limiter
- validation + sanitization
- optional CSRF (`ENABLE_CSRF=1`)
- HTTPS-ready

---

## Author
Final Year BTech Mini Project - Gym Management System
