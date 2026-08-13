# Auth API

Base URL: `/api/v1/auth`

This API module handles user authentication and profile management.

## Endpoints

### `POST /register`
Creates a new user account.
- **Body Request:**
  - `name` (string) - Required
  - `email` (string) - Required
  - `password` (string) - Required
- **Returns:** User object and JWT token.

### `POST /login`
Authenticates a user.
- **Body Request:**
  - `email` (string) - Required
  - `password` (string) - Required
- **Returns:** User object and JWT token.

### `GET /me`
Retrieves the currently authenticated user's profile.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** User object.

### `PUT /profile`
Updates the authenticated user's profile.
- **Headers:** `Authorization: Bearer <token>`
- **Body Request:** (Partial User fields such as `name`, `phone`, `bio`, `preferences`, etc.)
- **Returns:** Updated User object.
