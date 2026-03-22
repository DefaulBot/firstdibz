# Admin Panel - Styling Guide

## Design System Overview

The admin panel follows the same design system as the rest of the application, ensuring visual consistency.

## Color Palette

### Primary Colors

- **Navy Blue**: `#0f2f63` - Primary actions, headers
- **Emerald**: `#10b981` - Success states, positive metrics
- **White**: `#ffffff` - Backgrounds, cards

### Semantic Colors

- **Success (Green)**: `bg-green-50`, `border-green-200`, `text-green-700`
- **Warning (Amber)**: `bg-amber-50`, `border-amber-200`, `text-amber-700`
- **Error (Red)**: `bg-red-50`, `border-red-200`, `text-red-700`
- **Info (Blue)**: `bg-blue-50`, `border-blue-200`, `text-blue-700`

### Neutral Colors

- **Zinc Scale**: Used for secondary text, borders, and backgrounds
  - `bg-zinc-50` - Light backgrounds
  - `bg-zinc-100` - Hover states
  - `border-zinc-200` - Borders
  - `text-zinc-600` - Secondary text
  - `text-zinc-900` - Primary text

## Components

### Buttons

```tsx
// Primary (Navy Blue)
<Button variant="primary">Action</Button>

// Secondary (Emerald)
<Button variant="secondary">Alternate Action</Button>

// Ghost (Transparent)
<Button variant="ghost">Link-like button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### Badges

```tsx
// Status badge
<Badge className="border-green-200 bg-green-50 text-green-700">Paid</Badge>
<Badge className="border-amber-200 bg-amber-50 text-amber-700">Pending</Badge>
<Badge className="border-red-200 bg-red-50 text-red-700">Cancelled</Badge>
```

### Cards

```tsx
// Standard card
<div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
  Content
</div>

// Light background card
<div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-4">
  Content
</div>
```

### Input

```tsx
<Input
  placeholder="Search..."
  className="pl-11" // For icons
/>
```

## Spacing Scale

Tailwind spacing is used throughout. Key values:

- Padding: `p-4`, `p-6`, `p-8`
- Margin: `m-4`, `m-6`, `mt-4`, `gap-3`, `gap-4`, `gap-6`

## Border Radius

- `rounded-2xl` - Standard for buttons and larger elements
- `rounded-xl` - For smaller elements
- `rounded-lg` - For compact elements
- `rounded-full` - For badges and pill shapes

## Shadow

- `shadow-sm` - Subtle elevation for cards
- `shadow-soft` - Custom soft shadow for interactive elements

## Typography

### Font Sizes

- `text-xs` - Labels, helper text
- `text-sm` - Body text, smaller content
- `text-base` - Standard body text
- `text-lg` - Section headers
- `text-xl` - Page headers
- `text-2xl` - Large headers

### Font Weights

- `font-medium` - 500 weight
- `font-semibold` - 600 weight
- `font-bold` - 700 weight
- `font-extrabold` - 800 weight
- `font-black` - 900 weight (for prominent stats)

## Layout Patterns

### Stat Card

```tsx
<div className="rounded-[2rem] border p-4 border-blue-200 bg-blue-50 text-blue-700">
  <div className="flex items-center gap-2 text-xs font-bold">
    <Icon />
    Label
  </div>
  <div className="mt-2 text-2xl font-black">Value</div>
</div>
```

### Order Row

```tsx
<div className="flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center">
  {/* Image */}
  <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white" />

  {/* Content */}
  <div className="flex-1" />

  {/* Actions */}
  <div className="flex gap-2" />
</div>
```

### Detail Item

```tsx
<div className="rounded-lg p-2">
  <div className="text-xs font-bold uppercase text-zinc-600">Label</div>
  <div className="mt-1 font-extrabold text-zinc-900">Value</div>
</div>
```

## Responsive Design

The admin panel is fully responsive using Tailwind breakpoints:

- Mobile-first approach
- `sm:` for small screens (640px+)
- `md:` for medium screens (768px+)
- `lg:` for large screens (1024px+)

## Animation

Uses Framer Motion for smooth transitions:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: idx * 0.05 }}
>
  Content
</motion.div>
```

## Icons

Uses lucide-react for consistent iconography:

```tsx
import { Icon } from "lucide-react";
<Icon className="h-4 w-4" />; // Size variants
```

## Accessibility

- Proper semantic HTML
- Focus states on interactive elements
- Color not used alone for meaning
- Proper contrast ratios (WCAG AA compliant)
- Keyboard navigation support
