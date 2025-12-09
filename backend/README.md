# HR Backend API

Backend API built with Node.js, Express, MongoDB, and Joi validation.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── Admin.js             # Admin model
│   ├── controllers/
│   │   └── adminController.js   # Admin controller (login, me)
│   ├── routes/
│   │   └── admin.js             # Admin routes
│   ├── middlewares/
│   │   └── auth.js              # Authentication middleware
│   └── validators/
│       └── adminValidator.js    # Joi validation schemas
├── scripts/
│   └── seedAdmin.js             # Seed script for admin
├── server.js                    # Main server file
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hr_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

3. Run seed script to create default admin:
```bash
npm run seed:admin
```

This will create an admin with:
- Username: `general`
- Password: `general123`

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Admin Routes

#### POST `/api/admin/login`
Login admin.

**Request Body:**
```json
{
  "username": "general",
  "password": "general123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "admin": {
    "id": "admin-id",
    "username": "general"
  }
}
```

#### GET `/api/admin/me`
Get current admin information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": "admin-id",
    "username": "general",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Admin Model

The Admin model has the following fields:
- `username` (String, required, unique)
- `password` (String, required, min 6 characters)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

Passwords are automatically hashed using bcrypt before saving.

