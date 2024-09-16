# OBRIO-test

## Description

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

## Notes

У файлі purchases.service.ts для спрощення я додав два повідомлення в черги, але ідеальним рішенням було б надсилати одну подію та обгорнути цей процес у транзакцію, щоб гарантувати, що повідомлення буде точно відправлено. З точки зору кращих практик, доцільніше було б реалізувати outbox pattern.

Також варто зазначити, що BullMQ намагається дотримуватись принципу "exactly once" для доставки повідомлень, але в гіршому випадку може забезпечити "at least once" доставку. У моєму рішенні я виходжу з припущення, що зовнішні сервіси, на які надсилаються звіти, є ідемпотентними, тобто можуть обробляти дублікати повідомлень без негативних наслідків.
