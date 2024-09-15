# OBRIO-test

## Desctiption

This project is built with NestJS, TypeORM, and BullMQ. It includes services for managing users, offers, and purchases, with integration for sending reports via queues using Redis.

## Requirements

Before starting, ensure you have the following installed:

1. Node.js (v16.x.x or later)
2. Docker (for running Postgres and Redis)

## Setup and Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

Create a .env file in the root directory and add the following environment variables:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_DATABASE=mydatabase
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Docker setup (Postgres & Redis)

To launch the required services (Postgres and Redis), execute the following command:

```bash
docker compose up -d
```

This will start Postgres and Redis containers in the background.

## Running the project

To start the NestJS project, run:

```bash
npm start
```

## Accessing the project

Once the project is running, you can access the following routes via http://localhost:3000:

POST /users: Create a new user

POST /offers: Create a new offer

POST /purchases: Create a new purchase

The API is accessible via Postman or another REST client.

## Testing

To run unit tests:

```bash
npm run test
```
