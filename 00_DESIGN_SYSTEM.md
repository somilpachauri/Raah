# NH-7 Landslide Alert: Shared Design System

Read this file first, before `01_APP_UX.md` or `02_WEBSITE_UX.md`. Tokens, components, copy and the build plan live here once so the app and website never drift apart.

Working product name: **Raah** (राह, "path"). Placeholder. Change it in one place (`brand.ts`) if the team picks another.

---

## 1. Decisions already made (do not reopen)

| Decision | Why |
|---|---|
| **One codebase, two shells.** React + Vite + TypeScript. Below 768 px it renders the **App** shell (bottom nav, bottom sheets). At 1024 px and above it renders the **Website** shell (top nav, side panel, bottom strip). | We have about 24 working hours. Every component is built once and used twice. |
| **The App is an installable PWA.** Add to Home Screen gives a full-screen app with offline cache. | No app-store build, no native toolchain. Capacitor APK is a P2 extra only. |
| **Backend sends codes, not sentences.** Risk levels, reasons and advice arrive as stable codes. The UI owns all wording and all Hindi. | Hindi/English only works if the UI controls the text. |
| **Risk is a level (0 to 3) first, a score second.** | People act on "High", not on "71". The score appears only in detail views. |
| **Every risk is shown with colour, shape and word together.** | Colour-blind users, glare on mountain roads, grayscale screenshots. |

---

## 2. Who we are designing for

| Person | Situation | What the UI must do for them |
|---|---|---|
| **Driver** (taxi, bus, truck, pilgrim's own car) | One hand free, glare, patchy network, often night | Answer "what is ahead on my route?" in two seconds. Large type. Works offline from the last cache. |
| **Traveller / pilgrim** | At home or hotel, planning, often first time, many prefer Hindi | Answer "should I go on this date, and when is better?" Share the answer with family on WhatsApp. |
| **Official** (BRO, district disaster office, highway agency) | At a desk or in a field vehicle, many reports to clear | Clear the report queue fast. See which stretches are getting worse. |

The **one job** of the product: turn model output into a decision. Every screen ends in a verdict ("Go with care") and a next action, never a bare number.

---

## 3. Design intent

**Visual language: highway signage and survey drawings.** Indian National Highway milestones, BRO road signs, and the straight-line diagrams road engineers draw. Calm, legible, built for outdoors.

**The one memorable element: the Road Strip.** NH-7 drawn as a single straight line from Rishikesh to Badrinath, split into stretches, each coloured by risk, with towns as ticks. It is used in the map view, the trip planner, the drive mode and the admin overview. Spend design effort here. Keep everything else quiet.

**Deliberately avoided** (these read as generated UI):

- Cream backgrounds with a serif headline and a clay/terracotta accent.
- Near-black screens with a single neon accent.
- Rows of identical rounded cards with the same soft shadow.
- Gradients, glass blur, glow, emoji as icons.
- Small uppercase tracked labels above every heading.
- A big number with a gradient as the first thing on the page.
- Fade-up animation on every section, hover lift on every card.
- Arrows (`→`) on every button, and "Welcome back" greetings.

---

## 4. Tokens

Implement as CSS variables in `tokens.css`. Tailwind reads them through `tailwind.config.ts`. **Never hardcode a colour or font in a component.**

### 4.1 Colour

**Neutrals and brand**

| Token | Hex | Use |
|---|---|---|
| `--ink` Ink Slate | `#1B2A33` | Text, headings, map labels |
| `--granite` | `#4F5E66` | Secondary text, icons |
| `--mist` | `#CBD5DA` | Borders, dividers |
| `--glacier` | `#EDF1F3` | Page background, side panels |
| `--snow` | `#FAFBFC` | Sheets, panels, inputs |
| `--river` Alaknanda | `#1D5E6B` | Primary buttons, links, selected state. White text on it is 7.3:1. |
| `--river-tint` | `#DCEBEE` | Selected row, active chip background |
| `--milestone` | `#F7C600` | **Only** the NH shield and logo mark. Never a fill for UI surfaces or buttons. |

**Risk scale** (four levels, used for map lines, strip blocks, badges, markers)

| Level | Name | Hindi | Fill | Tint (backgrounds) | Shape | Text on fill |
|---|---|---|---|---|---|---|
| 0 | Low | कम | `#2E7D57` | `#E3F1EA` | Circle | White |
| 1 | Moderate | मध्यम | `#D49A00` | `#FAF0D2` | Triangle | Ink |
| 2 | High | ज़्यादा | `#C4470F` | `#F8E3D8` | Diamond | White |
| 3 | Severe | गंभीर | `#9B1C31` | `#F3DADF` | Octagon | White |

Rules:

- Shape and word always travel with the colour. A colour alone never carries meaning.
- Severe blocks on the strip get a diagonal hatch overlay (`repeating-linear-gradient(45deg, rgba(255,255,255,.45) 0 2px, transparent 2px 6px)`). This is the one allowed gradient, and it encodes information.
- Report status (Pending, Approved, Rejected) uses **neutral and river colours only**, never the risk colours, so status is never confused with risk.

**Night (Drive mode and optional app dark theme)**

| Token | Hex |
|---|---|
| `--bg` | `#0E181D` |
| `--surface` | `#16242B` |
| `--text` | `#E6EDF0` |
| `--muted` | `#9DB0B8` |
| `--line` | `#2B3D46` |
| Risk fills | Low `#4DB383`, Moderate `#F0B429`, High `#F2793F`, Severe `#F0647A` |

### 4.2 Type

Self-host with `@fontsource` so text renders on a patchy network and offline:
`@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-sans-condensed`, `@fontsource/ibm-plex-sans-devanagari`.

| Role | Family | Weights |
|---|---|---|
| Body, forms, long text | IBM Plex Sans (Devanagari glyphs from IBM Plex Sans Devanagari) | 400, 500, 600 |
| Headings, verdicts, town names, km markers, strip labels | IBM Plex Sans Condensed | 500, 600, 700 |

Condensed is the "road sign" voice. Plex was chosen because it carries Hindi and English in one family and fits the IBM hackathon.

| Style | Size / line | Family | Notes |
|---|---|---|---|
| Verdict | 40 / 44 | Condensed 700 | Only on the trip result and the segment sheet |
| H1 | 28 / 34 | Condensed 600 | Page title |
| H2 | 22 / 28 | Condensed 600 | Section title |
| H3 | 18 / 24 | Condensed 600 | List item title |
| Body | 16 / 24 | Sans 400 | Minimum body size on mobile is 16 |
| Small | 14 / 20 | Sans 400 | Metadata |
| Caption | 12 / 16 | Sans 500 | Strip tick labels only |
| Drive | 28 to 56 | Condensed 700 | Drive mode only |

Rules: sentence case everywhere, no letter-spacing, no all-caps labels. `font-variant-numeric: tabular-nums` on every number. Devanagari text gets `line-height + 0.1`. Body lines stay under 70 characters.

### 4.3 Space, shape, depth, motion

| Token | Values |
|---|---|
| Spacing (4 px grid) | 4, 8, 12, 16, 24, 32, 48 |
| Radius | 2 (strip blocks, tags) · 6 (inputs, buttons) · 10 (panels, popovers) · 16 (bottom sheet top corners) · 999 (chips) |
| Depth | Borders first. Only two shadows: `sheet: 0 -2px 12px rgba(27,42,51,.12)` and `popover: 0 4px 16px rgba(27,42,51,.16)`. |
| Touch target | 48 × 48 px minimum. Drive mode 64 px. |
| Icons | Lucide, stroke 1.75, 20 px. The four risk shapes are custom SVGs (`/icons/risk-*.svg`). |
| Focus | 2 px `--river` outline, 2 px offset, on every interactive element. |

**Motion (spend it in one place).**

1. **The strip draw.** On first load of the session, the Road Strip draws left to right and each stretch fills with its colour (700 ms, ease-out). Once per session.
2. **Responses to the user's action.** Sheet drag, selection highlight on map and strip, report-sent confirmation (a short check draw). 150 to 200 ms.
3. Nothing else animates. Honour `prefers-reduced-motion`: the strip appears instantly.

---

## 5. Core components

Build these first. Both shells use them.

| Component | Spec |
|---|---|
| **NHShield** | Milestone-yellow rounded badge, 1.5 px Ink border, "NH 7" in Condensed 700. Sizes 24 and 40. Header, strip start, share image. |
| **RiskBadge** | Risk shape (16 px) + level word. On the level's tint with Ink text. Props: `level`, `size`, `showAction` (swaps the word for the verdict, e.g. "Go with care"). |
| **RoadStrip** | The signature component. Props: `segments[]`, `towns[]`, `orientation` (`horizontal` \| `vertical`), `range` (dim everything outside the user's trip), `selectedId`, `youAreAt` (km), `onSelect`. Blocks are proportional to km, 2 px radius, 1 px gap. Horizontal block height 16 px (web) and 14 px (app); vertical rail 12 px wide. Town ticks with Condensed 12 px labels. Hover/tap shows name + RiskBadge. Severe blocks hatched. Keyboard focusable, arrow keys move between segments. |
| **MapLayer** | Leaflet. Each segment is a polyline with a 2 px white casing under it. Weights: Low 4, Moderate 5, High 7, Severe 8 (Severe also dashed casing). Towns as small Ink dots with labels (key towns only below zoom 10). History events as small Ink dots with white ring. Pending field reports as dashed-ring dots, verified as solid-ring. |
| **ReasonBars** | "Why this stretch is risky." Top 3 factors, each a one-line label with a thin horizontal bar in Granite on Mist. Bars are Granite, not risk-coloured, because they show contribution, not severity. |
| **RainSpark** | 72 h past + 24 h forecast rainfall as a thin bar series, "now" marked with a vertical Ink line. Caption: "64 mm in 24 h, 38 mm expected." |
| **StatusLine** | One line: "Updated 10 min ago." Turns Moderate-tint with "Data is 45 min old" after 30 min. Turns High-tint with "Showing old data from 2:10 pm" after 3 h or when offline. |
| **BottomSheet** | Three snap points: peek (about 168 px), half, full. Drag handle. 16 px top radius. |
| **DayStrip** | Seven day buttons, each with date and the worst-risk shape for that day beneath. The 5-second moment of the trip planner. |
| **AlertRow** | Risk shape, stretch name, one-line advice, time. Unread has a River left bar. |
| **ReportRow / ReportDetail** | Photo thumbnail, type, stretch, time, status chip. |
| **Button** | Primary: River fill, white text, 6 px radius, 48 px tall. Secondary: Snow fill, Mist border, Ink text. Destructive uses Ink outline, not red (red means risk). Label is the verb: "Check my trip", "Send report". |
| **Chip** | 999 radius, 40 px tall, Mist border. Selected: River-tint fill, River border and text. |

States every data component must have: **loading** (skeleton in Mist, strip shows grey blocks), **empty**, **error**, **stale**, **offline**.

---

## 6. Content and voice

- Plain verbs, sentence case, no exclamation marks, no emoji, no "Oops". Errors say what happened and what to do.
- Name things the way a driver would: "stretch", "road blocked", "falling rocks". Not "segment", "anomaly", "inference".
- An action keeps the same name through the whole flow: the button says "Send report", the confirmation says "Report sent".
- Never say "safe". The model gives an estimate, not a guarantee.

**Verdicts** (one per risk level, used on the trip result, segment sheet, alerts and WhatsApp share):

| Level | English | Hindi |
|---|---|---|
| 0 | Good to go | चल सकते हैं |
| 1 | Go with care | सावधानी से चलें |
| 2 | Delay if you can | हो सके तो टालें |
| 3 | Not advised | यात्रा की सलाह नहीं |

**Disclaimer** (footer of Trip result, segment sheet, About):
EN: "This is an estimate from rainfall and terrain. On the road, follow BRO and police instructions."
HI: "यह बारिश और भू-भाग के आधार पर लगाया गया अनुमान है। सड़क पर BRO और पुलिस के निर्देशों का पालन करें।"

**Strings (i18n keys).** Put these in `locales/en.json` and `locales/hi.json`. Have a Hindi speaker proofread before the demo.

| Key | English | Hindi |
|---|---|---|
| `nav.map` | Map | नक्शा |
| `nav.plan` | Plan trip | यात्रा योजना |
| `nav.alerts` | Alerts | अलर्ट |
| `nav.report` | Report | रिपोर्ट |
| `home.updated` | Updated {n} min ago | {n} मिनट पहले अपडेट हुआ |
| `home.watch` | {n} stretches need care today | आज {n} हिस्सों पर सावधानी ज़रूरी है |
| `home.clear` | No stretch is High or Severe right now | अभी कोई हिस्सा ज़्यादा या गंभीर जोखिम में नहीं है |
| `plan.title` | Plan your trip | अपनी यात्रा की योजना बनाएँ |
| `plan.from` | From | कहाँ से |
| `plan.to` | To | कहाँ तक |
| `plan.date` | Travel date | यात्रा की तारीख |
| `plan.cta` | Check my trip | मेरी यात्रा जाँचें |
| `plan.better` | Lower risk on {day} | {day} को जोखिम कम है |
| `plan.share` | Share on WhatsApp | WhatsApp पर भेजें |
| `why.title` | Why this stretch is risky | यह हिस्सा जोखिम भरा क्यों है |
| `factor.rain` | Heavy rain in the last 24 hours | पिछले 24 घंटों में भारी बारिश |
| `factor.wet` | Ground is already wet | ज़मीन पहले से गीली है |
| `factor.slope` | Steep slope above the road | सड़क के ऊपर तीखी ढलान |
| `factor.history` | Landslides here before | यहाँ पहले भी भूस्खलन हुए हैं |
| `alerts.subscribe` | Alert me about this stretch | इस हिस्से के लिए अलर्ट पाएँ |
| `alerts.empty` | No active alerts on NH-7. | NH-7 पर अभी कोई अलर्ट नहीं है। |
| `report.title` | Report a problem on the road | सड़क की समस्या बताएँ |
| `report.photo` | Take a photo | फ़ोटो लें |
| `report.what` | What do you see? | आप क्या देख रहे हैं? |
| `report.type.slide` | Landslide or debris | भूस्खलन या मलबा |
| `report.type.rockfall` | Falling rocks | पत्थर गिर रहे हैं |
| `report.type.crack` | Cracks or sinking road | सड़क में दरार या धँसाव |
| `report.type.water` | Water on the road | सड़क पर पानी |
| `report.type.blocked` | Road blocked | रास्ता बंद |
| `report.submit` | Send report | रिपोर्ट भेजें |
| `report.sent` | Report sent. An official will check it. | रिपोर्ट भेज दी गई है। अधिकारी इसकी जाँच करेंगे। |
| `report.queued` | Saved on this phone. It sends when you have signal. | फ़ोन में सहेजा गया है। नेटवर्क मिलते ही भेज दिया जाएगा। |
| `offline.banner` | You are offline. Showing data from {time}. | आप ऑफ़लाइन हैं। {time} तक का डेटा दिखा रहे हैं। |
| `error.load` | Could not load risk data. Showing the last update from {time}. | जोखिम का डेटा नहीं मिला। {time} का आख़िरी अपडेट दिखा रहे हैं। |

**Empty and error moments**

- Empty alerts: "No active alerts on NH-7." + secondary button "Choose stretches to follow".
- No reports yet: "You have not sent any reports." + "Report a problem".
- Location denied: "Location is off. Pick your stretch on the map instead."
- Report failed, online: "Report did not send. Check your connection and try again." (keeps the photo)

---

## 7. Accessibility and low-bandwidth rules

1. Contrast: body text 4.5:1 minimum. Check every risk fill with its text colour.
2. Colour, shape and word together, always (see section 4.1).
3. 48 px touch targets. Primary actions sit in the lower half of the screen.
4. Hindi/English toggle is always one tap from any screen (header, "हिं | EN").
5. Respect system font size. Layouts must not break at 130 percent.
6. Cache for offline: the last `/risk-map`, `/history`, the town list, app shell and fonts (service worker, stale-while-revalidate). Show the age of cached data with StatusLine.
7. Compress report photos on the device to about 1280 px, 300 KB before upload.
8. Report submissions queue locally (IndexedDB) with a client-generated `client_id` and retry when back online.
9. Map tiles: CARTO Positron for the default map (quiet, lets risk colours lead). Optional "Terrain" toggle to OpenTopoMap. Use a demo-safe fallback if tiles fail.
10. Screen-reader labels on every risk shape: "High risk, Kaliasaur to Rudraprayag, kilometre 112 to 121."

---

## 8. What the UI needs from the API (send this to the backend teammate today)

The brief lists 7 endpoints. The UI works with them, with these field requirements. Items marked **ask** are missing from the brief.

```jsonc
// GET /risk-map
{
  "updated_at": "2026-10-07T09:40:00+05:30",
  "segments": [{
    "id": "seg-017",
    "name": "Kaliasaur to Rudraprayag",
    "km_start": 112, "km_end": 121,            // km from Rishikesh
    "level": 2,                                  // 0 low, 1 moderate, 2 high, 3 severe
    "score": 71,                                 // 0 to 100, detail view only
    "top_reason": "rain_24h",                    // code, UI writes the sentence
    "factors": [ { "code": "rain_24h", "weight": 0.8 },
                 { "code": "slope",    "weight": 0.6 },
                 { "code": "history",  "weight": 0.4 } ],
    "rain": { "last_24h_mm": 64, "next_24h_mm": 38 },
    "geometry": { "type": "LineString", "coordinates": [[78.77, 30.20], ...] }  // [lng, lat]
  }]
}

// GET /route-risk?from=rishikesh&to=badrinath&date=2026-10-09
{
  "from": "rishikesh", "to": "badrinath", "date": "2026-10-09",
  "level": 1,                                    // worst level on the route
  "segments": [ { "id": "seg-017", "level": 2 }, ... ]
}
// The app calls this 7 times in parallel (one per day) to fill the DayStrip. No new endpoint needed.

// GET /alerts
[{ "id": "al-91", "segment_id": "seg-017", "level": 2, "code": "heavy_rain",
   "created_at": "...", "expires_at": "..." }]

// GET /history
[{ "id": "ev-12", "lat": 30.28, "lng": 78.80, "date": "2025-08-14",
   "type": "landslide", "segment_id": "seg-017" }]

// POST /field-report   (multipart)
// photo, lat, lng, type (slide|rockfall|crack|water|blocked), note, client_id, language
```

**Ask the backend for these (all small):**

| Ask | Why the UI needs it | Priority |
|---|---|---|
| `GET /towns` returns `[{id, name_en, name_hi, km, lat, lng}]` | Town ticks on the strip and the From/To pickers | P0 |
| `GET /admin/reports?status=pending` | The brief has validate but no list. The admin queue cannot exist without it. | P0 |
| Report objects include `photo_url`, `lat`, `lng`, `type`, `note`, `created_at`, `status`, `segment_id`, `model_level_at_report`, `reporter_verified_count` | Admin compares what the model said with what a person saw | P0 |
| Optional `?simulate_rain_mm=` on `/risk-map` and `/route-risk` | Demo: a rainfall slider that visibly changes the map | P1 |
| Optional `?date=` on `/risk-map` | "Now / Tomorrow / Day 3" scrubber on the website | P1 |
| `GET /segments/{id}/rain` returns 72 h past + 24 h forecast hourly | RainSpark | P1 |
| `GET /admin/analytics` | Admin charts | P2 |

If the backend is late, `mocks/` serves the same shapes. Build against mocks from the first hour.

---

## 9. Tech and structure

**Stack.** React + Vite + TypeScript, Tailwind (tokens via CSS variables), React Router, TanStack Query, react-leaflet, Recharts (admin only), react-i18next, vite-plugin-pwa, idb-keyval (offline queue). No UI kit.

```
src/
  api/          client.ts, types.ts, mocks/ (one JSON per endpoint + scenarios)
  design/       tokens.css, brand.ts, icons/
  components/   NHShield, RiskBadge, RoadStrip, MapLayer, ReasonBars, RainSpark,
                StatusLine, BottomSheet, DayStrip, AlertRow, Button, Chip, ...
  shells/       AppShell.tsx (<768), WebShell.tsx (>=1024)
  screens/      Map, Plan, PlanResult, Alerts, Report, Drive, History, About,
                admin/ (Login, Reports, ReportDetail, Overview, Analytics)
  locales/      en.json, hi.json
```

API base URL comes from `VITE_API_URL`. Setting `VITE_USE_MOCKS=true` serves the local mocks. Add `?demo=1` to any URL to show the demo panel (scenario buttons: Dry day, Heavy rain, Road blocked; plus a rainfall slider that calls `simulate_rain_mm`, or swaps mock files if the backend has not shipped it). The demo panel carries a persistent "Simulation" chip so it is never mistaken for live data.

---

## 10. Build plan

Assumes two full days, then four 2-hour sessions. **P0** must exist for the demo, **P1** makes it impressive, **P2** only if time is left.

| Slot | Work | Priority |
|---|---|---|
| **Full day 1** (about 8 h) | Scaffold, tokens, fonts, i18n, PWA (1 h). API client and mocks for all endpoints (1 h). NHShield, RiskBadge, StatusLine, BottomSheet, Button, Chip (1.5 h). Map with coloured segments, towns, history, locate-me (2 h). RoadStrip horizontal + vertical, synced with map (1.5 h). Segment sheet with ReasonBars and RainSpark (1 h). | P0 |
| **Full day 2** (about 8 h) | Trip Planner: form, DayStrip, result with vertical strip, verdict, WhatsApp share (3.5 h). Alerts list and subscribe (1 h). Report flow: camera, GPS, chips, offline queue, my reports (2 h). Website shell from the same components (1.5 h). | P0 |
| **Session 1** (2 h) | Admin: login (mock), reports queue, report detail, approve/reject. | P0 |
| **Session 2** (2 h) | Full Hindi pass. Stale, offline and error states. History page. | P0 / P1 |
| **Session 3** (2 h) | Swap mocks for the real API and fix shape mismatches (1 h). Drive mode (1 h). | P0 / P1 |
| **Session 4** (2 h) | Demo panel, strip-draw moment, polish, screenshots, backup video, rehearsal. | P0 |

**Cut list, in this order, if time runs short:** admin analytics, admin overview, terrain layer, dark theme, Drive mode, History charts, Capacitor APK.

**Never cut:** map + strip, Trip Planner, report flow + admin approval, Hindi/English, stale/offline states.

---

## 11. Working with the AI agents in Antigravity

- **Opus 4.6 thinking:** scaffold and architecture, RoadStrip, offline queue, API client with mock switching.
- **Gemini 3.1 Pro:** screens, one at a time, from the screen specs in the App and Website files.
- **Gemini Flash:** i18n strings, mock JSON, small CSS fixes, renaming.

**Standing instruction to paste at the start of every agent session:**

> Read `00_DESIGN_SYSTEM.md` and the screen spec I name. Use only tokens from `tokens.css`. Never hardcode a colour, radius or font. Every risk display uses RiskBadge or the risk-shape icons, never colour alone. All user-facing text goes through i18n keys with Hindi. Do not add gradients, shadows beyond the two defined, emoji, or decorative animation. Build only the screen I name, then stop.

**Prompt order that works:**

1. "Scaffold the project per section 9. Create tokens.css from section 4, fonts, i18n, router, PWA. Stop."
2. "Build `api/` with types from section 8 and mocks for every endpoint, three scenarios (dry, heavy-rain, blocked). Stop."
3. "Build NHShield, RiskBadge, StatusLine, BottomSheet, Button, Chip per section 5. Add a `/kitchen-sink` route showing all states."
4. "Build RoadStrip (horizontal and vertical) and MapLayer per section 5. Selecting on either highlights the other."
5. Then one screen per prompt, in the order of the build plan.

---

## 12. Review checklist (run before every commit and before the demo)

- [ ] Squint test: can you read the risk on the map and strip in grayscale? (shape + hatch must carry it)
- [ ] No colour, radius or font hardcoded outside tokens.
- [ ] No gradients except the Severe hatch. No glow, no blur.
- [ ] No identical card grids. Lists are rows with dividers.
- [ ] No uppercase labels, no letter-spacing, no emoji.
- [ ] Every number has a unit and a time ("64 mm in 24 h").
- [ ] Every screen shows how fresh its data is.
- [ ] Switch to Hindi: nothing overflows, nothing left in English.
- [ ] Turn off the network: map, strip and last data still show; report queues.
- [ ] 390 px phone and 1440 px laptop both checked.
- [ ] The disclaimer is visible on Trip result and segment sheet.
