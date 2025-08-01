# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle  
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript single-page application built with Vite, showcasing SK Webberiz (appears to be a shopping center/mall website). The application follows a component-based architecture with a main landing page structure.

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 
- **Styling**: Tailwind CSS with custom color palette
- **UI Components**: Custom components using Radix UI primitives, Framer Motion for animations
- **Icons**: Lucide React and React Icons
- **Carousel**: Swiper.js

### Project Structure
- `src/App.tsx` - Main application component that renders all page sections sequentially
- `src/components/` - Page section components (Navbar, Hero, About, etc.)
- `src/components/ui/` - Reusable UI components (buttons, carousels, badges, etc.)
- `src/lib/utils.ts` - Utility functions (likely for className merging)

### Component Architecture
The application is structured as a single-page website with these main sections rendered in order:
1. Navbar (navigation)
2. Hero (main banner)
3. About (information section)
4. FeaturedTenants (tenant showcase)
5. Events (events listing)
6. FoodDining (food court information)
7. Facilities (amenities)
8. VisitorInfo (visitor information)
9. Footer (site footer)

### Design System
Custom Tailwind configuration with luxury branded color palette:
- Background: `#121421` (Chinese Black - immutable background)
- Royal Purple: `#5A2E8A` (primary accent for buttons, links, active states)
- Dark Purple: `#4A256F` (hover states)
- Gold: `#D4AF37` (secondary accent for borders, dividers, highlights)
- Extended theme includes custom scrollbar styling with gold accents

### Key Dependencies
- Framer Motion for animations and transitions
- Radix UI for accessible component primitives
- Class Variance Authority (CVA) for component variant management
- Swiper for carousel functionality