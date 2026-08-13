# OTP Model

**File:** `otp.model.ts`

Stores temporary One-Time Passwords for verification.

## Schema Fields
- `email` (String, required)
- `otp` (String, required)
- `createdAt` (Date, default: Date.now, expires after 300 seconds)
