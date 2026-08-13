# Job Model

**File:** `job.model.ts`

Represents a job posting in the system.

## Schema Fields
- `title` (String, required)
- `companyName` (String, required)
- `location` (String, required)
- `employmentType` (String, enum: ["Full time", "Part time", "Contract", "Internship"], required)
- `experienceLevel` (String, enum: ["Entry level", "Junior", "Mid level", "Senior", "Internship"], required)
- `salaryRange` (String)
- `skills` (Array of Strings)
- `description` (String, required)
- `responsibilities` (Array of Strings)
- `requirements` (Array of Strings)
- `aiInsights` (Object)
  - `criticalSkills` (Array of Strings)
  - `importantSkills` (Array of Strings)
  - `preferredSkills` (Array of Strings)
  - `experienceRequired` (String)
  - `keyResponsibilities` (Array of Strings)
- `applicationUrl` (String)
- `source` (String, default: "Internal")
- `externalId` (String, unique, sparse)
- `createdAt` (Date)
- `updatedAt` (Date)

## Indexes
- Text indexes on `title`, `companyName`, `skills`, `description` for full-text search.
- Regular indexes on `location`, `experienceLevel`, `employmentType`.
