# Design System Reference - Firs' Dibs BZ

## Color Palette

### Primary Colors

```
Navy Blue         #0f2f63   Primary brand color for headers, buttons, text
Navy Dark         #1a3f7a   Darker shade for hover states
Navy Extra Dark   #0a1f4d   Darkest shade for footer
```

### Secondary Colors

```
Bright Green      #87ef61   Accent color, active states, highlights
```

### Accent Colors

```
Hot Pink          #ff3b6d   Prices, badges, CTAs
Pink Light        #ff6b95   Secondary pink, gradients
```

### Neutral Colors

```
Off-white         #f8f8f8   Page background
Light Gray        #f5f5f5   Category backgrounds
Gray              #ddd       Borders
Dark Gray         #333       Body text
```

## Typography Scale

| Element | Font       | Weight  | Size     | Usage           |
| ------- | ---------- | ------- | -------- | --------------- |
| H1      | Montserrat | 800-900 | 2.5-4rem | Page titles     |
| H2      | Montserrat | 800     | 2-3rem   | Section headers |
| H3      | Montserrat | 700-800 | 1.5-2rem | Subsections     |
| Body    | Poppins    | 400-500 | 1rem     | Regular text    |
| Small   | Poppins    | 400     | 0.875rem | Secondary text  |
| Badge   | Poppins    | 600-700 | 0.75rem  | Labels, badges  |

## Component Specifications

### Header

```
Height:         84px (fixed)
Background:     #0f2f63
Padding:        16px (vertical), 16px-32px (horizontal)
Shadow:         0 10px 30px rgba(0,0,0,0.1)
Logo:           Gradient #87ef61 → #0f2f63
Search Box:     600px max-width, 12px-20px padding, radius 30px
Icons:          White, 24px, hover color #87ef61
Z-index:        1000
```

### Categories Navigation Bar

```
Height:         48px-56px (with padding)
Position:       Sticky, top: 84px (below header)
Background:     White
Shadow:         0 5px 15px rgba(0,0,0,0.05)
Border:         1px solid #ddd
Buttons:        8px-16px padding, radius 20px
Active State:   Gradient from #0f2f63 to #1a3f7a
```

### Hero Slider

```
Height:         450px (desktop), 384px (mobile)
Border Radius:  16px
Shadow:         0 10px 30px rgba(0,0,0,0.15)
Content Box:    rgba(15,47,99,0.85) with backdrop blur
Overlay:        rgba(15,47,99,0.4)
Animation:      5s auto-advance
```

### Product Card

```
Width:          220px-280px (carousel), auto (grid)
Border Radius:  16px
Shadow:         0 5px 15px rgba(0,0,0,0.08)
Hover:          -translate-y-8px, shadow-2xl
Badge:          Gradient #ff3b6d → #ff6b95
Image Zoom:     1.1x on hover
Button:         Navy gradient, 8px radius
```

### CTA Category Card

```
Width:          140px-160px per image (circular)
Border Radius:  50% (circle)
Image Diameter: 140px
Card Padding:   16px
Shadow:         0 8px 20px rgba(0,0,0,0.08)
Border-top:     5px gradient accent
Hover:          -translate-y-10px
```

### Footer

```
Background:     Gradient #0a1f4d → #0f2f63
Top Border:     5px gradient #87ef61 → #ff3b6d
Columns:        4 (desktop), 2 (tablet), 1 (mobile)
Column Width:   25% (desktop), 50% (tablet), 100% (mobile)
Text Color:     White/Light gray
Link Hover:     #87ef61
Copyright:      Gray text, smaller font
```

## Gradient Definitions

### Primary Gradient (Buttons)

```css
background: linear-gradient(to right, #0f2f63, #1a3f7a);
```

### Accent Gradient (Pink)

```css
background: linear-gradient(135deg, #ff3b6d, #ff6b95);
```

### Green Gradient

```css
background: linear-gradient(to right, #87ef61, #0f2f63);
```

### Footer Gradient

```css
background: linear-gradient(to right, #0a1f4d, #0f2f63);
```

## Animation Specifications

### Scroll Animation

```css
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
animation: scroll 25s linear infinite;
```

### Fade In Up

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: fadeInUp 0.8s ease forwards;
```

### Slide In Left

```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
animation: slideInLeft 0.8s ease forwards;
```

### Zoom In

```css
@keyframes zoomIn {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
animation: zoomIn 15s linear infinite;
```

### Pulse

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
animation: pulse 2s infinite;
```

### Bounce

```css
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
animation: bounce 2s infinite;
```

## Spacing System

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 96px
```

## Border Radius System

```
sm:  4px
md:  8px
lg:  12px
xl:  16px
2xl: 20px-24px
3xl: 32px
full: 50%
```

## Shadow System

```
sm:         0 1px 2px 0 rgba(0,0,0,0.05)
md:         0 5px 15px rgba(0,0,0,0.08)
lg:         0 10px 30px rgba(0,0,0,0.1)
xl:         0 15px 30px rgba(0,0,0,0.15)
2xl:        0 20px 40px rgba(0,0,0,0.2)
```

## Responsive Breakpoints

```
sm:   640px   (small phones)
md:   768px   (tablets)
lg:   1024px  (small desktops)
xl:   1280px  (desktops)
2xl:  1536px  (large screens)

Custom:
576px  (tablets)
992px  (footer/layout adjustments)
```

## Button Variants

### Primary Button

```css
background: linear-gradient(to right, #0f2f63, #1a3f7a);
color: white;
padding: 12px 24px;
border-radius: 8px;
hover: shadow-lg;
```

### Accent Button

```css
background: linear-gradient(to right, #ff3b6d, #ff6b95);
color: white;
padding: 12px 24px;
border-radius: 8px;
hover: shadow-lg;
```

### Secondary Button

```css
background: #87ef61;
color: #0f2f63;
padding: 12px 24px;
border-radius: 8px;
hover: shadow-lg;
```

## States & Interactions

### Hover States

- Buttons: Shadow increase, slight scale (1.02-1.05)
- Links: Color change to #87ef61
- Cards: -translate-y (8px-10px), shadow increase
- Icons: Color change to #87ef61

### Focus States

- Inputs: Border color #0f2f63, ring #0f2f63/10%
- Buttons: Outline or ring effect
- Links: Underline or color change

### Active States

- Navigation: Gradient background #0f2f63 → #1a3f7a
- Toggles: Color to #87ef61
- Tabs: Underline or background highlight

### Loading States

- Spinners: Navy border, green accent top
- Skeleton: Animated gray boxes
- Progress: Green gradient

## Accessibility

- Contrast Ratios: All text meets WCAG AA standards
- Focus Indicators: Visible on all interactive elements
- Colors: Not the only differentiator
- Typography: Clear hierarchy with good readability
- Motion: Respects prefers-reduced-motion

## File References

All styles are defined in:

- `src/app/globals.css` - Global variables, animations, utilities
- Component files - Tailwind classes + inline styles
- Responsive breakpoints - Tailwind configuration

## Usage Examples

### Gradient Text

```html
<h2
  class="text-transparent bg-clip-text bg-gradient-to-r from-[#0f2f63] to-[#87ef61]"
>
  Styled Text
</h2>
```

### Hover Effects

```html
<button
  class="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
>
  Click Me
</button>
```

### Gradient Background

```html
<div class="bg-gradient-to-r from-[#0f2f63] to-[#1a3f7a]">Content</div>
```

### Animation

```html
<div class="animate-scroll">Scrolling text...</div>
```
