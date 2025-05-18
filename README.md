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
- POST /api/auth/login - User login

## License

MIT