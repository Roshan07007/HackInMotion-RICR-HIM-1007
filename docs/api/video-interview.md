# Video Interview API

Base URL: `/api/v1/video-interview`

This API module manages AI-driven mock interviews.

## Endpoints

### `POST /init`
Initialize a new mock interview session.
- **Headers:** `Authorization: Bearer <token>`
- **Body Request:**
  - `jobRole` (string)
  - `companyName` (string - optional)
  - `jobDescription` (string - optional)
  - `resumeText` (string - optional)
  - `numberOfQuestions` (number)
  - `type` ("self" | "recruiter")
- **Returns:** The newly created `VideoInterview` object (status: "in-progress").

### `GET /history`
Retrieve all past video interviews for the authenticated user.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Array of `VideoInterview` objects.

### `DELETE /:id`
Delete a specific video interview session.
- **Headers:** `Authorization: Bearer <token>`

### `POST /:id/finalize`
Complete an interview and generate a final evaluation report.
- **Headers:** `Authorization: Bearer <token>`
- **Body Request (Optional):** Can accept `multipart/form-data` containing a `videoUrl` if recording was enabled.
- **Returns:** The evaluated `VideoInterview` object including the `overallReport` (technical, communication, and confidence scores).
