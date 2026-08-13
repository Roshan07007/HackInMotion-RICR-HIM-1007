# Career Chat Model

**File:** `careerChat.model.ts`

Stores the overarching career mentoring chat history for a user.

## Schema Fields
- `userId` (ObjectId, ref: "User", required, unique) - Ensures one career chat per user.
- `messages` (Array of Message Sub-documents)
  - `role` (String, enum: ["user", "assistant", "system"])
  - `content` (String)
  - `createdAt` (Date)
- `createdAt` (Date)
- `updatedAt` (Date)
