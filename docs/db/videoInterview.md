# Video Interview Model

**File:** `videoInterview.model.ts`

Stores the state and final evaluation of a mock interview session.

## Schema Fields
- `userId` (ObjectId, ref: "User", required)
- `jobRole` (String, required)
- `jobDescription` (String)
- `numberOfQuestions` (Number, default: 5)
- `type` (String, enum: ["self", "recruiter"], default: "self")
- `status` (String, enum: ["in-progress", "completed", "evaluated"], default: "in-progress")
- `videoUrl` (String)
- `transcript` (Array of Transcript Sub-documents)
  - `role` (String, enum: ["assistant", "user"])
  - `content` (String)
  - `aiFeedback` (String)
  - `score` (Number)
  - `createdAt` (Date)
- `overallReport` (Object populated after final evaluation)
  - `technicalScore`, `communicationScore`, `confidenceScore` (Number)
  - `hireabilityRating` (String, enum: ["Strong Hire", "Hire", "Weak Hire", "Reject"])
  - `executiveSummary` (String)
  - `strengths`, `weaknesses` (Array of Strings)
- `createdAt` (Date)
- `updatedAt` (Date)
