

## Plan: Remove Premium Insights + Redesign Buyer Dashboard + Visual Polish

### 1. Remove Premium Insights from Farmer Dashboard
- Remove `<PremiumInsights />` import and usage from `farmer-dashboard.tsx` (lines 14, 114)
- Delete `components/farmer/premium-insights.tsx`

### 2. Full Buyer Dashboard Redesign
The current buyer dashboard uses `sidebar-*` tokens throughout, creating a flat, dark, unresponsive layout. It will be completely rewritten to match the farmer dashboard's premium aesthetic.

**Layout & Structure:**
- Replace `sidebar-*` color tokens with standard theme tokens (`bg-background`, `text-foreground`, `glass-card`, etc.)
- Use `max-w-5xl mx-auto` for desktop, responsive stacking for mobile
- Add `pb-8` safe area at bottom

**Header:**
- Sticky glass header matching farmer side — logo, company name, dark mode toggle, notification bell, role-switch pill
- Welcome greeting with serif font heading, date display

**Navigation Tabs:**
- Pill-style tabs inside a glass container (not underline-border style)
- Horizontal scrollable on mobile

**Stats Row:**
- Bento grid with `glass-card` styling, icon accents, and `premium-shadow`
- Responsive: 4-col on desktop, 2-col on mobile

**Pool Cards:**
- Glass-card treatment with hover elevation transitions
- Quality badge with refined colors, star rating, countdown timer
- Tactile "Buy Now" button with primary gradient

**Auction Cards:**
- Live pulse indicator with gradient top bar
- Grid stats (qty, base, current bid, time) inside subtle rounded containers
- Smooth hover transitions

**Orders Tab:**
- Timeline-style cards with status-colored left border accent
- Status chips with proper semantic colors

**Analytics Tab:**
- 2x2 bento grid with glassmorphism, icon cards, subtle gradients

### 3. Visual Polish Across the App
- Add CSS keyframe animations to `app/globals.css`: `fade-in-up`, `stagger-in` for card entrance animations
- Add `.animate-fade-in-up` utility with staggered delays for dashboard content sections
- Add hover elevation transitions on all interactive cards (`.hover:premium-shadow-lg .hover:-translate-y-0.5`)
- Add subtle gradient mesh background to the body/main area
- Refine the farmer dashboard cards with entrance animations on mount

### Files Modified
1. `components/farmer/farmer-dashboard.tsx` — remove PremiumInsights
2. `components/farmer/premium-insights.tsx` — delete
3. `components/buyer/buyer-dashboard.tsx` — full rewrite with premium aesthetic
4. `app/globals.css` — add entrance animations and visual polish utilities

