# Component Documentation

This guide documents all reusable components and their usage patterns.

## UI Components

### Button Component

```typescript
import { Button } from '@/components/common/Button';

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
<Button fullWidth>Full Width</Button>

// With Icons
<Button>
  <FiArrowRight /> Continue
</Button>
```

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

### Card Component

```typescript
import { Card } from '@/components/common/Card';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Non-hoverable
<Card hoverable={false}>Content</Card>

// With custom className
<Card className="bg-blue-500/10">Content</Card>

// With click handler
<Card onClick={() => navigate('/details')}>
  Clickable card
</Card>
```

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}
```

### Badge Component

```typescript
import { Badge } from '@/components/common/Badge';

// Variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>

// With custom className
<Badge variant="primary" className="text-sm">
  Small Badge
</Badge>
```

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}
```

## Section Components

### Hero Section

The Hero section includes:
- Animated headline with gradient text
- AI search form with multiple inputs
- Quick-filter interest tags
- Trust indicators
- Animated background effects

```typescript
<Hero />
```

**Features:**
- Responsive form layout (1 column on mobile, 4 on desktop)
- Animated background circles
- Staggered content animations
- Interest tag selection
- Form validation ready

### Features Section

```typescript
<FeaturesSection />
```

Displays 6 features in a responsive grid:
- AI Itinerary Generation
- Smart Hotel Recommendations
- Real-time Weather Updates
- Google Maps Integration
- Budget Optimization
- Hidden Gems Discovery

### Destinations Section

```typescript
<DestinationsSection />
```

Features:
- Image carousel with hover zoom
- Rating and budget display
- Responsive grid (1-3 columns)
- Smooth hover transitions
- "View All" navigation

### Chat Preview Section

```typescript
<ChatPreviewSection />
```

Shows:
- Sample AI conversation
- User/AI message bubbles
- Call-to-action buttons
- Modern chat interface

### Testimonials Section

```typescript
<TestimonialsSection />
```

Displays:
- Customer reviews
- Star ratings
- User avatars
- Company/role information

### Newsletter Section

```typescript
<NewsletterSection />
```

Includes:
- Email input field
- Subscribe button
- Email validation
- Success/error states

## Animation Utilities

### Framer Motion Variants

```typescript
import { 
  staggerContainer, 
  staggerItem, 
  fadeInUp 
} from '@/utils/helpers';

// Staggered container for list animations
<motion.div variants={staggerContainer}>
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {/* Content */}
    </motion.div>
  ))}
</motion.div>

// Single item entrance
<motion.div variants={fadeInUp}>
  Content
</motion.div>
```

### Common Patterns

**Hover & Tap Effects:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive Button
</motion.button>
```

**Viewport Animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, margin: '-100px' }}
>
  Content that animates when scrolled into view
</motion.div>
```

**Staggered List:**
```typescript
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

## Styling Guidelines

### Using Glass Effect

```typescript
// In TypeScript/TSX
<div className="glass rounded-2xl p-6">
  Glass effect container
</div>

// Or with SCSS
.my-container {
  @include glass;
}
```

### Gradient Text

```typescript
<h1 className="gradient-text">
  Gradient Text Heading
</h1>
```

### Responsive Layout

```typescript
// Use Tailwind's responsive prefixes
<div className="
  grid
  grid-cols-1      /* Mobile */
  md:grid-cols-2   /* Tablet */
  lg:grid-cols-3   /* Desktop */
  gap-6
">
  {/* Items */}
</div>
```

### CSS Classes

**Utility Classes:**
- `.glass` - Glassmorphism effect
- `.gradient-text` - Gradient text color
- `.section-title` - Large section heading
- `.section-subtitle` - Section subtitle
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Glass card effect

**Layout Classes:**
- `.container` - Max-width container (1200px)
- `.section` - Padded section (5rem top/bottom)

## Data Structure

### Destination Object

```typescript
interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviews: number;
  budget: string;
  description: string;
  highlights: string[];
}
```

### Feature Object

```typescript
interface Feature {
  icon: string;      // Emoji
  title: string;
  description: string;
}
```

### Testimonial Object

```typescript
interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}
```

## Common Mistakes to Avoid

❌ **Don't:**
- Mix Tailwind classes with inline styles
- Use inline event handlers without useCallback
- Forget accessibility attributes
- Ignore mobile viewport meta tag
- Add animation without prefers-reduced-motion

✅ **Do:**
- Use className for styling
- Memoize callbacks
- Add aria-labels and semantic HTML
- Test on real mobile devices
- Respect user motion preferences

## Responsive Design Patterns

### Mobile-First Approach
```typescript
// Default (mobile)
<div className="text-base">

// Larger screens
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
```

### Grid Layouts
```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive gap
<div className="gap-4 md:gap-6 lg:gap-8">

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
```

## Performance Tips

1. **Use React.memo** for components that don't change often
2. **Lazy load images** with native lazy loading
3. **Code split routes** with React.lazy()
4. **Debounce scroll events** with useCallback
5. **Optimize Framer Motion** - avoid animating large DOM trees
6. **Use CSS over animations** when possible
7. **Profile with DevTools** to identify bottlenecks

---

**Last Updated:** 2026  
**Maintained by:** Frontend Architecture Team
