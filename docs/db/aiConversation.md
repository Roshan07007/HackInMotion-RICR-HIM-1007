# AI Conversation Model

**File:** `aiConversation.model.ts`

Stores specific AI conversations, often related to a specific job role.

## Schema Fields
- `userId` (ObjectId, ref: "User", required)
- `jobRole` (String, required)
- `messages` (Array of Message Sub-documents)
  - `role` (String, enum: ["user", "assistant", "system"])
  - `content` (String)
  - `createdAt` (Date)
- `isActive` (Boolean, default: true)
- `createdAt` (Date)
- `updatedAt` (Date)
