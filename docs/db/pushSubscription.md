# Push Subscription Model

**File:** `pushSubscription.model.ts`

Stores web push notification subscriptions.

## Schema Fields
- `endpoint` (String, required, unique)
- `keys` (Object)
  - `p256dh` (String, required)
  - `auth` (String, required)
- `user` (ObjectId, ref: "User")
- `role` (String, enum: ["admin", "user"], default: "user")
- `expiresAt` (Date, expires field, default 7 days from now)
- `createdAt` (Date)
- `updatedAt` (Date)
