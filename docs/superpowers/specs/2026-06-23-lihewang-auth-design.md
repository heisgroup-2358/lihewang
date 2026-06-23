# Lihewang — Auth System Design

Date: 2026-06-23

## Overview

Phone OTP authentication via Twilio Verify API, JWT in httpOnly cookie, middleware route protection.

## Auth Flow

1. User enters phone → `POST /api/auth/send-otp` → Twilio sends SMS with code
2. User enters code → `POST /api/auth/verify-otp` → verify with Twilio → upsert User in DB → set JWT cookie → redirect
3. Registration: phone + name + optional referral code, upserted on first verification
4. Logout: clear cookie
5. `GET /api/auth/me`: decode JWT from cookie, return user

## JWT

- `jose` library (Edge-compatible)
- Cookie name: `session`
- httpOnly, secure, sameSite=lax, path=/, maxAge=7 days
- Payload: `{ userId, phone, role }`
- Secret: `process.env.JWT_SECRET`

## API Routes

- `POST /api/auth/send-otp` — calls Twilio Verify
- `POST /api/auth/verify-otp` — verifies code, creates/updates user, sets cookie
- `POST /api/auth/logout` — clears cookie
- `GET /api/auth/me` — returns current user

## Middleware (`src/middleware.ts`)

- `/account/*` — must have valid session
- `/admin/*` — must have `role` starting with "wholesale" or "admin"
- `/wholesale/*` — must have valid session
- API routes `/api/orders`, `/api/cart`, `/api/withdrawals` — must have valid session

## Dependencies

- `twilio` — Twilio Verify SDK
- `jose` — JWT for Edge runtime

## Env Vars

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
JWT_SECRET=
```

## Implementation Order

1. Install deps + add env vars to .env.example
2. Create `src/lib/auth.ts` (JWT helpers + Twilio client)
3. Create auth API routes (send-otp, verify-otp, logout, me)
4. Create `src/middleware.ts`
5. Update login/register pages to call real APIs
6. Build + lint + test + commit
