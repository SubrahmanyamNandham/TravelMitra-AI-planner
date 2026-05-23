<<<<<<< HEAD
# Travel.io — AI-Powered Travel Planning App

A modern, fully responsive travel planning landing page built with **React + TypeScript + Sass + Vite**. Features an AI chat preview, dark/light theme toggle, Login and Sign Up pages, and stunning section-wise Unsplash background images.

---

## Features

- **Dark / Light Theme** — Smooth toggle with sun/moon button in the navbar. Theme persists across sessions via `localStorage`.
- **AI Chat Preview** — Interactive chat demo showcasing AI-powered itinerary generation.
- **Login & Sign Up Pages** — Glassmorphism design with social login buttons, show/hide password, and a password strength meter.
- **Section Background Images** — Each section has a curated Unsplash photo with a gradient overlay (adapts for both dark and light themes).
- **Smooth Animations** — Fade-in, float, and pulse keyframe animations throughout.
- **Fully Responsive** — Works on mobile, tablet, and desktop.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Sass (SCSS modules) |
| Icons | Inline SVGs (no external dependency) |
| Fonts | Syne (headings) + DM Sans (body) via Google Fonts |
| Images | Unsplash (via CDN URL) |
| State | React Context (ThemeContext) + useState |

---

## Project Structure

```
travel-io/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar/          # Nav with theme toggle + mobile drawer
│   │   ├── Hero/            # Hero section with search form + stats
│   │   ├── Features/        # 6-card feature grid
│   │   ├── Destinations/    # Destination cards (Bali, Paris, Kyoto)
│   │   ├── ChatPreview/     # AI chat demo
│   │   ├── Testimonials/    # Review cards + proof stats
│   │   ├── Newsletter/      # Email subscribe section
│   │   └── Footer/          # Links + social icons
│   ├── context/
│   │   └── ThemeContext.tsx  # Dark/light theme provider
│   ├── pages/
│   │   ├── LoginPage.tsx    # Login form with social buttons
│   │   └── SignUpPage.tsx   # Sign up with password strength meter
│   ├── styles/
│   │   ├── _variables.scss  # CSS custom properties (dark + light)
│   │   ├── _base.scss       # Global reset & base styles
│   │   ├── _animations.scss # Keyframe animations
│   │   ├── _navbar.scss     # Navbar + mobile drawer
│   │   ├── _hero.scss       # Hero section
│   │   ├── _sections.scss   # Features & Destinations
│   │   ├── _chat.scss       # AI chat section
│   │   ├── _testimonials.scss
│   │   ├── _newsletter.scss
│   │   ├── _footer.scss
│   │   ├── _auth.scss       # Login & Sign Up pages
│   │   ├── _theme-toggle.scss # Toggle pill button
│   │   ├── _light-theme.scss  # All light mode overrides
│   │   ├── _responsive.scss   # Media queries
│   │   └── main.scss          # Entry — imports all partials
│   ├── App.tsx              # Page router (home / login / signup)
│   └── main.tsx             # React root
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
pnpm run dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
pnpm run build
# or
npm run build
```

Output is in the `dist/` folder — ready to deploy anywhere (Vercel, Netlify, GitHub Pages, etc.).

### Preview Production Build

```bash
pnpm run preview
```

---

## Theme System

Themes are driven entirely by CSS custom properties. The `ThemeContext` sets a `data-theme` attribute on the `<html>` element:

```html
<!-- Dark (default) -->
<html data-theme="dark">

<!-- Light -->
<html data-theme="light">
```

All component styles reference variables like `var(--bg)`, `var(--text)`, `var(--border)`, etc. The file `_light-theme.scss` contains all light-mode overrides scoped under `[data-theme="light"]`, including section background image overlays.

---

## Pages

| Path (internal state) | Component |
|----------------------|-----------|
| `home` | Full landing page |
| `login` | `LoginPage.tsx` |
| `signup` | `SignUpPage.tsx` |

Navigation is handled by a `page` state in `App.tsx` and an `onNavigate` prop passed to `Navbar`, `LoginPage`, and `SignUpPage`. No router dependency needed.

---

## Customization

- **Colors** — Edit CSS variables in `src/styles/_variables.scss`.
- **Fonts** — Change the `@import` in `index.html` and update `--ff-head` / `--ff-body`.
- **Background Images** — Replace Unsplash URLs in the SCSS section files (`_hero.scss`, `_sections.scss`, `_chat.scss`, etc.).
- **Destinations** — Edit the `destinations` array in `Destinations.tsx`.
- **Features** — Edit the `features` array in `Features.tsx`.
- **Testimonials** — Edit the `testimonials` array in `Testimonials.tsx`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start dev server at `localhost:5173` |
| `pnpm run build` | Type-check + build for production |
| `pnpm run preview` | Preview the production build locally |

---

## License

MIT — free to use for personal or commercial projects.

=======
# TravelMitra-AI-planner
>>>>>>> 5e4b59fa889a8f97265e6450b0d2d2c8c06d5da5
