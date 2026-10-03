# Website UX Spec (desktop 1024 px and up, plus Admin)

Prerequisite: `00_DESIGN_SYSTEM.md`. The website reuses every component from the app. Only the **shell and layouts** differ. Design for a 1440 × 900 laptop first, check 1280 and 1024.

The website has two halves:

1. **Public site**: live map, trip planner, past events, how it works. For travellers planning on a laptop, journalists, and judges.
2. **Admin** (`/admin`): for officials (BRO, district disaster office, highway agency). Review field reports, watch stretches that are getting worse, see analytics.

---

## 1. Principles

1. **Public site is the app on a bigger canvas.** Same map, same strip, same wording. Do not invent a second visual style.
2. **Admin is a work tool.** Dense, calm, keyboard friendly. Tables and split panes, not dashboards full of stat tiles.
3. **Show the model and the human side by side.** The admin's best moment is "the model said Moderate, a driver says the road is blocked."
4. **Everything lights up from one strip.** The Road Strip runs across the bottom of the live map and the top of the admin overview.

---

## 2. Website shell

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [NH 7] Raah    Live map   Plan trip   Past events   How it works         │ 64 px
│                                           हिं | EN     Officials sign in  │
├──────────────────────────────────────────────────────────────────────────┤
│ (optional banner) High risk on 2 stretches today.  See stretches          │ 40 px, Moderate/High tint
└──────────────────────────────────────────────────────────────────────────┘
```

- Header is white (Snow) with a 1 px Mist bottom border. Active nav item: Ink text, 2 px River underline. No hover animation beyond colour change.
- "Officials sign in" is a quiet text link at the far right, not a button.
- Footer (small, on public pages except the map): disclaimer, data sources, contact, "Built for the IBM x Jigyasa hackathon."
- Max content width 1200 px for text pages. The map page is full bleed.

---

## 3. Public pages

### 3.1 Live map `/`

The landing page **is** the product. No marketing hero. The first thing a visitor sees is the live road.

```
┌─ header ─────────────────────────────────────────────────────────────────┐
├─ banner (only when High/Severe exists) ──────────────────────────────────┤
│ Side panel 360 px      │                                                 │
│ ┌────────────────────┐ │                 MAP (Leaflet)                   │
│ │ Find a stretch     │ │            coloured NH-7 line                   │
│ │ [ search town    ] │ │                                    [+][-]       │
│ ├────────────────────┤ │                                    [⌖] [▤]      │
│ │ Stretches to watch │ │                                                 │
│ │ ◇ Kaliasaur  km112 │ │                                                 │
│ │   Heavy rain       │ │                                                 │
│ │ ────────────────── │ │                                                 │
│ │ ◇ Chhinka    km…   │ │                                                 │
│ │ △ Chamoli bypass   │ │                                                 │
│ │ ────────────────── │ │                                                 │
│ │ Legend + updated   │ │                                                 │
│ └────────────────────┘ │                                                 │
├────────────────────────┴─────────────────────────────────────────────────┤
│ Rishikesh ─▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌── Badrinath │ Road Strip, 120 px
│ Devprayag    Srinagar    Rudraprayag   Karnaprayag    Chamoli  Joshimath │
│ Now · Tomorrow · Day 3 · Day 4 · Day 5 · Day 6 · Day 7                   │ day scrubber (P1)
└──────────────────────────────────────────────────────────────────────────┘
```

**Behaviour**

- The Road Strip (horizontal) spans the full width under the map. It is the page's one memorable element. It draws in once on load.
- Hover a strip block: the matching stretch highlights on the map and a tooltip shows name + RiskBadge. Click: the side panel switches to Segment detail (same content as the app sheet 3.2) and the map pans to fit.
- **Day scrubber (P1, needs `?date=` on `/risk-map`):** choosing "Tomorrow" recolours the map and the strip for that day. This visibly proves the risk is dynamic. Until the backend supports it, hide the scrubber.
- The side panel list is the same "Stretches to watch" list as the app, sorted worst first. Clicking a row selects it on map and strip. If nothing is above Low: "No stretch is High or Severe right now."
- Panel footer holds the legend (four shapes with words) and StatusLine.
- Keyboard: Tab through strip blocks; arrow keys move selection; Enter opens detail; Escape closes it.
- Map controls: zoom, locate (browser location), Map | Terrain toggle.

**Segment detail in the side panel** replaces the list, with a "‹ All stretches" back link at the top. Content: name and km, RiskBadge, verdict, "Why this stretch is risky" (ReasonBars), Rain (RainSpark), last landslide, buttons "Alert me about this stretch" (opens the subscribe dialog) and "Open in Plan trip" (prefills the planner with this stretch's nearest towns), updated time, disclaimer.

**Subscribe dialog:** centred modal, 440 px, 10 px radius. Mobile number field (+91), Push/SMS removed on web (SMS only, plus email as P2), threshold chips, "Start alerts". Close on Escape.

### 3.2 Plan trip `/plan`

Two columns. The left column is the form; the right column is the answer. The week outlook is the desktop's hero moment.

```
┌───────────────────────┬──────────────────────────────────────────────────┐
│ Plan your trip        │ Rishikesh to Badrinath · Friday 10 October       │
│                       │                                                  │
│ From  [Rishikesh ▾]   │ △ Go with care                                   │ Verdict
│ To    [Badrinath  ▾]  │ 3 stretches need care. 1 is High risk.           │
│ Date  [Fri 10 Oct ▾]  │ Lower risk on Monday.  [View Monday]             │
│                       │                                                  │
│ [ Check my trip ]     │ Week outlook                                     │ H2
│                       │            Wed Thu Fri Sat Sun Mon Tue          │
│ Last checked          │ Rishikesh–Devprayag  ○   ○   ○   ○   ○   ○   ○   │
│ Rishikesh–Badrinath   │ Devprayag–Srinagar   ○   △   △   ○   ○   ○   ○   │
│ Fri 10 Oct            │ Srinagar–Rudraprayag ○   △   ◇   ◇   △   ○   ○   │
│                       │ Rudraprayag–Karnap.  ○   ○   △   △   ○   ○   ○   │
│                       │ Karnaprayag–Chamoli  ○   ○   ○   ○   ○   ○   ○   │
│                       │ Chamoli–Joshimath    ○   △   △   ○   ○   ○   ○   │
│                       │ Joshimath–Badrinath  ○   ○   ◇   △   ○   ○   ○   │
│                       │                                                  │
│                       │ Along your route (horizontal Road Strip)         │
│                       │ ▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌ │
│                       │                                                  │
│                       │ [ Alert me on this trip ] [ Share on WhatsApp ]  │
│                       │ [ Copy link ]  [ Print ]                         │
└───────────────────────┴──────────────────────────────────────────────────┘
```

- **Week outlook** is a table where each cell shows the risk shape, tinted with the level's tint, with the level word available to screen readers and on hover. Rows are legs between major towns (7 to 10 rows). Columns are the next 7 days. The selected date column has a River outline. Clicking a column changes the date. Clicking a row highlights that leg on the strip.
- Built from the same 7 parallel `/route-risk` calls as the app, grouped by leg.
- Print stylesheet: Verdict, week outlook, strip, disclaimer, URL. Shapes make it readable in black and white.
- Use cell borders (1 px Mist) and no zebra stripes. The tints and shapes are the only decoration.

### 3.3 Past events `/history`

Answers "does this road really slide?" and makes the live map feel grounded.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Past landslide events on NH-7                                            │ H1
│ Year  [2015 ──●────────●── 2026]   Type (All ▾)   Stretch (All ▾)        │ filters
├──────────────────────────────────────┬───────────────────────────────────┤
│                                      │ 148 events shown                  │
│               MAP                    │                                   │
│        history dots, clustered       │ Events by month                   │ Recharts bar
│                                      │  Jan ▁  …  Jul ▇  Aug █  Sep ▆    │
│                                      │                                   │
│                                      │ Events by stretch (top 8)         │ horizontal bars
│                                      │ Kaliasaur ▇▇▇▇▇▇▇▇ 21             │
└──────────────────────────────────────┴───────────────────────────────────┘
```

- Clusters use Ink circles with count in Condensed. Click a dot: popover with date, type, stretch, "Source: {source}". No photos unless available.
- The month chart is the story: events peak in monsoon months. Caption in plain words: "Most events happen between July and September." Only write this caption if the data supports it.
- Bars are Granite. Risk colours are never used here, because these are counts, not risk.

### 3.4 How it works `/about`

One readable page, max width 720 px, serif-free, left aligned.

1. **What this shows** (3 sentences).
2. **How the risk is worked out**: a single horizontal diagram: Terrain and past landslides + Rainfall now and forecast → Risk for each stretch → Alerts and trip checks. Drawn with plain boxes and lines in Ink on Glacier. No stock illustrations.
3. **The four levels**: table with shape, word, verdict, and what to do.
4. **Reports make it better**: one paragraph and a three-step line: "A driver sends a photo. An official checks it. The model learns from it."
5. **Limits**: the disclaimer, in full, with "Follow BRO and police instructions."
6. **Data sources** and team contact.

---

## 4. Admin `/admin`

Separate shell: a 56 px top bar in Ink with white text, no marketing links. Left: NHShield + "Officials". Centre tabs: Reports (with a count of pending), Overview, Analytics. Right: signed-in name and Sign out.

Admin uses the same tokens, but the page background is Glacier and panels are Snow with Mist borders, 10 px radius.

### 4.1 Sign in `/admin/login`

Single centred panel (400 px): NHShield, "Officials sign in", Email, Password, "Sign in". Error text: "Email or password is not right." For the hackathon: one hardcoded demo account shown in the footer of the panel only when `?demo=1` ("Demo login: official@raah.demo / demo1234").

### 4.2 Reports `/admin/reports` (P0, the BRO feature)

Split view: list on the left (440 px), detail on the right.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Reports   Pending 7 · Approved 42 · Rejected 5                             │
│ [Pending ▾] [Type ▾] [Stretch ▾] [Last 24 h ▾]      Sort: Newest ▾         │
├───────────────────────────────┬────────────────────────────────────────────┤
│ ▣ Road blocked                │  ┌──────────────────────┐  ┌────────────┐  │
│   Chhinka, km 168    2 min    │  │                      │  │  mini map  │  │
│   Model: Moderate             │  │      PHOTO (large)   │  │  pin +     │  │
│ ────────────────────────────  │  │                      │  │  stretch   │  │
│ ▣ Falling rocks               │  └──────────────────────┘  └────────────┘  │
│   Kaliasaur, km 112  14 min   │                                            │
│   Model: High                 │  Road blocked                              │
│ ────────────────────────────  │  Chhinka, km 168 · 14:02 · Phone ••• 4821  │
│ ▣ Water on the road           │  "Debris across both lanes, trucks stuck"  │
│   …                           │                                            │
│                               │  What the model said    What the driver says│
│                               │  ▲ Moderate             Road blocked        │
│                               │  This differs. Look closely.               │
│                               │                                            │
│                               │  This reporter: 3 earlier reports approved │
│                               │  Nearby: 1 other report in the last hour   │
│                               │                                            │
│                               │  [ Reject ▾ ]            [ Approve ]       │
│                               │  A approve · R reject · J/K next/previous  │
└───────────────────────────────┴────────────────────────────────────────────┘
```

**List row:** 72 px, thumbnail 48 px square (2 px radius), type, stretch + km, relative time, and the model level at that moment as a small RiskBadge. Selected row: River-tint background and a 3 px River left bar. Status chip appears only outside the Pending filter.

**Detail panel**

- Photo is the biggest element (about 60 percent of the pane width). Click opens it full screen.
- A **comparison line** is the key insight: "What the model said" (RiskBadge) beside "What the driver says" (type). When the report is more severe than the model (for example Road blocked vs Moderate), show a one-line note in Moderate tint: "This differs from the model. Look closely." This is shown whenever `type` is `blocked` or `slide` and `model_level_at_report` is below 2.
- Trust line: "This reporter: {n} earlier reports approved." and "Nearby: {n} other reports in the last hour." Both come from the report object (`reporter_verified_count`, plus a client-side count of nearby reports from the list).
- **Approve**: primary River button. Toast: "Report approved. It is now on the public map." and, only if the backend really uses it, a second line "It will be used to improve the risk model." Next report auto-selects.
- **Reject**: secondary button with a menu of reasons (chips in a popover): "Not on NH-7", "Photo unclear", "Duplicate", "Not a road problem", "Other". Toast: "Report rejected." Next report auto-selects.
- Both actions call `POST /admin/validate-report`. Undo in the toast for 5 seconds.
- Keyboard: `A` approve, `R` opens reject reasons, `J`/`K` next/previous, `Enter` opens the photo.

**States:** Empty pending: "No reports are waiting." Loading: row skeletons. Error: "Could not load reports. Try again." Photo failed to load: grey panel with "Photo not available."

### 4.3 Overview `/admin/overview` (P2)

For the official who opens the page in the morning.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Today on NH-7                                                              │ H1
│ 3 stretches are High or Severe · 7 reports are waiting · 126 alerts sent   │ one sentence, not tiles
├────────────────────────────────────────────────────────────────────────────┤
│ Rishikesh ─▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌── Badrinath          │ Road Strip
├──────────────────────────────────────────┬─────────────────────────────────┤
│ Stretches that need attention            │ Reports waiting                 │
│ Stretch          Level   Trend  Reason   │ ▣ Road blocked · Chhinka · 2 m  │
│ Kaliasaur        ◇ High  ↑      Rain     │ ▣ Falling rocks · Kaliasaur … │
│ Chhinka          △ Mod.  ↑      Rain     │ ▣ …                             │
│ Pagal Nala       ◇ High  →      History  │ [Open reports]                  │
└──────────────────────────────────────────┴─────────────────────────────────┘
```

- "Trend" compares the level now with 6 hours ago (needs history from the backend; hide the column if not available). Use `arrow-up-right`, `arrow-right`, `arrow-down-right` Lucide icons, Granite colour, with words for screen readers.
- Table rows are clickable and open the stretch in the live map in a new tab.
- Stretch and place names in the screenshots are sample data. Use real names from the backend.

### 4.4 Analytics `/admin/analytics` (P2)

Three charts only, stacked in a single column at 960 px max width. Each has a one-line plain-language title and a caption that says what the official should notice. Use Recharts with Granite and River only (no risk colours, since these are counts).

1. **Reports per day**, stacked Approved / Rejected / Pending (River, Granite, Mist).
2. **Hours at High or Severe, by stretch, last 30 days**: horizontal bars, top 8 stretches.
3. **Alerts sent and followers by stretch**: a two-column table with inline bars, not a chart.

If the data is seeded for the demo, show a small "Demo data" chip beside the page title. Never present seeded numbers as real.

---

## 5. Responsive behaviour

| Width | Behaviour |
|---|---|
| 1280 and up | As drawn. Side panel 360 px. |
| 1024 to 1279 | Side panel 320 px. Week outlook leg names abbreviated to the first town of the leg. |
| 768 to 1023 | Shows the **App shell** (bottom nav, sheets). Admin shows a notice: "Use a laptop for the reports queue." with a simplified single-column list as a fallback (P2). |
| Below 768 | App shell. |

---

## 6. Build order for the website (after the app is working)

1. Shell: header, banner, side panel layout, footer (Full day 2, 1.5 h)
2. Live map page: map + panel + horizontal strip (reuses app components)
3. Plan trip page with the Week outlook table
4. Admin Reports queue and detail (Session 1)
5. History page (Session 2)
6. About page (30 min, any session)
7. Admin Overview and Analytics (P2)

## 7. Acceptance criteria

- Visitor sees the live map and the strip in the first screen with no scrolling and no sign-in.
- Hovering the strip highlights the stretch on the map within 100 ms, and the reverse.
- Admin can clear 10 pending reports using only the keyboard.
- The comparison line ("model said / driver says") appears on every report in the detail pane.
- Week outlook is readable in grayscale print.
- English and Hindi both fit without overflow at 1280 px.
