# Smart Attendance Backend API

This document describes the backend API surface exposed by the Smart Attendance service.

## Base URL

- Local: http://localhost:3000

## Authentication

### POST /auth/login

Authenticates a user and returns access and refresh tokens.

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

### GET /auth/me

Returns the current authenticated user payload.

Authorization: Bearer token

## Academic Years

### POST /academic-years

Creates a new academic year.

Role: Admin

Request body:

```json
{
  "name": "2026-2027",
  "startDate": "2026-06-01",
  "endDate": "2027-05-31",
  "isCurrent": false,
  "isActive": true
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "2026-2027"
  }
}
```

Possible errors:
- 400 Validation Error
- 401 Unauthorized
- 403 Forbidden
- 409 Conflict

### GET /academic-years

Returns all academic years.

### GET /academic-years/:id

Returns one academic year by ID.

### PATCH /academic-years/:id

Updates an academic year.

## Departments

### POST /departments

Creates a new department.

Role: Admin

Request body:

```json
{
  "name": "Computer Science",
  "code": "CS",
  "description": "Computer Science Department"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Computer Science",
    "code": "CS"
  }
}
```

Possible errors:
- 400 Validation Error
- 401 Unauthorized
- 403 Forbidden
- 409 Conflict

### GET /departments

Returns all departments.

### GET /departments/:id

Returns one department by ID.

### PATCH /departments/:id

Updates a department.

## Users

### POST /users

Creates a new user.

Role: Admin

### GET /users

Returns all users.

### GET /users/:id

Returns one user by ID.

## Error Format

All errors follow the standardized shape:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Academic year name already exists."
  },
  "timestamp": "..."
}
```
