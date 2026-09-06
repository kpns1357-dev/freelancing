# ClientFlow — Design System & UI/UX Specification

## 1. Overview & Positioning
**ClientFlow** is an intuitive, all-in-one Client & Invoice Management web application engineered specifically for freelancers, consultants, and boutique creative/digital agencies managing 10–50 active clients who are graduating from chaotic WhatsApp threads, disjointed email chains, and manual Excel spreadsheets.

---

## 2. Color Palette & Token System

### Light Theme
- **Brand Primary:** `#2563EB` (Blue 600) — Main CTA, active states, key interactive points
- **Brand Primary Hover:** `#1D4ED8` (Blue 700)
- **Primary Accent / Background Subdued:** `#EFF6FF` (Blue 50)
- **Neutral Dark / Text Primary:** `#0F172A` (Slate 900) — Headings, high emphasis text
- **Text Secondary:** `#475569` (Slate 600) — Labels, descriptions, supporting data
- **Text Muted / Tertiary:** `#94A3B8` (Slate 400) — Placeholders, inactive icons
- **Border / Divider:** `#E2E8F0` (Slate 200) — Cards, table grid lines, inputs
- **Surface / Background Main:** `#F8FAFC` (Slate 50) — Page canvas
- **Surface Container (Card / Table):** `#FFFFFF` — Modals, popovers, table rows, cards
- **Surface Hover:** `#F1F5F9` (Slate 100)

### Status & Semantic Tokens
- **Success / Paid / Revenue:** `#10B981` (Emerald 500) | Soft bg: `#ECFDF5` | Text: `#065F46`
- **Warning / Pending / Planning:** `#F59E0B` (Amber 500) | Soft bg: `#FFFBEB` | Text: `#92400E`
- **Info / In Progress:** `#3B82F6` (Blue 500) | Soft bg: `#EFF6FF` | Text: `#1E40AF`
- **Error / Overdue / Delete:** `#EF4444` (Red 500) | Soft bg: `#FEF2F2` | Text: `#991B1B`

### Dark Theme Tokens
- **Surface Background:** `#0B0F19`
- **Surface Container:** `#131B2E`
- **Surface Elevated:** `#1E293B`
- **Border / Outline:** `#2A374F`
- **Text Primary:** `#F8FAFC`
- **Text Secondary:** `#94A3B8`
- **Brand Primary:** `#3B82F6`

---

## 3. Typography Hierarchy
Font Family: **Plus Jakarta Sans** / **Inter** (Google Fonts — 100% Free & Open Source)
- **Display 1 (Dashboard Stat Figures):** 32px / 1.2 / Bold (700) / Tracking: -0.02em
- **Heading 1 (Page Title):** 24px / 1.3 / Bold (700) / Tracking: -0.015em
- **Heading 2 (Section Title / Modal Title):** 18px / 1.4 / Semi-bold (600)
- **Heading 3 (Card Subheading / Table Group):** 15px / 1.4 / Semi-bold (600)
- **Body Regular (Main reading text):** 14px / 1.5 / Regular (400)
- **Body Medium (Table Cells, Form Inputs, Badges):** 14px / 1.5 / Medium (500)
- **Small / Caption (Metadata, timestamps, footnotes):** 12px / 1.4 / Medium (500)
- **Micro / Badge Text:** 11px / 1.2 / Semi-bold (600) / Uppercase tracking: +0.04em

---

## 4. Spacing & Grid System
- **Base Unit:** 4px
- **Scale:** `xxs` (4px), `xs` (8px), `sm` (12px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (64px)
- **Desktop Grid:** 12-column layout, max-width 1440px, 24px column gutters, 32px outer margin
- **Tablet Grid:** 8-column layout, 16px gutters, 24px margins
- **Mobile Grid:** 4-column layout, 12px gutters, 16px margins
- **Border Radius:** `sm` (6px for buttons/inputs), `md` (10px for cards), `lg` (16px for modals/drawers), `pill` (9999px for status tags)

---

## 5. Component Hierarchy & Atomic Conventions
1. **Atoms**
   - `Button`: Primary, Secondary, Outline, Ghost, Danger, Icon-only
   - `Badge/Tag`: Status (Paid, Pending, Overdue, In Progress, Planning, Completed)
   - `Avatar`: Client initials / photo with fallback colored ring
   - `Input`: Text, Search, DatePicker, Select, Textarea, Currency input
   - `Icon`: Heroicons / Lucide outline vector conventions
2. **Molecules**
   - `MetricCard`: Icon + Value + Delta trend + Label
   - `SearchFilterBar`: Global search field + Status dropdown filter + Date range picker + "New" CTA
   - `InvoiceLineItemRow`: Description + Qty + Rate + Amount calculation + Remove action
   - `ToastNotification`: Status icon + title + description + dismiss button
   - `EmptyStateBlock`: Illustrated SVG icon + headline + helpful subtitle + action button
3. **Organisms**
   - `TopNavigation` & `SidebarNav`: App branding, route switcher, notification bell, user profile
   - `DataTable`: Responsive headers, sorting indicators, row hover, checkbox selector, action dots menu
   - `ClientDrawerModal`: Create/Edit client form with tabbed sections (General, Billing info, Notes)
   - `InvoiceBuilder`: Two-column layout (Metadata inputs + dynamic line item builder + live summary)
   - `InvoiceDocumentPreview`: Clean printable document layout with client info, itemized table, bank transfer info, signature stamp
4. **Templates & Breakpoint Adaptations**
   - **Laptop (1200px+):** Fixed left navigation (240px) + flexible main container + multi-column grid
   - **Tablet (768px – 1199px):** Collapsible compact sidebar / top bar + 2-column metrics + horizontal scrolling data tables with sticky actions
   - **Mobile (< 768px):** Sticky top app bar + bottom navigation dock (Dashboard, Clients, Projects, Invoices) + card-based stacked table views + full-width drawer forms
