---
name: Snipp
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424754'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  mono-md:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style
The brand personality is professional, utilitarian, and high-velocity. It is designed for developers and marketing teams who value efficiency and clarity. The aesthetic is rooted in **Minimalism** with a heavy influence from **Modern Corporate** SaaS patterns (Linear/Vercel). The goal is to evoke a sense of "instant" action through a clean interface, high-quality typography, and a lack of visual clutter. The UI stays out of the way, focusing entirely on the task of URL management and analytics.

## Colors
The palette is hyper-focused on legibility and functionality.
- **Background (#FAFAFA):** Used for the main application canvas to provide a soft contrast against white surface containers.
- **Surface (#FFFFFF):** Used for cards, inputs, and modals to create a clear "raised" area for interaction.
- **Text (#171717):** High-contrast black for primary headings and body copy to ensure maximum readability.
- **Accent (#3B82F6):** A vibrant blue reserved strictly for primary actions, progress indicators, and active states.
- **Border (#E5E5E5):** Subtle definition for UI boundaries without adding visual weight.

## Typography
This design system utilizes a systematic approach to Inter, focusing on tight letter-spacing for headlines to mimic high-end editorial SaaS products. 
- **Headlines:** Use Semi-Bold (600) with slight negative letter-spacing for a modern, "compact" feel.
- **Body:** Standard weight (400) for long-form data and descriptions.
- **Labels:** Use Medium (500) for small UI elements like table headers or button text to maintain legibility at small scales.
- **Monospace:** Use a mono font (Geist Mono or similar) for displaying generated short-links and API keys to differentiate them from standard text.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum widths for content readability.
- **Desktop:** 12-column grid with a 1200px max-width container. 24px gutters provide generous breathing room.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.
- **Spacing Rhythm:** Use a strict 8px base unit. Component internal padding should default to 12px or 16px (unit-md) to maintain a spacious, modern feel. Sections should be separated by 48px (unit-xl) to allow the "minimalist" aesthetic to thrive.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.
- **Level 0 (Background):** #FAFAFA. Used for the application foundation.
- **Level 1 (Surface):** #FFFFFF with a 1px border of #E5E5E5. Used for cards and main content areas.
- **Level 2 (Interactive/Overlay):** #FFFFFF with a very soft, diffused shadow (`0 4px 6px -1px rgb(0 0 0 / 0.05)`) and #E5E5E5 border. Used for dropdowns, tooltips, and modals.
- **Level 3 (Pop-over):** Used for primary modals; use a backdrop blur (12px) on the Level 0 layer to focus the user's attention.

## Shapes
The design system uses a **Rounded** language to soften the professional tone.
- **Standard (8px):** Applied to buttons, input fields, and small cards.
- **Large (16px):** Applied to main content containers and dashboard widgets.
- **Full (Pill):** Applied strictly to status chips (e.g., "Active", "Expired") and search bars to distinguish them from actionable buttons.

## Components
- **Buttons:** 
  - *Primary:* Solid #3B82F6 background, white text, 8px radius.
  - *Secondary:* #FFFFFF background, #E5E5E5 border, #171717 text. 
  - Focus states should use a 2px blue ring with an offset.
- **Inputs:** 
  - #FFFFFF background, #E5E5E5 border. On focus, the border shifts to #3B82F6. Use `label-md` for floating or top-aligned labels.
- **Cards:** 
  - White surface, 1px #E5E5E5 border, 12px or 16px radius. Padding should be consistent (24px).
- **Chips/Badges:** 
  - Small, pill-shaped elements with subtle background tints (e.g., a light blue background for an active link status).
- **Lists/Tables:** 
  - Clean rows with 1px bottom borders (#E5E5E5). Use `body-md` for row data and `label-md` (muted color) for headers.
- **URL Bar:** 
  - A prominent, oversized input field on the dashboard to encourage the primary action of shortening a link.