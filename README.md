# Weather Application

A weather application built with TypeScript, Express, and PostgreSQL.

## Prerequisites

- Node.js >= 18.0.0
- MySQL
  
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



### Weather



          
# Weather API Documentation

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Login to Get Token

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Then you should add that token in Authorization header as "Bearer: eyJhbGciOiJIUzI1NiIs..."

## Weather Endpoints

### Get Current Weather

```http
GET /api/weather/current?city={cityName}
```

**Parameters:**
- `city` (required): Name of the city to get weather data for

**Response:**
```json
{
  "city": "London",
  "temperature": 15.6,
  "description": "scattered clouds",
  "humidity": 76,
  "windSpeed": 3.6
}
```

**Error Responses:**
- `400`: City parameter is missing
  ```json
  { "message": "City parameter is required" }
  ```
- `401`: Not authenticated
  ```json
  { "message": "User not authenticated" }
  ```
- `404`: City not found
  ```json
  { "message": "City not found" }
  ```
- `500`: Server error
  ```json
  { "message": "Weather service unavailable" }
  ```

### Get Weather Queries History

```http
GET /api/weather/queries
```

**Response for Admin Users:**
```json
[
  {
    "id": "1",
    "userId": "user123",
    "city": "London",
    "queryData": {
      "temperature": 15.6,
      "description": "scattered clouds",
      "humidity": 76,
      "windSpeed": 3.6
    },
    "createdAt": "2024-05-20T21:42:37.092Z"
  }
]
```

**Response for Regular Users:**
- Returns only the queries made by the authenticated user

**Error Responses:**
- `401`: Not authenticated
  ```json
  { "message": "User not authenticated" }
  ```
- `500`: Server error
  ```json
  { "message": "Internal server error" }
  ```


## Notes
- Weather data is cached for 30 minutes to minimize API calls however redis is not used in this project
- PostgreSQL is not used in this project. The database is managed via mySQL.
- All timestamps are in ISO 8601 format
- Temperature is in Celsius
- Wind speed is in meters per second
        
