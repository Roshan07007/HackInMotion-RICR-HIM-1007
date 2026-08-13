# Applied Job Model

**File:** `appliedJob.model.ts`

Tracks which jobs a user has applied for or opened.

## Schema Fields
- `userId` (ObjectId, ref: "User", required)
- `jobId` (ObjectId, ref: "Job", required)
- `status` (String, enum: ["Applied", "Opened"], required)
- `appliedAt` (Date - functions as createdAt)

## Indexes
- Unique compound index on `{ userId: 1, jobId: 1 }`
