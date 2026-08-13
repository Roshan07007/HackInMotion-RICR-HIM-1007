# Jobs API

Base URL: `/api/v1/jobs`

This API module manages job listings, applying for jobs, and saving jobs.

## Endpoints

### `GET /`
Fetch a list of jobs.
- **Query Params:**
  - `q`: Search string (title, company, skills, description)
  - `location`: Location string
  - `employmentType`: "Full time", "Part time", etc.
  - `experienceLevel`: "Entry level", "Junior", etc.
  - `page`: Pagination page number
  - `limit`: Number of items per page

### `GET /:id`
Fetch a single job by its ID.

### `POST /:id/apply`
Apply to a job.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Confirmation message.

### `POST /:id/save`
Save a job for later.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Confirmation message.

### `DELETE /:id/save`
Remove a job from the user's saved list.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Confirmation message.

### `GET /saved`
Retrieve all jobs saved by the authenticated user.
- **Headers:** `Authorization: Bearer <token>`

### `GET /applied`
Retrieve all jobs the authenticated user has applied for.
- **Headers:** `Authorization: Bearer <token>`
