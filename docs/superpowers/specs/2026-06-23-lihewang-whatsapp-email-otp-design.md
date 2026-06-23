# Lihewang — WhatsApp + Email OTP

Date: 2026-06-23

## Overview

Replace SMS OTP with WhatsApp (Twilio Verify) and Email (SendGrid) channels.

## WhatsApp

- Same Twilio Verify API, channel `"whatsapp"`
- Phone number input + OTP code input (same flow as before)
- Verify uses existing Twilio Verify check

## Email

- `@sendgrid/mail` to send 6-digit code
- In-memory Map `{email -> {code, expiresAt}}` for code storage
- Send OTP → generate code → store → send via SendGrid
- Verify OTP → check Map match + not expired → upsert user with email → create session
- User model already has `email` field

## Changes

| File | Change |
|---|---|
| `src/app/api/auth/send-otp/route.ts` | Accept `{channel, phone?, email?}`, WhatsApp or Email logic |
| `src/app/api/auth/verify-otp/route.ts` | Accept `{channel, phone?, email?, code}`, verify accordingly |
| `src/app/auth/login/page.tsx` | Channel selector (WhatsApp/Email), phone or email input |
| `src/app/auth/register/page.tsx` | Same channel selector |
| `.env.example` | Add `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` |
| `package.json` | Add `@sendgrid/mail` |
