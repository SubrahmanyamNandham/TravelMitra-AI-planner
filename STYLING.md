# Styling & Design Guide

Complete guide for styling, theming, and design patterns used in TravelMitra.io.

## Design Philosophy

TravelMitra.io blends design principles from industry leaders:
- **Airbnb**: Clean, spacious layouts with premium feel
- **Google Travel**: Minimalist UI with powerful search
- **Booking.com**: Trust indicators and social proof
- **Notion AI**: Modern glassmorphism and smooth interactions
- **Apple**: Attention to detail and motion design

## Color System

### Primary Palette
```scss
// Brand Colors
$blue-primary: #3b82f6;      // Main action color
$purple-accent: #9333ea;     // Accent/secondary color

// Backgrounds
$dark-950: #030712;          // Deepest background
$dark-900: #111827;          // Card backgrounds
$dark-850: #1a202c;          // Secondary backgrounds

// Text
$white-primary: #f9fafb;     // Primary text
$gray-300: #d1d5db;          // Secondary text
$gray-500: #6b7280;          // Tertiary text
$gray-600: #4b5563;          // Muted text

// Borders & Dividers
$border-light: rgba(255, 255, 255, 0.1);
$border-lighter: rgba(255, 255, 255, 0.05);

// Shadows
$shadow-blue: 0 10px 40px rgba(59, 130, 246, 0.25);
$shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Usage
```scss
// Apply in variables file
:root {
  --blue: #{$blue-primary};
  --purple: #{$purple-accent};
  --shadow-blue: #{$shadow-blue};
}

// Use in components
.button-primary {
  background: var(--blue);
  box-shadow: var(--shadow-blue);
}
```

## Typography System

### Font Stack
```scss
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
              'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Type Scale (Fluid with clamp())
```scss
// Headings
h1 { font-size: clamp(2.5rem, 8vw, 4.5rem); }  // Hero headlines
h2 { font-size: clamp(1.875rem, 5vw, 3rem); }  // Section titles
h3 { font-size: clamp(1.5rem, 4vw, 2rem); }    // Card titles

// Body
p  { font-size: 1rem; line-height: 1.6; }      // Regular paragraph
small { font-size: 0.875rem; }                  // Small text

// Labels
label { font-size: 0.875rem; font-weight: 500; }
```

### Line Height & Letter Spacing
```scss
// Headlines: tight spacing for impact
h1 {
  line-height: 1.1;
  letter-spacing: -0.02em;
}

// Body: comfortable reading
p {
  line-height: 1.6;
  letter-spacing: 0.003em;
}
```

## Spacing System

### Scale (Based on 1rem = 16px)
```
4px   - 0.25rem - xs
8px   - 0.5rem  - sm
12px  - 0.75rem - base
16px  - 1rem    - md
24px  - 1.5rem  - lg
32px  - 2rem    - xl
48px  - 3rem    - 2xl
64px  - 4rem    - 3xl
```

### Application
```scss
// Padding scales
.padding-compact { padding: 1rem; }
.padding-normal  { padding: 2rem; }
.padding-spacious { padding: 3rem; }

// Margin utilities
.gap-small { gap: 0.75rem; }
.gap-medium { gap: 1.5rem; }
.gap-large { gap: 2rem; }

// Responsive spacing
.section {
  padding: 3rem 1.5rem;    // Mobile
}

@media (min-width: 768px) {
  .section {
    padding: 5rem 0;       // Tablet+
  }
}
```

## Components Styling

### Button Component

**Primary Button (CTA)**
```scss
.btn-primary {
  background: linear-gradient(to right, #3b82f6, #9333ea);
  color: white;
  border-radius: 999px;
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.25);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

**Secondary Button (Alternative)**
```scss
.btn-secondary {
  @include glass;
  color: white;
  border-radius: 999px;
  padding: 0.875rem 1.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(59, 130, 246, 0.5);
  }
}
```

### Card Component

**Glass Card**
```scss
.card {
  @include glass;
  padding: 1.5rem;
  border-radius: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-6px);
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
  }
}
```

### Input Fields

```scss
.input-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
```

## Glassmorphism Pattern

Creates the distinctive frosted glass effect:

```scss
@mixin glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

// Usage
.glass-container {
  @include glass;
}
```

## Gradient Patterns

### Text Gradients
```scss
@mixin gradient-text {
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text {
  @include gradient-text;
}
```

### Background Gradients
```scss
.gradient-bg-primary {
  background: linear-gradient(135deg, #3b82f6, #9333ea);
}

.gradient-bg-subtle {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1), 
    rgba(147, 51, 234, 0.1)
  );
}
```

## Responsive Design Breakpoints

```scss
// Mobile-first approach
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

// Mixin for media queries
@mixin respond-to($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}

// Usage
.heading {
  font-size: 1.5rem;
  
  @include respond-to($breakpoint-md) {
    font-size: 2rem;
  }
  
  @include respond-to($breakpoint-lg) {
    font-size: 2.5rem;
  }
}
```

## Animation & Motion

### Keyframe Animations

```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
```

### Smooth Transitions

```scss
// Universal transition duration
$transition-fast: 0.2s;
$transition-normal: 0.3s;
$transition-slow: 0.5s;

// Common transition
$transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

// Apply with mixin
@mixin smooth-transition($duration: $transition-normal) {
  transition: all $duration ease;
}
```

### CSS Animations Utilities

```scss
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

## Focus & Accessibility

### Focus States
```scss
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Reduced Motion Preference
```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Utility Classes

```scss
// Display
.flex-center { @include flex-center; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }

// Text
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

// Backgrounds
.bg-gradient { background: linear-gradient(135deg, #3b82f6, #9333ea); }

// Visibility
.visually-hidden { 
  position: absolute; 
  width: 1px; 
  height: 1px; 
  overflow: hidden; 
  clip: rect(0, 0, 0, 0); 
}
```

## Dark Mode Considerations

Since TravelMitra.io uses a dark theme as default, ensure:

1. **Sufficient contrast** between text and background
2. **Readable text** colors for all text elements
3. **Visible borders** on cards and sections
4. **Accessible link colors** for both hover and focus states

## Custom CSS Properties (Variables)

```scss
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #9333ea;
  --color-bg: #030712;
  --color-text: #f9fafb;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  
  /* Typography */
  --font-size-base: 1rem;
  --font-weight-bold: 700;
  
  /* Effects */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Common Styling Patterns

### Section Container
```scss
.section {
  padding: 3rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 5rem 0;
  }
}
```

### Hero Section
```scss
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
```

### Grid Layout (Responsive)
```scss
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

**Remember:** Consistency, performance, and accessibility should guide all styling decisions.
