# HireMe API Documentation

This document outlines the REST API endpoints available in the HireMe backend.

## Base URL
All endpoints are relative to the configured base API path (e.g., `http://localhost:5000/api`).

---

## 1. Authentication Routes (`/auth`)

These routes handle user registration, login, and profile management.

### `POST /auth/register`
- **Description:** Register a new user.
- **Body:** `{ "name", "email", "password" }`

### `POST /auth/login`
- **Description:** Authenticate an existing user and return a JWT.
- **Body:** `{ "email", "password" }`

### `GET /auth/me`
- **Description:** Retrieve the authenticated user's profile information.
- **Headers:** `Authorization: Bearer <token>`

### `PUT /auth/profile`
- **Description:** Update the authenticated user's profile details.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "preferences", "resumeText", etc. }`

---

## 2. Job Routes (`/jobs`)

These routes handle job retrieval, filtering, applying, and saving.

### `GET /jobs`
- **Description:** List jobs based on optional query parameters.
- **Query Parameters:** `q` (search query), `location`, `employmentType`, `experienceLevel`, `page`, `limit`

### `GET /jobs/:id`
- **Description:** Retrieve details for a specific job by ID.

### `POST /jobs/:id/apply`
- **Description:** Submit an application for the specified job.
- **Headers:** `Authorization: Bearer <token>`

### `POST /jobs/:id/save`
- **Description:** Save a job to the user's saved list.
- **Headers:** `Authorization: Bearer <token>`

### `DELETE /jobs/:id/save`
- **Description:** Remove a job from the user's saved list.
- **Headers:** `Authorization: Bearer <token>`

### `GET /jobs/saved`
- **Description:** Retrieve a list of all jobs saved by the user.
- **Headers:** `Authorization: Bearer <token>`

### `GET /jobs/applied`
- **Description:** Retrieve a list of all jobs the user has applied for.
- **Headers:** `Authorization: Bearer <token>`

---

## 3. AI Features (`/ai`)

These routes integrate with the Groq API to provide AI-driven features.

### `POST /ai/resume-feedback`
- **Description:** Evaluate the user's resume against a job description to get a match score and actionable feedback.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "jobDescription", "resumeText" }`

### `GET /ai/career-chat`
- **Description:** Retrieve the user's career mentor chat history.
- **Headers:** `Authorization: Bearer <token>`

### `POST /ai/career-chat`
- **Description:** Send a message to the AI career mentor and receive a contextual response.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "message" }`

---

## 4. Video Interview (`/video-interview`)

These routes manage the AI-powered mock interview functionality.

### `POST /video-interview/init`
- **Description:** Initialize a new mock interview session based on role, company, and resume context.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "jobRole", "companyName", "jobDescription", "resumeText", "numberOfQuestions", "type" }`

### `GET /video-interview/history`
- **Description:** Retrieve the user's past mock interview records.
- **Headers:** `Authorization: Bearer <token>`

### `DELETE /video-interview/:id`
- **Description:** Delete a specific mock interview record.
- **Headers:** `Authorization: Bearer <token>`

### `POST /video-interview/:id/finalize`
- **Description:** Complete an interview session and generate the final performance report. Optionally accepts form-data if uploading video/audio recordings.
- **Headers:** `Authorization: Bearer <token>`

---

## 5. File Uploads (`/upload`)

### `POST /upload`
- **Description:** Upload a file (such as a PDF resume) to the server for processing/storage.
- **Headers:** `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
- **Body:** Form data containing the `file`.
