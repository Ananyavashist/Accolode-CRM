# Accolode design system

Source of truth for visual language, accessibility, and the six broker jobs. Later UI work should follow this document instead of inventing chrome or flows per screen.

**Direction:** Attio’s gray, airy CRM chrome + Accolode teal as the only brand accent. Earthy chart colors are retired. Visual onboarding teaches the jobs — no modal product tour.

This document specifies. It does not restyle the app.

Visual references (Attio, web):

- [Attio screens collection](https://mobbin.com/apps/attio-web-f8618f57-3608-4752-9643-94b510d99b43/f29cde1f-b0ef-46b2-b029-726b09dcf71c/screens)
- [Companies table](https://mobbin.com/flows/39b96236-1b5d-4513-b583-20593af00f90)
- [Company detail](https://mobbin.com/flows/723a0c99-c91a-486b-816b-9ebe1f2bd387)
- [Reports / charts](https://mobbin.com/screens/ff2aaeab-9fa1-4b10-989e-147169c51741)
- [Notes empty](https://mobbin.com/screens/f6750bef-6bce-435c-8460-3c55f32f1254)
- [Email drafts empty](https://mobbin.com/screens/f639cc15-bf1c-40f2-9d89-4a213ef5304d)
- [Tasks empty + create](https://mobbin.com/screens/f25b1027-79a7-4a06-b482-6bd0d3017023)
- [Help and first steps](https://mobbin.com/screens/fa567c5a-616d-4991-88fc-e2a047b5fcfd)

---

## 1. Purpose

Accolode is a broker CRM. The UI must make six jobs obvious:

| Job | Flow | Challenge |
| --- | --- | --- |
| Clear the overnight pile | A — Lead triage | Deal visibility |
| Stop re-asking requirements | B — Understand the client | Repeating requirements |
| See where the deal is | C — Track progress | Deal visibility |
| Know who to call today | D — Follow up | Disappearing follow-ups |
| Capture a walk-in | E — Add client | Offline pipeline |
| Message without a second inbox | F — WhatsApp | Tool-switching |

Chrome stays quiet. Teal is for primary actions, focus, and key metrics. Color on data and status, not on navigation.

---

## 2. Principles

1. Chrome is quiet; data and one teal action carry color.
2. Active nav is a **gray pill**, not a filled teal block.
3. Depth comes from 1px borders and background shifts. Shadow only on popovers and modals.
4. Radius is 6–8px on controls, 8–10px on panels — not 10px on everything.
5. Lists are tables. Records are header + underline tabs + optional right details pane.
6. Every view has empty, filtered-empty, error, and loading states.
7. WCAG 2.2 AA is a token constraint, not a later pass.
8. Visual onboarding teaches the six jobs. Empty states and First steps replace a modal tour.

---

## 3. Visual onboarding

Onboarding is in-product and quiet, like Attio’s [Help and first steps](https://mobbin.com/screens/fa567c5a-616d-4991-88fc-e2a047b5fcfd) (`n/6` in the sidebar). No coach-mark overlay. No multi-step modal.

### First steps checklist

Replaces the Help construction page (`src/pages/Placeholder.tsx`). Six steps, one per job:

1. Triage a lead (Accept or Deprioritise)
2. Set a follow-up when you Accept
3. Read Said vs Doing on a client
4. Move a deal to Site Visit
5. Add a walk-in client
6. Message a client on WhatsApp

**Placement:** bottom of the sidebar — teal progress ring + `3/6` label + expandable list. Completing a step dismisses it. When all six are done, hide the widget.

**Completion rules:**

| Step | Completes when |
| --- | --- |
| Triage a lead | First Accept or Deprioritise |
| Set a follow-up | First persisted `Task` is saved |
| Read Said vs Doing | Client profile Preference Signals viewed (or first profile opened after the block ships) |
| Move a deal to Site Visit | First stage change to Site Visit (manual or auto-advance) |
| Add a walk-in | First `addClient` with Source Walk-in, Referral, or WhatsApp |
| Message on WhatsApp | First WhatsApp send is logged |

### Empty as teaching

The first empty state on each page is the teaching moment. Recipe (from [Attio Notes empty](https://mobbin.com/screens/f6750bef-6bce-435c-8460-3c55f32f1254)):

1. Small line illustration (neutral gray, no mascot)
2. Short title
3. One sentence
4. One primary CTA

Do not stack a second empty card inside an empty page.

### Dashboard as daily onboard

The first block on Overview is **Today**: overdue tasks, tasks due today, leads untouched 3+ days.

- New broker, nothing due: guided empty — “Nothing due today. Accept a lead and set a follow-up.” CTA → Client Leads.
- Returning broker: the work list.

`⌘K` search is optional later. It is not a substitute for a visible label.

---

## 4. Tokens

Current files: `tailwind.config.js`, `src/index.css`, `src/lib/theme.ts`.

### Color — brand and neutrals

Attio gray system. Accolode teal only as accent.

| Token | Hex | Tailwind name | Use |
| --- | --- | --- | --- |
| Primary | `#124553` | `primary` | CTA fill, focus ring, links, key metrics |
| Primary hover | `#0E3743` | `primary-700` | Hover/pressed; small teal text |
| Primary tint | `#EEF5F7` | `primary-50` | Soft highlight, selected row tint |
| Canvas | `#FFFFFF` | `surface` | Main workspace |
| Sidebar | `#F9FAFB` | `sidebar` | Nav, secondary wells |
| Hairline | `#E5E7EB` | `hairline` | 1px borders and row rules |
| Ink | `#111827` | `ink` | Titles, body, table values |
| Ink muted | `#6B7280` | `ink-muted` | Labels, secondary (must stay ≥ 4.5:1) |
| Ink soft | `#9CA3AF` | `ink-soft` | Decorative only — not essential text |

**Do not use** `#9AA1A9` (current `ink-soft`) for labels, placeholders-as-only-label, or helper copy that the broker must read.

### Color — data series (replaces earthy palette)

Retire `#607456`, `#EEE0CC`, `#BA6A4C`, `#7B2525` from `src/lib/theme.ts`. Cool analogous set next to teal:

| Role | Hex | Use |
| --- | --- | --- |
| Teal | `#124553` | Primary series, Direct leads, Rent bars |
| Cyan | `#2A9D8F` | Social / secondary series |
| Slate | `#3D5A80` | Platform / tertiary |
| Seafoam | `#52B788` | Fourth series, Sold if needed |
| Indigo | `#4C6EF5` | Fifth series, categorical extra |

Chart grid `#E5E7EB`, ticks `#6B7280`.

### Color — semantic

Complements of teal are **alerts only**, not decoration.

| Role | Text | Background | Meaning |
| --- | --- | --- | --- |
| Success | `#157A3A` | `#E7F6EC` | Up trend, Completed, done |
| Warning | `#B45309` | `#FEF3C7` | Overdue, mismatch flag |
| Danger | `#B42318` | `#FFE9EE` | Error, destructive, down trend |
| Info / active | `#1A5F6B` | `#E8F2F4` | Active lead, in progress |

Always pair color with **text and a dot or icon**. Never color alone.

### Categorical tags (Attio pastel pattern)

Pastel tint + darker same-hue text. Examples:

- High intent: seafoam tint / teal text
- Medium intent: cyan tint / slate text
- Low intent: sidebar gray / muted text
- Rent: `#EEF5F7` / `#124553`
- Buy: `#E8F2F4` / `#1A5F6B`
- Returned: warning pair
- Source (Portal, WhatsApp, Referral, Walk-in): rotate cyan / slate / seafoam / indigo tints

### Typography

Font: Inter (already loaded in `src/index.css`). Features: `cv11`, `ss01`. Antialiased.

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| Page title | 20px | 600 | 1.25 |
| Record name | 18px | 600 | 1.3 |
| Section title | 14px | 600 | 1.35 |
| Body / control | 14px | 400–500 | 1.5 |
| Table cell | 13px | 400 | 1.4 |
| Table header / meta | 12px | 500 | 1.35 |
| Badge / hint | 11–12px | 500 | 1.3 |

Do not use 800 on UI chrome. Page titles are semibold, not display-bold.

### Spacing

4px base. Common steps: 4, 8, 12, 16, 24, 32.

| Use | Value |
| --- | --- |
| Control padding | 8–12px |
| Page padding | 16px mobile, 24px laptop+ |
| Section gap | 16–24px (replace `spacing.section` 10px) |
| Table cell | 12px vertical, 16px horizontal |
| Sidebar item | 8px vertical, 12px horizontal |

### Radius

| Use | Value |
| --- | --- |
| Buttons, inputs, pills | 6px |
| Nav active pill, small cards | 8px |
| Panels, modals | 8–10px |
| Avatars (people) | 9999px |
| Company / property thumb | 6px |

### Elevation

| Use | Treatment |
| --- | --- |
| Cards, sidebar, table | Flat; 1px `hairline` |
| Popover, dropdown, toast | `0 8px 24px rgba(16, 24, 40, 0.12)` (`shadow-pop`) |
| Modal | Same pop shadow + 40% black scrim |

Do not use `shadow-card` on resting surfaces.

### Focus ring

```
outline: 2px solid #124553;
outline-offset: 2px;
```

Apply on `:focus-visible` only. Remove `outline-none` unless replaced by this ring.

### Icons

1.5px outline, 16–18px in chrome, 20px in empty states. Monochrome `ink-muted` unless active or semantic. Pair with text on primary actions and nav. Icon-only controls need `aria-label`.

---

## 5. Accessibility (WCAG 2.2 AA)

### Contrast

- Body and muted text ≥ 4.5:1 on white and `#F9FAFB`.
- `#6B7280` on white is the floor for secondary text.
- `#9CA3AF` is decoration only.
- Teal `#124553` on white is OK for large/bold; small teal text uses `#0E3743`.
- Status and tags: text color from the semantic/tag pair, not a light tint on white.

### Focus and keyboard

- Every control shows the 2px teal ring on `:focus-visible`.
- Tab order follows visual order.
- Sidebar drawer, notifications popover, Add Client, Accept follow-up: focus trap, close on Escape, restore focus to the opener.
- Dialogs: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Today `AddClientModal` has `role="dialog"` and no trap.
- Cancel actions may show an `Esc` hint (Attio [Tasks create](https://mobbin.com/screens/f25b1027-79a7-4a06-b482-6bd0d3017023)).

### Targets and names

- Touch (mobile/tablet, &lt;1024px): 44×44px minimum.
- Laptop/desktop: 36×36px minimum. Current `.icon-btn` is 36×36 — grow it below `lg`.
- Every icon button has a visible name or `aria-label`.
- Search fields have a `<label>` or `aria-label`. Placeholder is not the only name (Topbar, Client Database, Leads today).

### Structure

- Skip link to `#main`.
- Landmarks: `nav` (sidebar), `main`, `complementary` for record details.
- Breadcrumb already uses `aria-label="Breadcrumb"` — keep it.
- Charts: visible legend plus a short text summary or data table alternative. Do not put essential numbers in the chart only.

### Motion and live regions

- Honor `prefers-reduced-motion` (no sidebar slide, no toast motion).
- Success toasts: `role="status"`. Errors: `role="alert"`. `Snackbar` already uses `status`.
- Undo toast (Accept) is a status region with a focusable Undo button.

### Current gaps to fix on restyle

| Gap | Where |
| --- | --- |
| `outline-none` without a replacement ring | Inputs in Topbar, Client Database, Leads, Staff, Properties |
| Placeholder-only search | Topbar, list toolbars |
| Color-only status | `StatusBadge` |
| No focus trap / `aria-modal` | Add Client |
| 36px icon buttons on touch | `.icon-btn` |
| No skip link | `AppLayout` |
| Charts without text alternative | Overview donuts and bars |
| `ink-soft` used as readable meta | Calendar empty, some labels |

---

## 6. Heuristics (Nielsen)

| # | Heuristic | Do | Don’t (current) |
| --- | --- | --- | --- |
| 1 | Visibility of status | Active gray nav pill; underline tabs; Today counts; First steps `n/6`; Accept/Deprioritise toasts | Almost no loading; Help is “coming soon” |
| 2 | Match the real world | Broker words; Calendar spelling; WhatsApp, not a fake inbox | Sidebar “Calender”; colon-prefixed `InfoRow` (`: value`) |
| 3 | User control | Escape closes overlays; 5s Accept Undo; Cancel on follow-up | Deprioritise cannot be undone; no Escape contract |
| 4 | Consistency | One underline tab style; one table; one empty recipe | Segmented pills vs filled tabs vs cards |
| 5 | Error prevention | Required name + phone; disable Save until valid; stage derived from pipeline | Two editable status systems; Add Client has no identity |
| 6 | Recognition | Icon + text on nav and primary actions | Dead filter icon; icon-only More/Filter |
| 7 | Flexibility | Collapsed rail on laptop; table → cards on mobile; bulk triage | 40 overnight leads, one-by-one only |
| 8 | Minimal chrome | Flat panels; no card-in-card | `section-card` wrapping already-carded blocks |
| 9 | Error recovery | Inline field error + page banner + Retry | Almost no error UI |
| 10 | Help | Empty state = next action; First steps in sidebar | Help placeholder |

---

## 7. Responsiveness

Tailwind-aligned breakpoints:

| Viewport | Width | Layout |
| --- | --- | --- |
| Mobile | &lt;640px | Drawer nav; stacked header; full-width CTA; tables → cards; 2-pane is one pane + Back |
| Tablet | 640–1023px | 2-col stats; filters wrap; sidebar still a drawer; horizontal scroll last resort |
| Laptop | 1024–1279px | Persistent sidebar (collapsible icon rail); 2-pane lists; profile stacks details under activity |
| Desktop | ≥1280px | 4-col stats; optional 3-col record (nav / main / details) |

Rules:

- No horizontal **page** scroll. Table overflow is allowed with a visible fade/cue and `aria` on the scroll region.
- Touch-first targets below `lg`.
- Modals: full-screen on mobile, centered max-width on laptop+.
- Calendar month grid must work at 320px (abbreviated weekdays).
- Client Leads, Messages/WhatsApp log, Client Profile: `hidden lg:flex` pane swap + Back, as today, but with 44px Back.

---

## 8. Layout patterns

### App shell

```
[ Sidebar 244px / 78px rail ] [ Topbar ]
                              [ Main ]
```

- Sidebar background `#F9FAFB`, 1px right hairline.
- Active item: `#E5E7EB` (or `primary-50`) rounded 8px row. Teal on icon/text only if needed — never a filled teal block (current `Sidebar.tsx`).
- Topbar: search + settings + notifications. No second brand lockup.
- Main: white, 16/24px padding.

### List / table page

Attio [Companies](https://mobbin.com/flows/39b96236-1b5d-4513-b583-20593af00f90):

- Title + ghost Sort / Filter + one primary CTA
- Full-bleed grid, thin row rules, type icon in headers
- Checkboxes for bulk
- Footer count
- Mobile: each row becomes a card (name, two meta lines, status pill)

### Record detail

Attio [company detail](https://mobbin.com/flows/723a0c99-c91a-486b-816b-9ebe1f2bd387):

- Breadcrumb `Client Database / {name}`
- Header: avatar, name, Progress Stage pill, actions (WhatsApp, not “messages”)
- Underline tabs (not filled teal chips)
- Left (or first column): identity + onboarding + **Preference Signals**
- Right / main: activity, not a seven-tab admin dump as the default

Desktop may add a details complementary pane. Laptop stacks it under the main column.

### Dashboard canvas

Attio [reports](https://mobbin.com/screens/ff2aaeab-9fa1-4b10-989e-147169c51741):

- Today first
- Then stat row (4 → 2 → 1)
- Then charts on white with thin grid and the cool series palette

---

## 9. Components

### Buttons

| Variant | Style | Use |
| --- | --- | --- |
| Primary | Teal fill, white text, 6px, 36–40px height | One per view: Add Client, Accept, Save, Message on WhatsApp |
| Secondary / outline | Hairline border, ink text, white fill | Export, Deprioritise, Cancel |
| Ghost | No border until hover (`sidebar` fill) | Sort, Filter, View settings |
| Icon | No border at rest; ring on focus | Settings, notifications, Back |

Do: `.btn-primary` stays teal. Don’t: drop shadow on resting primary. Don’t: 40px filled teal in the sidebar.

### Inputs

Height 36–40px, 6px radius, hairline border, white fill. Label above or `aria-label`. Error: danger border + text under the field (`aria-invalid`, `aria-describedby`).

### Pills and status

`.pill` at 6px radius. Status = dot + label + semantic pair. Progress Stage uses the info/warning/success set:

- New / Qualified — info
- Site Visit / Negotiation — warning
- Closed — success

### Tabs

Underline + semibold ink for active. Count badge in muted 12px. One pattern app-wide (Client Database stage tabs, profile tabs, Leads New / Deprioritised).

### Table

Hairline header row, no vertical rules, row hover `sidebar`. Selection checkbox 16px, 44px hit on touch.

### Stat metric

Title (muted 12–14px) + value (20–24px semibold, not 3xl) + optional trend pill (icon + percent + “vs last month”). Flat panel, not a heavy card.

### Sidebar item

Icon 18 + label 14 medium. Active gray pill. Collapsed rail: icon only + `title` + `aria-label`.

### Modal

White panel, 10px radius, pop shadow, Esc + labelled close. Full-screen &lt;640px. Primary bottom-right (or full-width on mobile).

### Empty state

Illustration + title + sentence + one primary CTA. See §3 and §10.

### Filtered empty

Title “Nothing matches” + “Clear filters” ghost button. Do not use the first-use illustration.

### Error

- Inline: danger text under the control
- Banner: icon + what failed + Retry / Go back, `role="alert"`
- Toast: short, dismissible; errors stay until dismissed

### Skeleton

Gray (`#E5E7EB`) bars that match the layout (stat row, table rows, Today list). No spinner-only page.

### Said | Doing

Two-column block. Left column header **Said** (stated onboarding). Right **Doing** (observed). Mismatch rows use the warning pair + one sentence.

### Returned badge

Warning pill: “Returned” + tooltip or subline with reason (“Viewed 3 more properties”).

### Undo toast

`role="status"`: “{Name} added to Client Database” + **Undo** (5s). Then disappear.

---

## 10. States by route

| Route | Empty (first use) | Filtered empty | Error | Loading |
| --- | --- | --- | --- | --- |
| Dashboard | “Nothing due today…” → Client Leads | n/a | Banner on metric fail | Skeleton Today + stats |
| Client Database | “Add your first client” | “No clients match” + Clear | Banner | Table skeleton |
| Client Leads | “You’re clear” + Deprioritised / Today | “No leads match” + Clear | Banner | List skeleton |
| Listed Properties | “No listings yet” | Existing copy + Clear | Banner | Card/table skeleton |
| Staff | “No staff yet” | “No staff match your search” | Banner | List skeleton |
| Calendar | “No upcoming events” + Add event | n/a | Banner | Month skeleton |
| WhatsApp log | “Message a client on WhatsApp” | “No sends match” | Banner | List skeleton |
| Client profile tabs | Per-tab Attio empty (notes, files, tasks) | n/a | Banner | Panel skeleton |
| Add Client | n/a | n/a | Inline on name/phone | Disable Save |
| 404 | “Page not found” + Go to Dashboard | n/a | n/a | n/a |

Today: most empties are a gray sentence; Help is a construction card; Add Client has no field errors; unknown routes redirect home; charts use `emptyLabel` only.

---

## 11. Flows A–F

Types live in `src/types.ts`. Mutations in `src/store/CrmContext.tsx`.

### Flow A — Lead triage

**Serves:** deal visibility. **Surface:** `src/pages/SmartLeads.tsx`.

**Keep:** two-pane layout; card signals so the broker can decide without opening the profile.

**Today:** Accept removes the lead and creates a client. Deprioritise sets `intent: "Low"` and leaves the lead in the list. Filter is dead. Search is name / location / BHK. No sort, no bulk, no undo, no resurfacing.

**Data**

```ts
type LeadStatus = "new" | "accepted" | "deprioritised";

// on Lead
status: LeadStatus;
deprioritisedAt?: string;          // ISO
viewedPropertiesAtDeprioritise?: number;
returnedReason?: string;
```

Deprioritise sets `status: "deprioritised"`, stores `viewedPropertiesAtDeprioritise`, and **removes the lead from the main list**.

**Resurface:** if `viewedProperties` increases after deprioritisation, set `status: "new"`, set `returnedReason` (e.g. “Viewed 2 more properties”), show **Returned** badge. Strongest case-study idea; keep the rule this small.

**UI**

- Tabs: **New** (count) | **Deprioritised** (count)
- Filter (wire the dead button): intent, deal type, source
- Search: name, location, BHK, budget, source, intent
- Sort: intent (High → Low), recency (`daysAgo` ascending)
- Bulk: checkboxes + Accept / Deprioritise
- Accept: prompt follow-up date in the same step (Flow D), then toast with **Undo** (5s) — restore lead, delete created client, delete the follow-up task

**Empty:** “You’re clear. Overnight leads will land here.” Links to Deprioritised and Today. **Filtered empty:** Clear filters.

**Responsive:** list-only on mobile; tap opens detail; Back returns to list.

### Flow B — Understanding the client

**Serves:** repeating requirements. **Surface:** `src/pages/ClientProfile.tsx`.

**Keep:** stated preferences on the left.

**Today:** right side is seven admin tabs. Observed behaviour is a timeline buried under tasks and property cards in Overview. No Said vs Doing. No mismatch. No timestamps (`onboarding` has no `updatedAt`).

**Data**

```ts
onboarding: {
  // existing fields
  updatedAt?: {
    budget?: string;
    preferredLocation?: string;
    // other fields as they change
  };
};

observed: {
  browsingBudget?: string;
  browsingLocations?: string[];
  viewedProperties?: number;
  lastActiveAt?: string;
};
```

**UI**

- **Preference Signals** directly under Client Onboarding Details (or first in Overview): two columns **Said** | **Doing**
- Mismatch one-liners (warning): “Browsing 40% above stated budget.” “Viewing in Bandra, said Andheri.”
- Field meta: “budget changed 2 weeks ago” next to the value
- Target tabs (underline): Overview (signals + activity), Notes, Appointments, Documents. Progress History / Log / Legal can stay secondary

This block is the visual onboard for “you no longer have to ask.”

### Flow C — Tracking deal progress

**Serves:** deal visibility.

**Today:** six stages exist (Inquiry, New, Qualified, Site Visit, Negotiation, Closed) but the Client Database table and tabs use Conversion Status. A client can be Completed + Inquiry. “Completed Client” and “Completed” duplicate. Inquiry and New overlap. Stage changes are manual only.

**Taxonomy (one)**

Progress Stage is the source of truth. Merge **Inquiry into New** in the UI (keep Inquiry in data only if needed for old records).

Derived Conversion Status (not independently editable):

| Progress Stage | Conversion Status |
| --- | --- |
| New, Qualified | Active Lead |
| Site Visit, Negotiation | Awaiting Action |
| Closed | Completed |

Drop “Completed Client” from the UI.

**UI**

- Client Database: **Progress Stage** column; tabs filter on stage (All, New, Qualified, Site Visit, Negotiation, Closed)
- Stage visible without opening the profile
- Profile: show derived status as read-only; edit stage only
- Auto-advance: booking an appointment → Site Visit (if current stage is before Site Visit)

### Flow D — Following up

**Serves:** disappearing follow-ups. **Does not exist today.** Overview “Latest Tasks” is local `useState` and resets on navigate. No due date, owner, reminder, or cross-client view.

**Data**

```ts
interface Task {
  id: string;
  clientId: string;
  text: string;
  dueDate: string; // ISO date
  done: boolean;
}
```

Store on `CrmContext` (persist with existing `localStorage`).

**UI**

- Dashboard **Today**: Overdue · Due today · Leads untouched 3+ days
- Accept lead → **Set follow-up** date in the same step (default +1 day). That closes challenge 4
- Client profile tasks read/write the same store
- First steps “Set a follow-up” completes on first save

**Empty Today:** see §3.

### Flow E — Adding a client

**Serves:** walk-ins, referrals, WhatsApp forwards. **Surface:** `src/components/modals/AddClientModal.tsx`.

**Today:** modal captures preferences, not identity. Saved name becomes `"{locality} {bedrooms} Client"`. Phone/email are placeholders. Price and Area sliders only set a maximum.

**Fields (order)**

1. Name (required)
2. Phone (required)
3. Email (optional)
4. Source: Referral | Walk-in | WhatsApp | Portal (required)
5. Existing preference fields

**Ranges:** true two-handle min/max, **or** rename labels to “Up to” and drop unused min. Do not leave “Price Range” when only max is set.

**A11y:** inline errors on name/phone; `aria-invalid`; focus first error on Save; Esc + trap; full-screen on mobile.

**Save** disabled until name, phone, source, and the existing required prefs are set.

### Flow F — Communication

**Serves:** requirements and follow-up, without a second inbox.

**Today:** in-app chat with seeded threads in `localStorage`. Brokers live in WhatsApp. A second inbox undercuts the tool-switching claim.

**MVP**

- Primary action: **Message on WhatsApp** → `https://wa.me/{digits}?text={encoded template}`
- Template includes client name + matched property lines (name, location, price)
- Log the send: `{ id, clientId, sentAt, preview }`
- `Messages.tsx` becomes the **send log**, not a chat client
- Sidebar label: **WhatsApp** (or keep Messages as the log — pick one and use it in First steps)

Optional: attach the log line to current Progress Stage or create a Task “Follow up after WhatsApp”.

Do not build compose, read receipts, or realtime chat.

---

## 12. Page mapping

| Route | Today | Target |
| --- | --- | --- |
| `/` Overview | Welcome + stats + charts | Today first; then stats; cool-palette charts |
| `/clients` | Conversion tabs + table | Progress Stage tabs + column; Attio table |
| `/clients/:id` | Card stack + seven tabs + colon rows | Record header; Said \| Doing; underline tabs; WhatsApp CTA |
| `/client-leads` | Two-pane; dead filter; deprioritise stays in list | New / Deprioritised; filter/sort/bulk; Returned; Accept + follow-up + Undo |
| `/listed-properties` | Cards + weak empty | Same job; Attio empty recipe; cool type chips |
| `/staff` | Search + cards | Table on desktop; cards on mobile |
| `/calendar` | Month + list | Fix “Calender”; empty + Add event |
| `/messages` | Chat inbox | WhatsApp send log |
| `/help` | Construction placeholder | First steps deep page (same six jobs) or redirect to sidebar widget |

Components to restyle later (do not invent parallels): `Sidebar`, `Topbar`, `StatCard`, `StatusBadge`, `SectionCard`, `PropertyCard`, `Avatar`, `PillDropdown`, `SelectDropdown`, `ChipSelect`, `RangeField`, `Snackbar`, charts, `AddClientModal`, `AddEventModal`.

---

## 13. Current vs target (chrome)

| Area | Current | Target |
| --- | --- | --- |
| Sidebar active | Solid teal + white text | Light gray rounded row |
| Hairline | `#F3F2F2` (warm) | `#E5E7EB` |
| Radius | 10px / `rounded-2xl` | 6–8px controls, 8–10px panels |
| Elevation | `shadow-card` on rest | Flat; `shadow-pop` on overlays |
| Section gap | 10px | 16–24px |
| Buttons | Heavy 40px + outline | Primary teal; ghost Sort/Filter |
| Tables | Card-wrapped | Full-bleed grid |
| Client profile | Colon `InfoRow` | Key-value, no colon |
| Charts | Earthy four-color | Cool analogous five-color |
| Messages | Chat | WhatsApp log |

---

## 14. Implementation order

Document first (this file). When building:

1. Tokens + a11y primitives (colors, focus ring, labels, skip link)
2. Onboarding chrome (First steps `n/6`, empty recipe, Today shell)
3. Flow D + A (tasks store, Today, triage status, Undo, follow-up on Accept)
4. Flow B + C (Said \| Doing, derived status, Database stage column)
5. Flow E + F (identity fields, WhatsApp button + log)
6. Page restyle to Attio chrome

Do not restyle a page before its flow data rules exist.

---

## 15. Do / don’t (quick)

**Do**

- One teal primary per view
- Gray pill for active nav
- Empty = illustration + title + sentence + CTA
- Status = color + text + dot
- Progress Stage as the only editable pipeline field

**Don’t**

- Fill the sidebar with teal
- Use earthy chart colors
- Ship a second chat inbox
- Leave Deprioritise in the main list
- Edit Conversion Status independently of stage
- Use placeholder copy as the only accessible name
- Launch a modal product tour
