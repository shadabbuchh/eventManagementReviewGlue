# Event Management Application

A modern, full-stack event management system built with TypeScript, featuring a React frontend and Fastify backend, designed for organizing and tracking events with real-time notifications.

## 🚀 Features

### Core Functionality
- **Event Management**: Create, update, duplicate, and archive events
- **Event Status Workflow**: Draft → Published → Archived lifecycle management
- **Advanced Filtering**: Search events by name, tags, or status
- **Pagination**: Efficient handling of large event lists
- **Real-time Notifications**: Track event updates with notification badges
- **Quick Actions**: Inline event operations for improved UX

### Technical Highlights
- **Type-Safe API**: OpenAPI specification with auto-generated TypeScript types
- **Database Migrations**: Managed with Drizzle ORM
- **Monorepo Architecture**: PNPM workspace for efficient dependency management
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **State Management**: React Query for server state and Zustand for client state

## 📁 Project Structure

```
event_management_app/
├── backend/           # Fastify backend server
│   ├── src/
│   │   ├── app.ts          # Application setup
│   │   ├── server.ts       # Server entry point
│   │   ├── db/             # Database schema and migrations
│   │   ├── handlers/       # OpenAPI operation handlers (BUSINESS LOGIC HERE)
│   │   ├── services/       # Business logic layer
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # ONLY infrastructure routes (health, etc.)
│   │   └── plugins/        # Fastify plugins (includes OpenAPI glue)
│   └── tests/              # Backend tests
├── frontend/          # React application
│   ├── src/
│   │   ├── main.tsx        # Application entry
│   │   ├── routes/         # React Router setup
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   ├── apis/           # API client layer
│   │   └── hooks/          # Custom React hooks
│   └── dist/               # Production build
├── openapi/           # API specification (SOURCE OF TRUTH)
│   ├── openapi_spec.yaml   # OpenAPI 3.1 specification - DEFINES ALL API ROUTES
│   └── generated-types.d.ts # Auto-generated TypeScript types
├── api/               # Vercel serverless function
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Fastify 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **API**: OpenAPI 3.1 specification with fastify-openapi-glue
- **Validation**: Zod schemas
- **Logging**: Pino

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: React Query + Zustand
- **API Client**: openapi-fetch with type safety
- **Build Tool**: Vite

### Infrastructure
- **Package Manager**: PNPM with workspaces
- **Testing**: Vitest for both frontend and backend
- **Deployment**: Vercel (frontend) / Docker (backend)
- **Development Environment**: E2B sandbox support

## 🚦 Getting Started

### Prerequisites
- Node.js >= 22.17.1
- PNPM ~10.14.0
- PostgreSQL (for local development)

### Development

Start the development servers:

```bash
# Start backend (port 3001)
cd backend
pnpm dev

# In another terminal, start frontend (port 5173)
cd frontend
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1

## 🎯 Important: API Route Architecture

**This project uses OpenAPI-driven automatic route generation!**

### How It Works:
1. **All business API routes are defined in:** `openapi/openapi_spec.yaml`
2. **Routes are automatically generated** at runtime by `fastify-openapi-glue`
3. **No manual route files** for business endpoints (events, users, etc.)
4. **Handler implementation:** `backend/src/handlers/open-api-service-handlers.ts`

### Key Points:
- ✅ **DO:** Define new endpoints in `openapi/openapi_spec.yaml`
- ✅ **DO:** Implement handlers in `open-api-service-handlers.ts`
- ❌ **DON'T:** Create route files in `backend/src/routes/` for business logic
- ❌ **DON'T:** Manually define business endpoints in the backend

### Benefits:
- Single source of truth for API definition
- Automatic request/response validation
- Type-safe client and server code
- Auto-generated documentation

## 📝 API Documentation

The API follows OpenAPI 3.1 specification. Key endpoints include:

- `GET /api/v1/events` - List events with pagination and filters
- `GET /api/v1/events/{id}` - Get event details
- `PUT /api/v1/events/{id}` - Update event
- `DELETE /api/v1/events/{id}` - Archive or delete event
- `POST /api/v1/events/{id}/duplicate` - Duplicate an event
- `POST /api/v1/events/{id}/cancel` - Cancel event or occurrence
- `POST /api/v1/events/{id}/quick-actions` - Perform quick actions

## 📚 Development Workflow

### Adding New API Endpoints (IMPORTANT!)

1. **API-First Development**: Define endpoints in `openapi/openapi_spec.yaml`
   - Add your endpoint definition with proper operationId
   - Define request/response schemas
   
2. **Generate Types**: Run `pnpm --filter @app/openapi generate-types`
   - This creates TypeScript types for both frontend and backend
   
3. **Implement Handlers**: Add handler method in `backend/src/handlers/open-api-service-handlers.ts`
   - Method name MUST match the operationId from the OpenAPI spec
   - The route is automatically created - NO manual route file needed!
   
4. **Update Frontend**: Use generated types in React components
   - Import from `@app/openapi/generated-types`
   - Use the type-safe API client
   
5. **Test**: Write tests for new features

6. **Validate**: Run `pnpm validate` for preflight checks

**Remember:** Never create route files in `backend/src/routes/` for business logic!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
