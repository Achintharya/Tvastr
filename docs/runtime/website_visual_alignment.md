# Website Visual Alignment

**Date:** May 19, 2026  
**Design System Version:** Light_Theme Industrial v1.0

---

## Design System Alignment

### Color Palette (Light Theme)

The design system has been unified to use Repo B's light industrial theme:

| Token | CSS Variable | Value | Usage |
|-------|--------------|-------|-------|
| **Background** |
| Primary | `--bg-primary` | `#ffffff` | Main page background |
| Secondary | `--bg-secondary` | `#f1f5ff` | Secondary sections |
| Elevated | `--bg-elevated` | `#ffffff` | Cards, modals |
| Panel | `--bg-panel` | `#eeece7` | Warm industrial panels |
| **Text** |
| Primary | `--text-primary` | `#212121` | Headlines, body |
| Secondary | `--text-secondary` | `#616161` | Subheadings |
| Muted | `--text-muted` | `#93939f` | Captions, hints |
| **Brand Colors** |
| Process Primary | `--process-primary` | `#003c33` | Deep enterprise green |
| Telemetry Primary | `--telemetry-primary` | `#1863dc` | Interactive blue |
| Signal Warning | `--signal-warning` | `#b45309` | Alerts, warnings |
| Signal Glow | `--signal-glow` | `#ff7759` | Accents, numerals |
| **Borders** |
| Subtle | `--border-subtle` | `rgba(0,0,0,0.05)` | Hairlines |
| Default | `--border-default` | `rgba(0,0,0,0.1)` | Standard borders |
| Strong | `--border-strong` | `rgba(0,0,0,0.15)` | Emphasized borders |

---

## Industrial Visual Identity Preservation

### Core Principles Maintained

1. **Control Room Aesthetic**
   - Grid patterns evoke measurement and precision
   - Monospace numerals (tabular-nums) for telemetry data
   - Blueprint-style corner guides

2. **Enterprise Green Anchoring**
   - `#003c33` used for primary CTAs and hero rail
   - Communicates operational reliability
   - Distinct from consumer SaaS palettes

3. **Signal-First Visual Hierarchy**
   - Clear distinction between:
     - Primary actions (green)
     - Secondary actions (outlined/underlined)
     - Telemetry data (blue)
     - Warnings/alerts (amber)

4. **Industrial Grid System**
   - 32px × 32px lattice via BackgroundGrid component
   - Warm amber trace at 7% opacity (`#f59e0b`)
   - Creates subtle blueprint texture

---

## Animation Strategy

### Philosophy
All animations serve **functional purpose** — guiding attention, indicating state changes, and providing feedback. No gratuitous motion.

### Hero Entry Choreography
Sequential reveal creates narrative flow:

| Element | Delay | Duration | Easing |
|---------|-------|----------|--------|
| Wordmark | 0ms | 600ms | power2.out |
| Tagline | +50ms | 500ms | power2.out |
| CTA | +50ms | 400ms | power2.out |
| Strip | +50ms | 400ms | power2.out |

**Total Duration:** ~1050ms (within [800, 1600] budget)

### Page Transitions
| State | Duration | Easing | Y-Offset |
|-------|----------|--------|----------|
| Enter | 220ms | [0.4, 0, 0.2, 1] | 8px → 0 |
| Exit | 180ms | [0.4, 0, 1, 1] | 0 → -4px |

### Cursor Follower
| Parameter | Value |
|-----------|-------|
| Radius | 24px |
| Opacity (visible) | 0.35 |
| Fade out after idle | 2000ms |
| Fade out duration | 400ms |
| Fade in duration | 180ms |

### Magnetic Hover
| Parameter | Value |
|-----------|-------|
| Max translation | ±8px |
| Spring-back duration | 220ms |
| Easing | cubic-bezier(0.2, 0, 0, 1) |

---

## Typography Updates

### Hierarchy

| Role | Size | Weight | Letter Spacing |
|------|------|--------|----------------|
| Hero | clamp(2.5rem, 5vw, 3.5rem) | 800 | -0.02em |
| Section Title | clamp(1.75rem, 3vw, 2.25rem) | 700 | -0.01em |
| Eyebrow | 0.6875rem | 600 | 0.2em |
| Body | 1rem | 400 | normal |
| Caption | 0.75rem | 500 | 0.15em |

### Font Stack
```css
font-family: "Elms Sans", "Inter", system-ui, sans-serif;
```

### Monospace (Telemetry)
```css
font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
```

---

## Runtime Visual Consistency

### Surfaces

| Surface Type | Background | Border | Shadow |
|--------------|------------|--------|--------|
| Panel | `var(--bg-elevated)` | `var(--border-default)` | `0 1px 2px subtle` |
| Elevated | `var(--bg-elevated)` | `var(--border-strong)` | `0 4px 12px default` |
| Signal | `var(--bg-panel)` | `var(--signal-warning)` | `0 1px 2px subtle` |
| Accent | `var(--bg-secondary)` | `var(--telemetry-primary)` | `0 1px 2px subtle` |

### Clip Paths (Machined Corners)
Industrial "notched" silhouette on cards:

```javascript
// Card chamfer: 12px top-right
cardClipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)"

// Tile chamfer: 16px top-right
tileClipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)"
```

---

## Reduced Motion Support

Full accessibility compliance through:

1. **Context-based Detection**
   - `useReducedMotion` hook reads OS preference
   - Value broadcast via `ReducedMotionContext`

2. **Component-level Handling**
   - Hero video: Not rendered when reduced motion active
   - GSAP timeline: Fast-forwards to final state
   - Page transitions: Instant swap
   - Cursor follower: Disabled entirely
   - Ping animation: Disabled on brand pill

3. **CSS Media Query Fallback**
   ```css
   @media (prefers-reduced-motion: reduce) {
     .hero-trace-line,
     .runtime-loader-dot,
     .belt-chevrons {
       animation: none !important;
     }
   }
   ```

---

## Visual Quality Checklist

| Aspect | Status |
|--------|--------|
| No overlapping sections | ✅ |
| No unreadable text | ✅ |
| No broken animations | ✅ |
| No z-index issues | ✅ |
| No hero clipping | ✅ |
| No overflow | ✅ |
| No collapsed sections | ✅ |
| Industrial identity preserved | ✅ |
| Not generic startup landing | ✅ |
| Edge-native feel maintained | ✅ |

---

## Target Visual Outcome

The final website should feel like:

✅ **Industrial intelligence platform**  
✅ **Operational runtime infrastructure**  
✅ **Cognition infrastructure for manufacturing**  
✅ **Edge-native industrial system**

❌ NOT a consumer SaaS AI startup  
❌ NOT a generic landing page template  
❌ NOT a VC pitch deck website

---

## Component Visual Reference

### Hero Section
- Full-height viewport with video backdrop
- White luminance gradient overlay (85% → 0%)
- Green radial tint (5% opacity)
- Amber grid pattern (7% opacity, 25% visible)
- Deep green system rail at bottom

### Brand Pill
- White background with backdrop blur
- Green outline and text
- Animated ping dot (when motion allowed)

### CTA Buttons
- Primary: Green pill with white text, magnetic hover
- Secondary: Underlined text link

### Capability Strip
- Full-bleed green background
- Three columns with index numerals
- Orange/coral glow on numerals
- White text with 70% opacity values
