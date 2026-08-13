# Resume Analysis Model

**File:** `resumeAnalysis.model.ts`

Stores the deeply parsed and AI-evaluated feedback for a resume against a specific job description.

## Schema Fields
- `userId` (ObjectId, ref: "User", required)
- `jobRole` (String, required)
- `companyName` (String)
- `location` (String)
- `jobDescription` (String)
- `documentUrl` (String)
- `resumeText` (String, required)
- `scores` (Object containing detailed numerical match scores)
  - `overallMatch`, `skillsMatch`, `experienceMatch`, `keywordMatch`, `projectRelevance`, `educationMatch`, `atsReadiness`, `impactQuantification` (Number)
- `skillMatch` (Object)
  - `strongMatches`, `missingSkills` (Array of Strings)
  - `weakEvidence` (Array of `{ skill, reason }`)
  - `keywordCoveragePercentage` (Number)
- `matchExplanations` (Array of `{ category, explanation }`)
- `atsSimulation` (Object)
  - `passedChecks`, `failedChecks` (Array of Strings)
- `qualityAnalysis` (Array of `{ category, feedback }`)
- `bulletAnalysis` (Array of Objects)
  - `original`, `problem`, `suggestedStructure` (String)
  - `missing` (Array of Strings)
  - `options` (Object containing `conservative`, `impactFocused`, `technical`)
- `recommendations` (Array of Objects)
  - `impact` (String: "High", "Medium", "Low")
  - `action`, `why`, `how` (String)
- `summarySuggestions` (Object)
  - `current`, `analysis`, `conservative`, `strong` (String)
- `interviewPrep` (Object)
  - `likelyTopics`, `questions` (Array of Strings)
- `createdAt` (Date)
- `updatedAt` (Date)
