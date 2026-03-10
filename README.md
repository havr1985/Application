# Event Management System

A full-stack Event Management Application built as a Proof of Concept (PoC).

## Tech Stack

**Backend:** NestJS, TypeORM, PostgreSQL, JWT Authentication, Swagger, Groq AI (Llama 4 Scout)  
**Frontend:** React, TypeScript, Vite, Zustand, Tailwind CSS, react-big-calendar, Storybook  
**Infrastructure:** Docker, docker-compose, Nginx

## Live Demo

- **Frontend:** https://event-management-client-xyxq.onrender.com
- **Backend API:** https://event-management-server-wzmt.onrender.com/api
- **Swagger Docs:** https://event-management-server-wzmt.onrender.com/api/docs

> Note: Free tier on Render has a cold start (~30 seconds) on first request.

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/havr1985/Application.git
cd Application

# 2. Copy environment file and add your GROQ_API_KEY
cp .env.example .env

# 3. Start all services
docker-compose up
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

The seed includes 2 users, 10 tags, and 3 public events with tags.

## Features

### Stage 1 — Core
- Authentication (register, login, JWT with refresh token rotation)
- Events CRUD (create, read, update, delete)
- Join / Leave events with capacity control
- Calendar view (monthly and weekly) with react-big-calendar
- Responsive design (desktop and mobile)

### Stage 2 — Tags & AI
- **Tags** — multi-tag classification for events (max 5 per event), tag-based filtering, color-coded chips, calendar events colored by first tag
- **AI Assistant** — natural-language event queries powered by Groq API (Llama 4 Scout) with function calling. The AI selects appropriate tools (getUserEvents, getPublicEvents, getEventDetails) based on the question, fetches only relevant data from the database, and generates a precise answer. Includes fallback to context-based approach if function calling fails.
- **Storybook** — component library with isolated stories for Button, SearchInput, TagChips, EventActionButton, DeleteEventModal, EventForm

## API Endpoints

| Method | Endpoint            | Description              | Auth     |
|--------|---------------------|--------------------------|----------|
| POST   | /auth/register      | Register a new user      | No       |
| POST   | /auth/login         | Login with credentials   | No       |
| POST   | /auth/refresh       | Refresh access token     | Cookie   |
| POST   | /auth/logout        | Logout and clear cookie  | Yes      |
| GET    | /events             | List events (tag filter) | Optional |
| GET    | /events/:id         | Get event details        | No       |
| POST   | /events             | Create a new event       | Yes      |
| PATCH  | /events/:id         | Update event (organizer) | Yes      |
| DELETE | /events/:id         | Delete event (organizer) | Yes      |
| POST   | /events/:id/join    | Join an event            | Yes      |
| POST   | /events/:id/leave   | Leave an event           | Yes      |
| GET    | /users/me           | Get current user profile | Yes      |
| GET    | /users/me/events    | Get user's events        | Yes      |
| GET    | /tags               | Get all tags             | No       |
| POST   | /ai/ask             | Ask AI assistant         | Yes      |

Full API documentation available at `/api/docs` (Swagger).

## Database Schema

**Users** — id, name, email, password (hashed), timestamps  
**Events** — id, title, description, dateTime, location, capacity, visibility, organizer_id, timestamps  
**Tags** — id, name (unique, case-insensitive), timestamps  
**Event Participants** — event_id, user_id (many-to-many join table)  
**Event Tags** — event_id, tag_id (many-to-many join table)

### Relationships
- One user → many organized events
- Many-to-many between users and events (participants)
- Many-to-many between events and tags
- Cascade delete: removing a user deletes their organized events

## AI Assistant Architecture

The AI assistant uses a **function calling** approach instead of dumping all data into the prompt:

1. User asks a question (e.g., "What events am I attending this week?")
2. The question is sent to Groq API with descriptions of available tools
3. The LLM decides which tool to call and with what parameters
4. The backend executes the selected database query with only relevant filters
5. Results are sent back to the LLM to generate a human-readable answer

This approach is more scalable and efficient than context-dumping — the LLM fetches only the data it needs.

**Available tools:** `getUserEvents` (date range, tag filter), `getPublicEvents` (date range, tag filter), `getEventDetails` (by event name)

## Architecture Decisions

- **Access token in memory** (Zustand store) instead of localStorage for XSS protection
- **Refresh token in httpOnly cookie** with automatic rotation
- **Function calling over context-dumping** for AI assistant — LLM selects relevant queries instead of receiving all data
- **Separate AI query methods** in EventsService — AI consumers need compact data without IDs, different from frontend DTOs
- **Manual DTO mapping** to control API response shape
- **TypeORM migrations** instead of `synchronize: true` for production-ready workflow
- **Feature-based frontend structure** for clear separation of concerns

## Production Improvements

- Token revocation table for refresh tokens
- GraphQL as a universal query layer for AI tools — LLM generates queries instead of choosing from predefined tools
- RAG with vector embeddings for unstructured data (FAQ, policies) alongside function calling for structured data
- Structured logging with Winston/Pino
- Rate limiting on auth and AI endpoints
- Pagination for events list
- E2E tests
- CI/CD pipeline

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
pnpm db:migrate
pnpm db:seed
pnpm start:dev
```

### Frontend
```bash
cd client
pnpm install
pnpm dev
```

### Storybook
```bash
cd client
pnpm storybook
```

## Project Structure

```
Application/
├── client/
│   ├── src/
│   │   ├── app/              # App component, router
│   │   ├── features/
│   │   │   ├── auth/         # Authentication (store, api, components)
│   │   │   ├── events/       # Events (store, api, components, schemas)
│   │   │   ├── tags/         # Tags (store, api, components, constants)
│   │   │   └── ai/           # AI Assistant (api, components)
│   │   ├── pages/            # Page components
│   │   └── shared/           # Shared utilities, components, types
│   ├── .storybook/           # Storybook configuration
│   ├── Dockerfile
│   └── nginx.conf
├── server/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication (JWT, guards, strategies)
│   │   │   ├── users/        # User management
│   │   │   ├── events/       # Events CRUD + AI query service
│   │   │   ├── tags/         # Tags management
│   │   │   └── ai/           # AI assistant (Groq integration, tools)
│   │   ├── common/           # Shared filters, interceptors, decorators
│   │   ├── config/           # App configuration
│   │   ├── migrations/       # TypeORM migrations
│   │   └── seed/             # Database seeding
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```