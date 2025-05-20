# Weather Application

A weather application built with TypeScript, Express, and PostgreSQL.

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL
- Redis

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration

5. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

6. Create the initial admin user:

```bash
npx ts-node scripts/
create-admin.ts
```
This will create an admin user with:

- Email: admin@gmail.com
- Password: admin123
- Role: ADMIN

7. Start the application:
   ```bash
   npm start
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Build

Compile the TypeScript code:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
├── src/
│   ├── index.ts          # Application entry point
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── prisma/
│   └── schema.prisma    # Database schema
└── tests/               # Test files
```

## API Endpoints

### Authentication

#### Login
- **POST** `/api/auth/login`
- **Description:** Authenticate a user and receive a JWT token
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```


- **Response (200):**
```
{
  "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER|ADMIN"
  },
  "token": "jwt.token.here"
}
```

#### Create User (Admin Only)
- **POST** /api/auth/users
- **Description:** Create a new user (requires admin authentication)
- **Headers:**
  - Authorization: Bearer <admin_token>
- **Body:**
  ```
  {
    "email": "newuser@example.com",
    "password": "userpassword",
    "name": "New User",
    "role": "USER"
  }
  ```
- **Response (201):**
  ```
  {
    "user": {
        "id": "user-uuid",
        "email": "newuser@example.com",
        "name": "New User",
        "role": "USER"
    },
    "token": "jwt.token.here"
  }
  ```

