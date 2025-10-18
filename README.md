# 🔥 Rankflix

[![CI](https://github.com/manugo-dev/rankflix/actions/workflows/ci.yaml/badge.svg)](https://github.com/manugo-dev/rankflix/actions/workflows/ci.yaml)
[![DeployProduction](https://github.com/manugo-dev/rankflix/actions/workflows/production.yaml/badge.svg)](https://github.com/manugo-dev/rankflix/actions/workflows/production.yaml)
[![Coverage](https://gist.githubusercontent.com/manugo-dev/8acf73cd84f3bec4668b07f073ad11a6/raw/84e09764edcdba377008ad3c8c1f797e501fcf61/badge.svg)](https://github.com/manugo-dev/rankflix)

A modern, server-side rendered movie catalog application built with React, Vite SSR, and Feature-Sliced Design architecture. Explore trending movies, discover new titles, and manage your personal watchlist.

### Live DEMO: [Ranflix Official DEMO Page](https://rankflix.manugo.dev)

## 🚀 Features

- **Server-Side Rendering (SSR)** with Vite
- **Modern UI** with smooth animations powered by Motion (Framer Motion)
- **Movie Discovery** - Browse trending movies and discover by genre
- **Watchlist Management** - Save and organize your favorite movies
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Type-Safe** - Built with TypeScript for reliability
- **Comprehensive Testing** - 80%+ test coverage with Vitest
- **Accessible** - Following WCAG guidelines

## 🚀 Next steps

- [ ] Add a useOutsideClick hook to handle closing dropdowns, selectors, and upcoming modals consistently.
- [ ] Refactor the Movie Detail view by componentizing its sections (overview, metadata, similar titles, etc.) to enable reuse across other parts of the app.
- [ ] Implement a global ErrorBoundary to gracefully catch runtime errors and render a fallback UI.
- [ ] Add logging within the ErrorBoundary to capture and persist error details (message, stack trace, component state) for debugging and diagnostics.
- [x] Fix scroll restoration when navigating between pages (preserve or reset position as needed).
- [ ] Automatically close the mobile navigation menu after navigating from detail views (e.g., Movie Detail → Watchlist).
- [ ] Persist the Watchlist state using APIs such as TMDB guest sessions.
- [ ] Implement dynamic metadata (SSR + client) via generateMeta() in routes to enhance SEO and link previews.
- [ ] Add accessibility improvements — focus trapping in modals, ARIA labels for buttons, and keyboard navigation for sliders.
- [ ] Optimize image loading in movie cards and hero banners with lazy loading and responsive srcset.
- [ ] Review and optimize bundle size by applying code splitting and efficient dependency management.

## 🛠️ Tech Stack

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)

### Core

- **[React 19](https://react.dev/)** - UI library
- **[Vite](https://vite.dev/)** - Build tool with SSR support
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### State & Data

- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state management
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Router 7](https://reactrouter.com/)** - Routing

### Styling & Animation

- **[Sass](https://sass-lang.com/)** - CSS preprocessor
- **[Motion](https://motion.dev/)** - Animation library

### Testing & Quality

- **[Vitest](https://vitest.dev/)** - Unit & integration testing
- **[Testing Library](https://testing-library.com/)** - Component testing
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Stylelint](https://stylelint.io/)** - CSS linting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

### Architecture

- **[Feature-Sliced Design (FSD)](https://feature-sliced.design/)** - Architectural methodology

## 📁 Project Structure

Following Feature-Sliced Design principles:

```
rankflix/
├── src/
│   ├── app/                      # Application layer
│   │   ├── layouts/              # Layout components
│   │   ├── providers/            # Global providers (Router, Query, Store)
│   │   └── styles/               # Global styles & variables
│   │
│   ├── pages/                    # Pages layer
│   │   ├── home/                 # Home page
│   │   ├── movie-detail/         # Movie detail page
│   │   ├── watchlist/            # Watchlist page
│   │   └── not-found/            # 404 page
│   │
│   ├── widgets/                  # Widgets layer
│   │   ├── header/               # Header component
│   │   ├── navbar/               # Navigation bar
│   │   └── footer/               # Footer component
│   │
│   ├── features/                 # Features layer
│   │   ├── discovery-movies/     # Movie discovery features
│   │   ├── movie-detail/         # Movie detail features
│   │   └── watchlist/            # Watchlist management
│   │
│   ├── entities/                 # Entities layer
│   │   ├── movies/               # Movie entity (types, api, ui)
│   │   └── list/                 # List entity
│   │
│   ├── shared/                   # Shared layer
│   │   ├── api/                  # API clients & types
│   │   ├── config/               # App configuration
│   │   ├── hooks/                # Reusable hooks
│   │   ├── lib/                  # Utility functions
│   │   ├── routes/               # Route definitions
│   │   └── ui/                   # Shared UI components
│   │
│   ├── tests/                    # Test utilities
│   ├── entry-client.tsx          # Client entry point
│   └── entry-server.tsx          # SSR entry point
│
├── server/                       # Express SSR server
│   ├── index.js                  # Development server
│   └── build.js                  # Production server builder
│
└── dist/                         # Build output
    ├── client/                   # Client-side bundle
    ├── server/                   # SSR bundle
    └── index.js                  # Production server
```

### FSD Layers (Bottom-up)

1. **`shared/`** - Reusable utilities, UI kit, and third-party lib configs
2. **`entities/`** - Business entities (e.g., Movie, User)
3. **`features/`** - User interactions and business features
4. **`widgets/`** - Composite blocks and templates
5. **`pages/`** - Application pages
6. **`app/`** - App-wide settings, providers, and global styles

## 🚦 Getting Started

### Prerequisites

- **Node.js** >= 22.x
- **npm** >= 10.x
- **TMDB API Key** - Get one from [The Movie Database](https://www.themoviedb.org/settings/api)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/manugo-dev/rankflix.git
   cd rankflix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://media.themoviedb.org/t/p/
   ```

### Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

#### Development Scripts

```bash
npm run dev:client    # Start Vite dev server only (client-side)
npm run typecheck     # Run TypeScript type checking
npm run lint          # Run all linters (ESLint, Prettier, Stylelint)
npm run lint:fix      # Auto-fix linting issues
npm run test          # Run tests in watch mode
npm run test:ui       # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
```

### Building for Production

Build the application for production:

```bash
npm run build
```

This will:

1. Build the client bundle (`dist/client/`)
2. Build the SSR bundle (`dist/server/`)
3. Build the production server (`dist/index.js`)

#### Build Scripts

```bash
npm run build:client      # Build client-side only
npm run build:ssr         # Build SSR bundle only
npm run build:ssr-server  # Build production server only
```

### Running Production Build Locally

```bash
npm start
```

The production server will run on `http://localhost:3000`

## 🧪 Testing

The project uses **Vitest** and **Testing Library** for comprehensive testing.

### Test Coverage Requirements

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Organization

Tests are co-located with their source files:

```
src/
├── entities/
│   └── movies/
│       ├── ui/
│       │   ├── movie-card/
│       │   │   ├── movie-card.tsx
│       │   │   └── movie-card.test.tsx
```

## 🎨 Code Quality

### Linting & Formatting

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix:eslint
npm run lint:fix:prettier
npm run lint:fix:stylelint
```

### Git Hooks

Pre-commit hooks (via Husky and lint-staged):

- Type checking
- Linting
- Formatting
- Running tests for changed files

### Commit Conventions

Following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: test changes
chore: build process or auxiliary tool changes
```

## 🚀 Deployment

### Vercel (Production)

The application is deployed to **Vercel** using GitHub Actions.

#### CI Pipeline (`.github/workflows/ci.yaml`)

Runs on every push to `main` and on pull requests:

1. **TypeCheck** - Validate TypeScript types
2. **Prettier** - Check code formatting
3. **ESLint** - Lint JavaScript/TypeScript
4. **Stylelint** - Lint CSS/SCSS
5. **Tests** - Run test suite with coverage
6. **Build** - Ensure production build succeeds
7. **Badge** - Update coverage badge

#### Production Deployment (`.github/workflows/production.yaml`)

Triggered on push to `main` after CI passes:

1. **CI Job** - Runs full CI pipeline
2. **Deploy Job** - Deploys to Vercel
   - Installs Vercel CLI
   - Pulls Vercel environment
   - Builds project artifacts
   - Deploys to production

#### Required Secrets

Configure in GitHub repository settings:

- `VERCEL_TOKEN` - Vercel deployment token
- `GIST_TOKEN` - GitHub token for badges (optional)

#### Required Variables

- `BADGES_GIST_URL` - URL for coverage badges (optional)

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🌍 Environment Variables

### Required

| Variable            | Description                | Example        |
| ------------------- | -------------------------- | -------------- |
| `VITE_TMDB_API_KEY` | The Movie Database API key | `your_api_key` |

### Optional

| Variable                   | Description         | Default                             |
| -------------------------- | ------------------- | ----------------------------------- |
| `VITE_TMDB_API_BASE_URL`   | TMDB API base URL   | `https://api.themoviedb.org/3`      |
| `VITE_TMDB_IMAGE_BASE_URL` | TMDB image base URL | `https://media.themoviedb.org/t/p/` |

### Development Guidelines

- Follow Feature-Sliced Design principles
- Write tests for new features
- Maintain 80%+ coverage
- Use conventional commits
- Update documentation

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - Movie data API
- [Feature-Sliced Design](https://feature-sliced.design/) - Architecture methodology
- [Vite](https://vite.dev/) - Build tool

---

Built with ❤️ using React, Vite, and Feature-Sliced Design

![visitor badge](https://visitor-badge.laobi.icu/badge?page_id=manugo-dev.rankflix&left_text=Visitors)
