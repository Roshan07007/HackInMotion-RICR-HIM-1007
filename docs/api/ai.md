# AI API

Base URL: `/api/v1/ai`

This API module handles integration with the Groq AI service for resume analysis and career mentoring.

## Endpoints

### `POST /resume-feedback`
Upload or provide resume text to be analyzed against a specific job description.
- **Headers:** `Authorization: Bearer <token>`
- **Body Request:**
  - `jobDescription` (string)
  - `resumeText` (string)
  - `jobRole` (string)
  - `companyName` (string - optional)
- **Returns:** A comprehensive `ResumeAnalysis` object containing match scores, keyword checks, ATS compatibility, bullet point analysis, and interview prep suggestions.

### `GET /career-chat`
Retrieve the current user's ongoing career mentor chat history.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** The `CareerChat` object containing the history of messages.

### `POST /career-chat`
Send a message to the AI career mentor.
- **Headers:** `Authorization: Bearer <token>`
- **Body Request:**
  - `message` (string)
- **Returns:** The updated chat messages including the AI's response.
