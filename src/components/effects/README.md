# Visual Effects System

A sophisticated collection of visual enhancement components for the SenseiiWyze dashboard, inspired by modern web design while maintaining professional appearance and accessibility standards.

## Overview

The effects system provides:
- **Gradient Text & Buttons** - Enhanced typography and interactive elements
- **Background Effects** - Animated blobs and gradient backgrounds  
- **Grid Patterns** - Subtle geometric textures
- **CSS Utilities** - Ready-to-use classes for quick styling
- **Accessibility** - Respects user motion preferences
- **Performance** - CSS-based animations with minimal JavaScript

## Components

### GradientText

Beautiful gradient text effects using our brand color system.

```tsx
import { GradientText } from '@/components/effects'

// Basic usage
<GradientText variant="brand" size="2xl">
  AI-Powered Learning
</GradientText>

// Animated gradient
<GradientText variant="rainbow" animate>
  Dynamic Text
</GradientText>
```

**Props:**
- `variant`: 'brand' | 'vibrant' | 'subtle' | 'neural' | 'warmth' | 'rainbow'
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
- `animate`: boolean - enables gradient animation

### GradientButton

Enhanced buttons with gradient backgrounds and visual effects.

```tsx
import { GradientButton } from '@/components/effects'

// Enhanced button with glow
<GradientButton variant="brand" size="lg" animated glow>
  Get Started
</GradientButton>

// Glass morphism style
<GradientButton variant="glass" animated>
  Learn More
</GradientButton>
```

**Props:**
- `variant`: 'brand' | 'vibrant' | 'subtle' | 'neural' | 'warmth' | 'glass'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `animated`: boolean - enables hover animations
- `glow`: boolean - adds glow effect

### BlobAnimation

Organic, animated background elements for visual interest.

```tsx
import { BlobAnimation } from '@/components/effects'

// Floating blob
<BlobAnimation 
  variant="primary" 
  size="lg" 
  className="top-10 left-10"
  speed="slow"
/>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'accent' | 'multi'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `intensity`: 'subtle' | 'medium' | 'strong'
- `speed`: 'slow' | 'medium' | 'fast'
- `blur`: boolean - applies blur effect
- `respectMotion`: boolean - respects reduced motion preference

### GradientBackground

Full-page gradient backgrounds with multiple variants.

```tsx
import { GradientBackground } from '@/components/effects'

// Subtle astral background
<GradientBackground 
  variant="astral" 
  intensity="subtle" 
  direction="radial"
/>
```

**Props:**
- `variant`: 'astral' | 'neural' | 'warmth' | 'cosmic' | 'aurora' | 'mesh'
- `intensity`: 'subtle' | 'medium' | 'vibrant'
- `direction`: 'radial' | 'linear' | 'conic'
- `overlay`: boolean - renders above content

### GridPattern

Subtle geometric patterns for texture and depth.

```tsx
import { GridPattern } from '@/components/effects'

// Dots pattern overlay
<GridPattern 
  variant="dots" 
  size="md" 
  intensity="subtle"
/>
```

**Props:**
- `variant`: 'dots' | 'lines' | 'squares' | 'hexagon'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `intensity`: 'subtle' | 'medium' | 'visible'
- `animated`: boolean - enables subtle animation
- `fadeEdges`: boolean - fades pattern at edges

## CSS Utilities

Pre-built utility classes for quick styling:

### Background Gradients
```css
.bg-mesh-gradient      /* Multi-point mesh gradient */
.bg-cosmic-gradient    /* Cosmic-inspired background */
.bg-aurora-gradient    /* Aurora-like effect */
```

### Glass Morphism
```css
.glass-card            /* Glass card effect */
.glass-nav             /* Glass navigation style */
```

### Shadow Effects
```css
.shadow-glow-primary   /* Primary color glow */
.shadow-glow-accent    /* Accent color glow */
.shadow-glow-success   /* Success color glow */
```

### Animations
```css
.animate-gradient-x    /* Animated gradient text */
.animate-float         /* Floating animation */
.animate-shimmer       /* Shimmer effect */
```

### Masks
```css
.mask-gradient-to-center  /* Radial fade mask */
.mask-gradient-to-bottom  /* Bottom fade mask */
.mask-gradient-to-top     /* Top fade mask */
```

## Complete Example

Here's how to create an enhanced hero section:

```tsx
import { 
  GradientText, 
  GradientButton, 
  BlobAnimation, 
  GradientBackground, 
  GridPattern 
} from '@/components/effects'

export function EnhancedHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <GradientBackground variant="astral" intensity="subtle" direction="radial" />
      <GridPattern variant="dots" size="lg" intensity="subtle" className="opacity-40" />

      {/* Animated Elements */}
      <BlobAnimation variant="primary" size="xl" className="top-10 -left-32" speed="slow" />
      <BlobAnimation variant="secondary" size="lg" className="bottom-20 -right-20" speed="medium" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-8">
          <GradientText variant="brand" size="3xl" animate>
            Predict Training Success
          </GradientText>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          AI-powered learning with{' '}
          <GradientText variant="neural">87% accuracy</GradientText>
        </p>

        <GradientButton variant="brand" size="xl" animated glow>
          Get Started
        </GradientButton>
      </div>
    </section>
  )
}
```

## Design Principles

1. **Professional First** - Effects enhance rather than overwhelm
2. **Brand Consistent** - Uses our oklch() color system throughout
3. **Performance Optimized** - CSS animations with minimal JavaScript
4. **Accessible** - Respects user motion preferences
5. **Composable** - Mix and match effects as needed
6. **Subtle by Default** - Conservative intensity settings

## Color System Integration

All effects use our semantic color tokens:
- `primary` - Vivid indigo (285.4deg)
- `secondary` - Bright turquoise (213.8deg)  
- `accent` - Electric pink (345.2deg)
- `success` - Green (158.4deg)
- `chart-*` - Extended color palette

This ensures consistent theming across light/dark modes and potential future theme variations.

## Performance Notes

- **CSS-First**: Animations use CSS transforms and opacity
- **Hardware Accelerated**: Uses GPU-accelerated properties
- **Motion Respect**: Automatically disables animations for users with motion sensitivity
- **Blur Optimization**: Backdrop-filter used efficiently
- **Z-Index Management**: Proper layering without conflicts

## Browser Support

- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **oklch() Colors**: Graceful fallback for older browsers
- **Backdrop Filter**: Progressive enhancement
- **CSS Masks**: Webkit prefixes included

## Demo & Testing

Use the `EffectsDemo` component to explore all available effects:

```tsx
import { EffectsDemo } from '@/components/effects'

// In your page or development environment
<EffectsDemo />
```

This provides an interactive showcase of all components with live controls for testing different variants and combinations.