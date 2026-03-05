# Event Management System

A full-stack Event Management Application built as a Proof of Concept (PoC).

## Tech Stack

**Backend:** NestJS, TypeORM, PostgreSQL, JWT Authentication, Swagger  
**Frontend:** React, TypeScript, Vite, Zustand, Tailwind CSS, react-big-calendar  
**Infrastructure:** Docker, docker-compose, Nginx

## Quick Start (Docker)

The easiest way to run the project — one command:

```bash
# 1. Clone the repository
git clone https://github.com/havr1985/Application.git
cd Application

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up --build
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **Swagger Docs:** http://localhost:4000/api/docs

## Default Credentials (Seed Data)

| Email              | Password    |
|--------------------|-------------|
| john@example.com   | password123 |
| jane@example.com   | password123 |

The seed includes 2 users and 3 public events.

## Local Development

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL (or use Docker for DB only)

### Database only (Docker)
```bash
docker-compose up db
```

### Backend
```bash
cd server
pnpm install
pnpm db:migrate        # Run migrations
pnpm seed              # Seed sample data
pnpm start:dev         # Start in dev mode (port 4000)
```

### Frontend
```bash
cd client
pnpm install
pnpm dev               # Start in dev mode (port 5173)
```

## API Endpoints

| Method | Endpoint            | Description              | Auth     |
|--------|---------------------|--------------------------|----------|
| POST   | /auth/register      | Register a new user      | No       |
| POST   | /auth/login         | Login with credentials   | No       |
| POST   | /auth/refresh       | Refresh access token     | Cookie   |
| POST   | /auth/logout        | Logout and clear cookie  | Yes      |
| GET    | /events             | List public events       | No       |
| GET    | /events/:id         | Get event details        | No       |
| POST   | /events             | Create a new event       | Yes      |
| PATCH  | /events/:id         | Update event (organizer) | Yes      |
| DELETE | /events/:id         | Delete event (organizer) | Yes      |
| POST   | /events/:id/join    | Join an event            | Yes      |
| POST   | /events/:id/leave   | Leave an event           | Yes      |
| GET    | /users/me           | Get current user profile | Yes      |
| GET    | /users/me/events    | Get user's events        | Yes      |

Full API documentation available at `/api/docs` (Swagger).

## Database Schema

**Users** — id, name, email, password (hashed), timestamps  
**Events** — id, title, description, dateTime, location, capacity, visibility, organizer_id, timestamps  
**Event Participants** — event_id, user_id (many-to-many join table)

### Relationships
- One user → many organized events
- Many-to-many between users and events (participants)
- Cascade delete: removing a user deletes their organized events

## Architecture Decisions

- **Access token in memory** (Zustand store) instead of localStorage for XSS protection
- **Refresh token in httpOnly cookie** with automatic rotation
- **Manual DTO mapping** to control API response shape and demonstrate understanding
- **TypeORM migrations** instead of `synchronize: true` for production-ready workflow
- **Feature-based frontend structure** for clear separation of concerns

## Production Improvements

- Token revocation table for refresh tokens
- Structured logging with Winston/Pino
- Rate limiting on auth endpoints
- Pagination for events list
- Event search and filtering
- E2E tests with Cypress
- CI/CD pipeline

## Project Structure

```
Application/
├── client/                # React frontend
│   ├── src/
│   │   ├── app/           # App component, router
│   │   ├── features/      # Feature modules (auth, events, calendar)
│   │   ├── pages/         # Page components
│   │   └── shared/        # Shared utilities, components, types
│   ├── Dockerfile
│   └── nginx.conf
├── server/                # NestJS backend
│   ├── src/
│   │   ├── modules/       # Feature modules (auth, users, events)
│   │   ├── common/        # Shared filters, interceptors, decorators
│   │   ├── config/        # App configuration
│   │   ├── migrations/    # TypeORM migrations
│   │   └── seed/          # Database seeding
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```