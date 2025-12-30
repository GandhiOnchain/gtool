# CLAUDE.md

This file provides guidance to Vie when working with code in this repository.

## Project Overview

This is a React + TypeScript application built with Vite, using shadcn/ui components and Tailwind v4 CSS for styling. The project appears to be part of a larger Highlight workspace system with AI server integration.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server (runs on port 5173)
bun run dev

# Build for production (outputs to ../../ai/dist)
bun run build

# Build for development mode
bun run build:dev

# Run ESLint
bun run lint

# Fix ESLint Issues
bun run lint:fix

# Run ESLint
bun run typecheck

# Preview production build
bun run preview
```

## Architecture & Structure

### Tech Stack
- **Build Tool**: Vite 5.4.1
- **Framework**: React 18.3.1 with TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with CSS variables
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/
│   └── ui/          # shadcn/ui components (40+ pre-built components)
├── hooks/           # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/             # Utilities
│   └── utils.ts     # Tailwind merge utilities
├── pages/           # Route pages
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx          # Main app component with routing
└── main.tsx         # Entry point
```

### Key Configuration

**Path Aliases**: The project uses `@/` as an alias for `src/`:
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`

**TypeScript**: Configured with relaxed settings:
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedParameters: false`
- `noUnusedLocals: false`

## Component Development

### shadcn/ui Components
The project includes a comprehensive set of pre-configured shadcn/ui components in `src/components/ui/`. When adding new features:
1. Check if an existing component can be used
2. Components follow the shadcn/ui pattern with CSS variables for theming
3. All components support className prop for additional styling

### Routing
- Uses React Router v6 with BrowserRouter
- Add new routes in `App.tsx` above the catch-all route
- Page components go in `src/pages/`

### Styling
- Tailwind CSS with custom configuration
- CSS variables defined in `src/index.css`
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Base color theme: slate

## Important Notes

- Don't ever run the Dev server even if user asks for it. You're running in a sandbox so don't run any commands to serve content.
- Includes both Toaster (from Radix) and Sonner for notifications
- React Query is pre-configured for data fetching
- All shadcn/ui components are already installed and configured
