# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup          # Install deps, generate Prisma client, run migrations
npm run dev            # Start dev server (Next.js + Turbopack on :3000)
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Vitest (watch mode)
npx vitest run         # Vitest (single run)
npx vitest run src/lib/file-system.test.ts  # Run a single test file
npm run db:reset       # Reset database (destructive)
```

## Architecture

UIGen is an AI-powered React component generator. Users describe UI in a chat interface, Claude generates React components into a virtual file system, and a live preview renders them in a sandboxed iframe.

### Stack

- **Next.js 15** (App Router, Turbopack), **React 19**, **TypeScript**
- **Prisma** with SQLite (`prisma/dev.db`), client generated to `src/generated/prisma`
- **Anthropic Claude** via Vercel AI SDK (`@ai-sdk/anthropic`), default model: `claude-haiku-4-5`
- **Tailwind CSS v4**, **Radix UI**, **Monaco Editor**
- **Vitest** + Testing Library for tests

### Core Data Flow

1. User sends message → `ChatContext` (wraps Vercel AI SDK `useChat`) → `POST /api/chat`
2. API route streams Claude response with tool calls (`str_replace_editor`, `file_manager`)
3. Tool calls update `FileSystemContext` (in-memory virtual FS via `VirtualFileSystem` class)
4. JSX transformer (Babel) converts virtual FS files → blob URLs with import map
5. Sandbox iframe renders the live preview with Tailwind CSS

### Key Directories

- `src/app/` — App Router pages: `/` (landing), `/[projectId]` (editor), `/api/chat` (streaming endpoint)
- `src/components/` — UI organized by domain: `auth/`, `chat/`, `editor/`, `preview/`, `ui/`
- `src/lib/contexts/` — React contexts: `ChatContext` (messages/streaming), `FileSystemContext` (virtual FS)
- `src/lib/tools/` — Claude tool definitions: `str-replace-editor.ts`, `file-manager.ts`
- `src/lib/transform/` — Babel JSX transformation and preview HTML generation
- `src/lib/prompts/` — System prompt for Claude in `generation.tsx`
- `src/actions/` — Server actions for auth (JWT + bcrypt) and project CRUD

### Authentication

JWT-based with HTTP-only cookies (7-day expiry). Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes. Anonymous users can generate components; work is tracked in sessionStorage and migrated on sign-up.

### Mock Provider

When `ANTHROPIC_API_KEY` is not set, a mock language model (`src/lib/provider.ts`) returns static responses with simulated tool calls, enabling development without an API key.

### Virtual File System

`VirtualFileSystem` class (`src/lib/file-system.ts`) maintains an in-memory Map of file nodes. No disk writes occur. State is serialized to JSON and persisted to the `Project.data` column for authenticated users.

### Database Schema

The database schema is defined in the `prisma/schema.prisma` file. Reference it anytime you need the structure of data stored in the database.

## Path Alias

`@/*` maps to `./src/*` — used in both app code and Claude-generated components.

## Code Style

Use comments sparingly. Only comment complex code.
