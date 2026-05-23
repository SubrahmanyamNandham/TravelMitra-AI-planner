# Travel.io Auth API Postman Documentation

## Overview
This document describes how to test the Travel.io authentication API using Postman.

### Base URL
`http://localhost:5000`

### Available endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET  /api/auth/me`

## Run the backend first
In the `server/` folder, run:

```bash
cd server
npm install
npm start
```

## Postman environment
Create a Postman environment with these variables:

- `base_url`: `http://localhost:5000`
- `access_token`: (empty)

## 1. Signup

- Method: `POST`
- URL: `{{base_url}}/api/auth/signup`
- Headers:
  - `Content-Type: application/json`
- Body: raw JSON

Example body:

```json
{
  "name": "Test User",
  "email": "test.user@example.com",
  "password": "Password123!"
}
```

Response example:

```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test.user@example.com",
    "createdAt": "2026-05-19T...",
    "updatedAt": "2026-05-19T..."
  },
  "accessToken": "eyJ..."
}
```

> A `refreshToken` cookie is set automatically by the server.

## 2. Login

- Method: `POST`
- URL: `{{base_url}}/api/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body: raw JSON

Example body:

```json
{
  "email": "test.user@example.com",
  "password": "Password123!"
}
```

Response example:

```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test.user@example.com",
    "createdAt": "2026-05-19T...",
    "updatedAt": "2026-05-19T..."
  },
  "accessToken": "eyJ..."
}
```

## 3. Refresh token

- Method: `POST`
- URL: `{{base_url}}/api/auth/refresh`
- No body required
- Make sure Postman sends cookies from previous login/signup

Response example:

```json
{
  "accessToken": "eyJ..."
}
```

## 4. Logout

- Method: `POST`
- URL: `{{base_url}}/api/auth/logout`
- No body required
- Make sure Postman sends the `refreshToken` cookie

Response example:

```json
{
  "message": "Logout successful."
}
```

## 5. Get current user

- Method: `GET`
- URL: `{{base_url}}/api/auth/me`
- Header:
  - `Authorization: Bearer {{access_token}}`

Response example:

```json
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test.user@example.com",
    "createdAt": "2026-05-19T...",
    "updatedAt": "2026-05-19T..."
  }
}
```

## Postman tips
- Use `raw` JSON bodies for signup and login.
- Add `Content-Type: application/json` header for POST requests.
- Enable the Postman cookie jar so refresh cookies are stored automatically.
- After login, copy the returned `accessToken` into the `access_token` environment variable.
- Use the `Authorization` header only for the `/me` endpoint.

## Optional: use environment variables
In Postman, set:

- `base_url` = `http://localhost:5000`
- `access_token` = `<token returned by signup or login>`

Then use `{{base_url}}` in request URLs and `{{access_token}}` in the Authorization header.
