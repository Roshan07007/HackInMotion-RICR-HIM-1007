# User Model

**File:** `user.model.ts`

Stores the primary user information and application preferences.

## Schema Fields
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `phone` (String)
- `avatar` (Object)
  - `publicId` (String)
  - `url` (String)
- `resume` (Object)
  - `publicId` (String)
  - `url` (String)
- `bio` (String, maxLength: 1000)
- `github`, `linkedin`, `website`, `otherLink` (String)
- `password` (String, required)
- `role` (String, enum: ["user", "admin", "other"], default: "user")
- `expoPushTokens` (Array of Strings)
- `preferences` (Object)
  - `skills` (Array of Strings)
  - `desiredJobs` (Array of Strings)
  - `desiredCompanies` (Array of Strings)
  - `experienceLevel` (String, enum: ["beginner", "intermediate", "expert"], default: "intermediate")
  - `aiCommunicationStyle` (String, enum: ["formal", "casual", "technical"], default: "casual")
  - `cameraEnabled` (Boolean, default: true)
  - `microphoneEnabled` (Boolean, default: true)
  - `theme` (String, enum: ["dark", "light", "system"], default: "system")
- `createdAt` (Date)
- `updatedAt` (Date)
