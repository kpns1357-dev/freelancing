---
name: Precision Ledger
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  numeric-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  numeric-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
---

## Brand & Style

The design system projects absolute financial clarity, operational calm, and deliberate precision tailored for modern small business owners, agency operators, and independent contractors. The interface must communicate stability, high utility, and transparent data architecture without feeling sterile or overly bureaucratic.

The aesthetic fuses **Corporate / Modern** discipline with **Minimalist** clarity:
- Razor-sharp legibility prioritizes dense financial data (line items, payment aging, tax breakdowns).
- Low visual noise eliminates distraction; subtle color markers provide immediate orientation for cash-flow states (paid, pending, overdue).
- Surfaces feel grounded and structural, relying on crisp 1px division lines and balanced micro-elevations rather than heavy skeuomorphism or aggressive ornamentation.

## Colors

The palette establishes an immediate cognitive shorthand for business status while keeping core surfaces quiet and legible.

### Semantic Tiers
- **Primary (`#2563EB`)**: Drives structural brand identity, interactive triggers, selected states, and core navigational affordances.
- **Secondary / Success (`#10B981`)**: Dedicated strictly to positive fiscal states: settled payments, cleared transactions, healthy margins, and upward trajectory metrics.
- **Tertiary / Warning (`#F59E0B`)**: Signals pending actions, payment reviews, draft statuses, and scheduled distributions.
- **Critical / Error (`#EF4444`)**: Expresses immediate attention blockers, failed webhooks, overdue receivables, and destructive actions.
- **Neutral (`#64748B`)**: Structural slate ramp governing typography, borders, table stripes, and subtle background containment.

### Dark Mode Principles
- Pure black `#000000` is rejected; root surfaces start at deep slate `#0B0F17` to prevent blinding contrast.
- Primary elements shift down from vivid saturation to maintain WCAG AAA compliance against slate backdrops (`#3B82F6`).
- Border opacities are pulled down to `rgba(148, 163, 184, 0.12)` to preserve crisp visual hierarchy without creating high-contrast grid lines.

## Typography

The pairing marries the geometric confidence of Plus Jakarta Sans for titles and metrics with the bulletproof utility of Inter for high-density tabular workspaces.

- **Numerical Uniformity**: All monetary columns, tax percentages, and invoice line totals must enable `font-feature-settings: "tnum" 1` to ensure tabular alignment across financial data grids.
- **Label Tracking**: Sub-12px badges, tags, and column header keys leverage slight letter spacing (`+0.04em`) with uppercase treatment to anchor complex forms.
- **Headline Constraints**: Never apply loose line-heights to financial headers; strict proportional leading prevents layout shifts during live balance updates.

## Layout & Spacing

The design system operates on an 8-point spatial model with 4-point micro-increments for tighter data tables, badges, and segmented controls.

### Screen Layout Architecture
- **Desktop (1280px+)**: 12-column fluid grid. Max content containment capped at 1440px. Side navigation locked at `260px` fixed width. Content canvas adjusts dynamically with 24px column gutters.
- **Tablet (768px - 1279px)**: 8-column layout. Navigation folds into an icon rail (`72px`) or modal off-canvas drawer. Outer canvas padding contracts to 32px.
- **Mobile (Below 768px)**: 4-column layout. 16px screen margins. Heavy desktop tables transform into sequential stacked transaction cards. Complex multi-step invoice flows compress into sequential full-width forms with sticky bottom action trays.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: **tonal layering backed by low-contrast outlines and micro-ambient shadows**. This avoids muddy dark modes and ensures precise panel separation.

### Surface Tiers
1. **Canvas (Base)**: `#F8FAFC` (Light) / `#0B0F17` (Dark). Receives no elevation; hosts background patterns and persistent side navigation.
2. **Surface Default (Cards & Panels)**: `#FFFFFF` (Light) / `#111827` (Dark). Border: 1px solid `#E2E8F0` (Light) / `rgba(255, 255, 255, 0.08)` (Dark). Ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
3. **Elevated (Dropdowns, Flyouts, Popovers)**: Elevated cleanly off the surface using `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)` with a delicate slate rim.
4. **Modal / Critical Dialog Overlay**: Root scrim dimmed with `rgba(15, 23, 42, 0.60)` accompanied by `backdrop-filter: blur(4px)`. Centered dialog carries `0 20px 25px -5px rgba(15, 23, 42, 0.12)`.

## Shapes

The design system maintains a **Soft** shape profile (`roundedness: 1`). Financial SaaS applications demand structured, dependable form factors; soft geometries ensure the UI feels modern and balanced while preventing excessive visual whimsy that detracts from professional credibility.

- **Base Radius (`0.25rem` / 4px)**: Checkboxes, inline code tokens, numerical tags, and small table utility buttons.
- **Medium Radius (`0.5rem` / 8px)**: Default inputs, standard action buttons, dropdown trigger fields, and modal containers.
- **Card Radius (`0.75rem` / 12px)**: Dashboard summary cards, metric preview blocks, and invoice preview papers.
- **Full Radius (Pill / 9999px)**: Reserved strictly for transactional status badges (Paid, Due, Draft, Review) and user avatar masks.

## Components

### Buttons
- **Primary**: Solid `#2563EB` fill, white text, 8px border radius, subtle inner highlight `inset 0 1px 0 rgba(255, 255, 255, 0.16)`. Hover: `#1D4ED8`. Active: `#1E40AF`.
- **Secondary / Outline**: 1px solid border `#CBD5E1`, surface `#FFFFFF`, text `#0F172A`. Hover: Background `#F1F5F9`.
- **Tertiary / Ghost**: Transparent base with text `#475569`. Hover: `#F8FAFC`.
- **Destructive**: Base surface `#FEF2F2`, border `#FCA5A5`, text `#DC2626`. Hover: Base `#FEE2E2`.

### Status Badges & Chips
- Status markers enforce high contrast and clear recognition:
  - **Paid / Completed**: Background `#ECFDF5`, text `#065F46`, border 1px solid `#A7F3D0`.
  - **Pending / Scheduled**: Background `#FFFBEB`, text `#92400E`, border 1px solid `#FDE68A`.
  - **Overdue / Alert**: Background `#FEF2F2`, text `#991B1B`, border 1px solid `#FECACA`.
  - **Draft / Inactive**: Background `#F1F5F9`, text `#475569`, border 1px solid `#E2E8F0`.
- All badges feature an optional 6px circular dot indicator on the leading side.

### Form Inputs & Selectors
- Standard height: 40px with `0.5rem` radius.
- Background: `#FFFFFF` (Light) / `#1E293B` (Dark). Border: 1px solid `#CBD5E1` (Light) / `#334155` (Dark).
- Focus State: Border color `#2563EB` with an external glow ring: `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15)`. No default browser outlines.
- Currency Fields: Prefix slot pinned to `#F8FAFC` background with a right divider line, featuring a fixed `$` or custom currency token.

### Data Tables & Invoicing Grids
- **Header**: 36px height, uppercase `label-sm` typography, background `#F8FAFC`, border-bottom 1px solid `#E2E8F0`.
- **Rows**: 52px height, baseline aligned, subtle hover overlay `#F8FAFC` transition. Selected row: `#EFF6FF`.
- **Financial Alignment**: Numeric amounts, rates, balances, and totals are strictly right-aligned; statuses and dates are centered; descriptions and client IDs are left-aligned.

### Cards & Summary Blocks
- Surface cards feature a 1px border (`#E2E8F0`), padding of `1.5rem`, and 12px corner rounding.
- KPI summary blocks incorporate an inline metric trend flag (`+12.4%`) nested in the top right corner adjacent to the numerical total.