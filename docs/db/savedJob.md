# Saved Job Model

**File:** `savedJob.model.ts`

Tracks which jobs a user has bookmarked.

## Schema Fields
- `userId` (ObjectId, ref: "User", required)
- `jobId` (ObjectId, ref: "Job", required)
- `createdAt` (Date)
- `updatedAt` (Date)

## Indexes
- Unique compound index on `{ userId: 1, jobId: 1 }`
