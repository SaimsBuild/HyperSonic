# HyperSonic - Self-Discipline & Habit Tracker

## Overview

HyperSonic is a modern self-discipline and habit-building application with a distinctive hexagonal progress visualization system. The app focuses on daily goal tracking, habit management, and urge control with a clean, dark-themed interface. It operates entirely offline using local storage and includes Bangladesh timezone integration for accurate daily resets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Local component state with custom hooks for data persistence
- **Data Fetching**: TanStack Query for potential future API integration

### Design System
- **Theme**: Dark mode with purple primary colors and modern glassmorphic elements
- **Typography**: Inter font family for clean, readable text
- **Color Scheme**: Dark background with purple accents, green secondary colors, and yellow accent highlights
- **Components**: Comprehensive UI component library based on Radix primitives

### Data Storage Architecture
- **Storage Method**: Browser localStorage for complete offline functionality
- **Data Structure**: Zod schemas for type-safe data validation and serialization
- **Data Models**: 
  - Daily Goals with completion tracking
  - Habits with streak counters and level progression
  - Activity logs with performance metrics
  - Urge breaker task completions

### Core Features Architecture
- **Hexagonal Progress System**: Central visual element that fills based on daily completion rates
- **Daily Reset Mechanism**: Automatic goal reset at midnight Bangladesh time
- **Habit Leveling**: Progressive reward system for consistent habit completion
- **Activity Calendar**: Historical view of user performance with color-coded activity levels
- **Urge Breaker Module**: Predefined distraction tasks with completion tracking

### Time Zone Handling
- **Bangladesh Time Integration**: Custom hook for accurate local time calculation
- **Daily Reset Logic**: Automatic data reset based on Bangladesh timezone midnight
- **Time Display**: Real-time clock showing Bangladesh time

### Development Tools
- **Build System**: Vite with React plugin for fast development
- **Type Safety**: TypeScript with strict configuration
- **Development Features**: Hot module replacement, error overlay, and Replit integration
- **Code Quality**: ESLint and TypeScript strict mode for code consistency

## External Dependencies

### UI and Styling
- **@radix-ui/**: Complete set of accessible UI primitives for dialogs, buttons, and form components
- **tailwindcss**: Utility-first CSS framework for responsive design
- **class-variance-authority**: Type-safe component variants
- **clsx**: Conditional CSS class composition

### Development and Build
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React integration for Vite
- **typescript**: Type safety and enhanced development experience
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Data and State Management
- **@tanstack/react-query**: Server state management (prepared for future API integration)
- **wouter**: Lightweight routing library
- **zod**: Schema validation for type-safe data handling

### Database Preparation
- **drizzle-orm**: SQL ORM for potential future database integration
- **drizzle-kit**: Database toolkit and migration system
- **@neondatabase/serverless**: Serverless PostgreSQL client (configured but not actively used)

### Utilities
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Modern icon library
- **nanoid**: Unique ID generation
- **embla-carousel-react**: Carousel component functionality

### Backend Foundation
- **express**: Web framework for potential API endpoints
- **tsx**: TypeScript execution for server-side code
- The backend structure is minimal and primarily serves static files, with storage interface prepared for future database integration

## Deployment

### Vercel Deployment
The application is configured for easy deployment to Vercel as a static site:
- **Configuration**: `vercel.json` specifies build command and output directory
- **Build Command**: `vite build` generates static files
- **Output Directory**: `dist/public` contains the production build
- **Optimization**: `.vercelignore` excludes unnecessary files from deployment
- **Documentation**: See `VERCEL_DEPLOYMENT.md` for step-by-step deployment instructions

### User Data Privacy
- All user data is stored in browser localStorage
- Each user's data is completely private and never leaves their browser
- No backend database required for deployment
- Users can access their data only on the specific browser/device where they created it