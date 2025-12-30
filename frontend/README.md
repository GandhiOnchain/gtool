# VIE Workspace Frontend

React + TypeScript application template for VIE user workspaces. This is the default frontend workspace that users can build on when creating projects in VIE. The AI agent running in the sandbox server modifies this code based on user prompts.

## Overview

This workspace is:
- The **user's actual code** that gets created and modified by the VIE AI agent
- A template React application that serves as a starting point for new projects
- Hydrated from S3 snapshots when the sandbox boots
- Modified in real-time by the AI agent based on user prompts
- Built and deployed to preview URLs when users publish their projects

## Tech Stack

- **Build Tool**: Vite (using Rolldown)
- **Runtime**: Bun
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Styling**: Tailwind CSS v4.1.13 with custom theming
- **UI Components**: shadcn/ui (Radix UI primitives) - 40+ pre-built components
- **Linting**: oxlint (faster alternative to ESLint)
- **Routing**: React Router v6.26.2
- **State Management**: TanStack Query v5.83.0
- **Forms**: React Hook Form with Zod validation
- **Web3**: Wagmi v2.17.2 + Viem v2.37.7 for blockchain interactions
- **Authentication**: Privy v3.0.1 (optional) with social login and embedded wallets
- **Blockchain SDK**: Alchemy SDK v3.6.3
- **Animations**: Framer Motion v11
- **Icons**: Lucide React v0.544.0

## Development Commands

```bash
# Install dependencies
bun install

# Start development server (runs on port 5174)
bun run dev

# Build for production
bun run build

# Build for development mode
bun run build:dev

# Run linter
bun run lint

# Fix linting issues automatically
bun run lint:fix

# Type check
bun run typecheck

# Preview production build
bun run preview

# Import active Google Fonts
bun run import:active-fonts
```

## Project Structure

```
src/
├── blockchain-config/          # Smart contract configurations
│   ├── abis/                  # Contract ABIs
│   │   ├── independent-abis/  # Standard ABIs (ERC-20, ERC-721, ERC-1155)
│   │   └── index.ts
│   ├── contracts/             # Deployed contract configs (by hash)
│   │   ├── 0x[hash]/
│   │   │   ├── abi.ts
│   │   │   └── metadata.ts
│   │   └── contractSourceMetadatas.ts
│   ├── appContractDeployments.ts
│   └── deployments.ts
├── components/                 # React components
│   ├── ui/                    # shadcn/ui components (40+ components)
│   ├── ErrorBoundary.tsx      # Error boundary component
│   ├── Layout.tsx             # Layout wrapper
│   ├── RouteSync.tsx          # Route synchronization
│   ├── ThemeSelector.tsx      # Theme selection UI
│   ├── ThemeSync.tsx          # Theme synchronization
│   └── examples/              # Example components
├── hooks/                     # Custom React hooks
│   ├── use-mobile.tsx         # Mobile detection
│   ├── use-toast.ts           # Toast notifications
│   └── [other hooks]
├── lib/                       # Utilities
│   └── utils.ts               # Tailwind merge utilities
├── pages/                     # Route pages
│   ├── Index.tsx              # Home page
│   └── NotFound.tsx           # 404 page
├── themes/                    # Theme configurations
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
├── config.ts                  # Environment configuration
├── env.json                   # Environment variables
└── index.css                  # Global styles
```

## Configuration

### Path Aliases
The project uses `@/` as an alias for `src/`:
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`

### Environment Configuration
Configuration is managed through `src/env.json` and accessed via `src/config.ts`:

**Optional Environment Variables:**
- `VITE_PRIVY_APP_ID` - Privy app ID for enhanced wallet experience
- `VITE_PRIVY_CLIENT_ID` - Privy client ID
- `VITE_ALCHEMY_API_KEY` - Alchemy API key for higher rate limits

**Network Configuration:**
The workspace is pre-configured for multiple blockchain networks:
- **Base** (8453) - Primary network
- **Base Sepolia** (84532) - Testnet
- **Ethereum** (1)
- **BNB Smart Chain** (56)
- **Arbitrum** (42161)
- **Berachain** (80094)
- **Avalanche** (43114)
- **Hyperliquid** (999)
- **Polygon** (137)
- **Optimism** (10)
- **Linea** (59144)
- **Scroll** (534352)
- **Mantle** (5000)
- **Unichain** (130)
- **Shape** (360)
- **Plume** (98866)

### Vite Configuration
- **Dev Server**: Runs on port 5174 (IPv6 enabled)
- **Base Path**: Configurable via `BASE_DIR` environment variable
- **Build Output**: `./output` directory
- **Source Maps**: Disabled in production
- **Minification**: Disabled for debugging

## Wallet Integration

The workspace supports two wallet connection modes:

### With Privy (Enhanced Experience)
Set these environment variables for full Privy integration:
```json
{
  "VITE_PRIVY_APP_ID": "your_privy_app_id",
  "VITE_PRIVY_CLIENT_ID": "your_privy_client_id"
}
```
**Features**: Embedded wallets, social login (Google, Twitter, etc.), seamless UX

### Without Privy (Standard Experience)
No configuration needed - automatically falls back to injected provider
**Features**: Standard wallet connection, works with MetaMask, WalletConnect, Coinbase Wallet

### Unified API
Components use a single `useWallet()` hook that works with both providers:
```typescript
const { address, isConnected, connect, disconnect } = useWallet()
// Works identically whether using Privy or injected provider
```

## Blockchain Integration

### Contract Configuration
Smart contracts are configured in `src/blockchain-config/`:
- **ABIs**: Standard contract interfaces (ERC-20, ERC-721, ERC-1155)
- **Deployments**: Deployed contract addresses and metadata
- **Source Metadata**: Contract source code and compilation info

### Adding Contracts
Contracts are dynamically added by the AI agent when users deploy new contracts:
1. Contract ABI is saved to `blockchain-config/contracts/0x[hash]/abi.ts`
2. Contract metadata is saved to `blockchain-config/contracts/0x[hash]/metadata.ts`
3. Deployment info is added to `appContractDeployments.ts`

## Theming

The workspace includes a flexible theming system:
- Multiple pre-configured themes in `src/themes/`
- CSS variables for easy customization
- Dark mode support
- Theme selector component for runtime switching
- Google Fonts integration with `import:active-fonts` script

### Available Themes
- Slate (default)
- Additional themes can be added dynamically

## Component Development

### shadcn/ui Components
The workspace includes 40+ pre-configured shadcn/ui components in `src/components/ui/`:
- All components support `className` prop for additional styling
- Follow shadcn/ui patterns with CSS variables for theming
- Radix UI primitives for accessibility

### Routing
- Uses React Router v6 with BrowserRouter
- Add new routes in `App.tsx` above the catch-all route
- Page components go in `src/pages/`

### Styling
- Tailwind CSS v4 with custom configuration
- CSS variables defined in `src/index.css`
- Use `cn()` utility from `@/lib/utils` for conditional classes

## AI Agent Integration

This workspace is designed to work with the VIE AI agent:
- **AGENTS.md**: Provides instructions to the AI agent on how to modify the code
- **Dynamic Updates**: AI agent modifies files based on user prompts
- **Contract Generation**: AI agent creates and configures smart contracts
- **Component Creation**: AI agent builds UI components based on user requests

## Build and Deployment

### Build Output
```bash
# Production build
bun run build
# Output: ./output/ directory
```

### Publishing Flow
1. User requests to publish project in VIE app
2. Backend triggers Publisher Lambda function
3. Publisher downloads workspace snapshot from S3
4. Publisher runs `bun install` and `bun run build`
5. Build artifacts uploaded to S3 preview bucket
6. Preview URL available at `https://previews.vie.dev/[project-id]/`

## Development Notes

- Uses **Bun** as package manager (not npm)
- Uses **oxlint** instead of ESLint for faster linting
- Uses **Rolldown** (Vite fork) for faster builds
- TypeScript configured with relaxed settings for rapid prototyping:
  - `noImplicitAny: false`
  - `strictNullChecks: false`
  - `noUnusedParameters: false`
  - `noUnusedLocals: false`
- Custom logger wraps errors with `<VieError>` tags for backend parsing
- Includes both Toaster (from Radix) and Sonner for notifications
- React Query is pre-configured for data fetching

## Important Notes for AI Agent

- **Never run dev server**: The AI agent should not run `bun run dev` as it's in a sandboxed environment
- **File modifications**: The AI agent has access to read, write, edit, glob, and grep tools
- **Build verification**: The AI agent can run `bun run build` to verify changes compile
- **Type checking**: The AI agent should run `bun run typecheck` to verify type safety
- **Linting**: The AI agent should run `bun run lint:fix` to auto-fix linting issues

## Troubleshooting

### Build Issues
```bash
# Clean and rebuild
rm -rf node_modules output
bun install
bun run build
```

### Linting Issues
```bash
# Auto-fix linting issues
bun run lint:fix
```

### Type Errors
```bash
# Run type check
bun run typecheck
```

### Port Conflicts
The dev server uses port 5174 by default. If the port is in use:
```bash
# Check what's using the port
lsof -i :5174

# Kill the process
kill -9 <PID>
```
