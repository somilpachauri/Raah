# App UX Spec (mobile PWA, 360 to 767 px)

Prerequisite: `00_DESIGN_SYSTEM.md` (tokens, components, copy, build plan). This file only describes the **App shell and its screens**. Design for a 390 × 844 phone first. Test at 360 px wide.

---

## 1. Principles for this app

1. **The road first.** The map and the Road Strip are always one tap away. Nothing covers them for long.
2. **Verdict before detail.** Each screen opens with a decision ("Go with care"), then the reasons.
3. **One thumb.** Primary actions live in the lower half. No actions in the top corners except language.
4. **Works with bad signal.** Last data stays on screen with its age. Reports queue and send later.
5. **Hindi is not a translation afterthought.** Every screen is checked in Hindi.

---

## 2. Navigation

Bottom bar, 64 px, four items. Icon + label. Selected: River colour icon and label, River-tint pill behind the icon.

| Tab | Route | Icon (Lucide) | Purpose |
|---|---|---|---|
| Map | `/` | `map` | Live risk, stretch detail |
| Plan trip | `/plan` | `route` | Trip Planner (the hero feature) |
| Alerts | `/alerts` | `bell` | Active alerts, follow stretches |
| Report | `/report` | `camera` | Send a field report |

Top bar (56 px) on every tab: NHShield, screen title, language toggle `हिं | EN`. Settings and About are inside the language toggle's overflow (a `more` icon after it): Settings, My reports, About and data, Drive mode.

The **Plan trip** tab shows a small River dot badge when the user has a saved trip with a changed verdict.

First run (one screen only, no carousel): language choice as two large buttons, "हिंदी" and "English", then straight to the map. Ask for location and notifications only at the moment they are useful (Locate-me tap, Alert-me tap), with one sentence of reason.

---

## 3. Screens

### 3.1 Map (home) `/`

The first screen answers: "Is the road OK right now?"

```
┌────────────────────────────────┐
│ [NH 7] Rishikesh to Badrinath  │ top bar        हिं|EN  ⋯
│ 2 stretches need care today    │ status line (only when any High/Severe)
├────────────────────────────────┤
│                                │
│          MAP                   │
│    coloured NH-7 line          │
│    ◇  ▲  ●  towns  history     │
│                          [⌖]   │ locate me
│                          [▤]   │ layers: Map | Terrain
│                                │
├────────────────────────────────┤ ← BottomSheet, peek 168 px
│ ────                           │
│ Updated 10 min ago             │
│ Watch: Kaliasaur  ◇ High       │ worst stretch ahead of you, or overall
│ [ Plan a trip ]   [ Drive mode ]│
├────────────────────────────────┤
│  Map   Plan trip  Alerts Report│
└────────────────────────────────┘
```

**Map behaviour**

- Initial view fits the whole route (approximately 30.08, 78.27 to 30.74, 79.49). Pan is limited to a loose box around the road.
- Segments are coloured polylines with white casing (weights in the design system). Tap a segment: it highlights, the sheet moves to half height with the Segment detail (3.2).
- Towns appear as labelled dots when zoomed in.
- History events (small Ink dots with ring) are on by default. Pending field reports are not shown to the public until approved.
- If the user allows location and is within 2 km of NH-7: the peek sheet says "Watch: {next High/Severe stretch ahead}" using the direction of travel (from successive GPS points). If not near the road, it shows the worst stretch overall.
- The status line under the top bar appears only if any stretch is High or Severe. Tapping it opens the sheet at half height with "Stretches to watch".

**Sheet at half height: "Stretches to watch"**

A list (not cards) of stretches at level 1 or higher, worst first. Each row: risk shape, name, km range, short reason ("Heavy rain in the last 24 hours"), 48 px tall minimum. Below the list: the **vertical Road Strip** for the whole route (tap a block to select that stretch on the map).

**Sheet at full height:** the same list plus the legend: four shapes with words, and the disclaimer.

**States**

| State | What shows |
|---|---|
| Loading | Map renders, strip in grey skeleton blocks, sheet shows "Loading latest risk" |
| Stale (more than 30 min) | StatusLine in Moderate tint: "Data is 45 min old" |
| Offline | StatusLine in High tint: "You are offline. Showing data from 2:10 pm." Map tiles may be blank; the route line still draws from cached data |
| Error with no cache | Sheet: "Could not load risk data. Try again." with "Try again" button |
| All clear | Sheet: "No stretch is High or Severe right now." and the Plan trip button |

### 3.2 Segment detail (bottom sheet) 

Opens when a segment is tapped on the map or the strip.

```
┌────────────────────────────────┐
│ ────                           │
│ Kaliasaur to Rudraprayag       │ H2, Condensed
│ NH-7, km 112 to 121            │ Small, Granite
│                                │
│ ◇ High                         │ RiskBadge
│ Delay if you can               │ Verdict, 40/44
│                                │
│ Why this stretch is risky      │ H3
│ Heavy rain, last 24 hours  ▓▓▓▓▓▓▓▓░░
│ Steep slope above road     ▓▓▓▓▓▓░░░░
│ Landslides here before     ▓▓▓▓░░░░░░
│                                │
│ Rain                           │ H3
│  ▁▂▃▅▇█▆▃│▂▁            RainSpark
│ 64 mm in 24 h, 38 mm expected  │
│                                │
│ Last landslide here: Aug 2025  │
│                                │
│ [ Alert me about this stretch ]│ primary
│ [ Report a problem here ]      │ secondary
│                                │
│ Updated 10 min ago             │
│ This is an estimate from…      │ disclaimer, Small
└────────────────────────────────┘
```

Notes:

- "Why" shows only the top 3 factors, using `factors[].code` mapped to i18n strings.
- The 0 to 100 score is a small Granite line under the verdict: "Score 71 of 100." It is optional and only for the curious.
- "Alert me" opens the subscribe sheet (3.5). "Report a problem here" opens the report flow with the stretch and GPS prefilled.
- Close by dragging down, or tap outside.

### 3.3 Trip Planner `/plan` (the hero feature)

The judge should feel the value in five seconds. The DayStrip is the moment.

**Step 1: form**

```
┌────────────────────────────────┐
│ Plan your trip                 │ H1
│                                │
│ From            To             │
│ [Rishikesh ▾]  [Badrinath ▾]   │ two selects; type-ahead from /towns
│                                │
│ Travel date                    │
│ ┌──┬──┬──┬──┬──┬──┬──┐         │ DayStrip, 7 days from today
│ │Wed│Thu│Fri│Sat│Sun│Mon│Tue│  │
│ │ 8 │ 9 │10 │11 │12 │13 │14 │  │
│ │ ○ │ △ │ ◇ │ ◇ │ △ │ ○ │ ○ │  │ worst risk that day for the chosen route
│ └──┴──┴──┴──┴──┴──┴──┘         │
│                                │
│ [        Check my trip       ] │ primary, bottom
└────────────────────────────────┘
```

- The DayStrip loads as soon as From and To are set (7 parallel `/route-risk` calls). Day cells show skeleton until each returns.
- Defaults: From = Rishikesh, To = Badrinath, date = today. The user can tap "Check my trip" immediately.
- Swap button (`arrow-up-down`) between From and To. Selecting a To that is behind From flips the direction automatically.
- Dates beyond the forecast horizon (ask the backend how far) are disabled, with the reason shown as text: "Forecast not available".

**Step 2: result `/plan/result?from&to&date`**

```
┌────────────────────────────────┐
│ ‹  Rishikesh to Badrinath      │ back, 295 km
│    Friday 10 October           │
│                                │
│ △ Go with care                 │ Verdict, 40/44, with RiskBadge shape
│ 3 stretches need care.         │ Body
│ 1 of them is High risk.        │
│                                │
│ Lower risk on Monday  [View]   │ only if another day is lower; one line
│                                │
│ Along your route               │ H3
│ ● Rishikesh               0 km │
│ ┃                              │ vertical Road Strip, left rail
│ ┃  Shivpuri to Devprayag   ○   │ stretches at Low are collapsed into
│ ◇  Kaliasaur            112 km │ "n stretches, all Low"; stretches ≥ Moderate
│ ┃  High · Heavy rain           │ are expanded with reason
│ ● Rudraprayag           140 km │
│ ┃  Gauchar to Karnaprayag  △   │
│ ...                            │
│ ● Badrinath             295 km │
│                                │
│ [ Alert me on this trip ]      │ primary
│ [ Share on WhatsApp ]          │ secondary
│ This is an estimate from…      │
└────────────────────────────────┘
```

Rules:

- The headline verdict is the worst level on the route. Two lines under it translate it into counts. Do not show a percentage.
- "Lower risk on Monday" appears only when another day's worst level is lower. Tapping "View" switches the date and re-renders. Never suggest a day beyond the forecast horizon.
- Low stretches are grouped ("6 stretches, all Low") to keep the strip short. Tap to expand.
- Tapping a stretch opens Segment detail (3.2) in a sheet.
- **Share on WhatsApp** builds a text message and opens `https://wa.me/?text=…`. Example: "Rishikesh to Badrinath, Fri 10 Oct: Go with care. 1 stretch is High risk (Kaliasaur, km 112). Check live: {url}". Use the user's current language. Also offer an image share of the strip (P2).
- "Alert me on this trip" subscribes to every stretch on the route (3.5).
- Saved trips (P1): the last checked trip is stored locally and shown at the top of the form as a single row "Last checked: Rishikesh to Badrinath, Fri 10 Oct, Go with care" with "Check again".

### 3.4 Alerts `/alerts`

```
┌────────────────────────────────┐
│ Alerts                         │ H1
│ ┌ Active ┐ ┌ Following ┐       │ two-tab segmented control
│                                │
│ ◇ Kaliasaur to Rudraprayag     │ AlertRow
│   Heavy rain. Delay if you can.│
│   12 min ago                   │
│ ────────────────────────────── │
│ △ Chamoli bypass               │
│   Rain expected tonight        │
│   2 h ago                      │
└────────────────────────────────┘
```

- **Active** lists `/alerts` for stretches the user follows, plus any High or Severe alert on the whole route (marked "Not followed" with a quiet Follow button).
- **Following** shows a list of stretches/trips the user follows with toggles. Below it: "How should we alert you?" with two toggles, Push and SMS. Enabling SMS asks for a mobile number (one field, prefilled +91) and sends an OTP in the real build. In the demo, any 6 digits are accepted.
- Alert threshold control: "Alert me from" with Chips: Moderate, High, Severe (default High).
- Empty state: "No active alerts on NH-7." + "Choose stretches to follow".
- Tapping an alert opens Segment detail.

### 3.5 Subscribe sheet

Opens from "Alert me…" buttons. A bottom sheet at half height:

1. Title: "Follow this stretch" (or "Follow this trip").
2. Chip row: Push, SMS. At least one must be on.
3. Chip row: Alert me from Moderate / High / Severe.
4. Primary button: "Start alerts". Success: sheet closes, a toast at the bottom says "Alerts on for Kaliasaur to Rudraprayag." with "Undo".

### 3.6 Report `/report`

Three quick steps on one scrolling screen. The user should finish in under 30 seconds.

```
┌────────────────────────────────┐
│ Report a problem on the road   │ H1
│                                │
│ ┌────────────────────────────┐ │
│ │      [camera icon]         │ │ tap opens camera (input capture=environment)
│ │      Take a photo          │ │
│ └────────────────────────────┘ │
│                                │
│ Where                          │ H3
│ Near Kaliasaur, km 112         │ from GPS, matched to nearest stretch
│ [ Change on map ]              │ secondary, small
│                                │
│ What do you see?               │ H3
│ (Landslide or debris)          │ Chips, single select
│ (Falling rocks)                │
│ (Cracks or sinking road)       │
│ (Water on the road)            │
│ (Road blocked)                 │
│                                │
│ Add a note (optional)          │ one text line
│                                │
│ [          Send report       ] │ primary, disabled until photo + type
└────────────────────────────────┘
```

- Photo and type are required. Location is required but automatic; if GPS fails, "Change on map" opens a map picker and the field says "Pick the place on the map".
- Never ask the user to sign in. Reports are tied to a device id.
- **Safety line** under the title in Small Granite: "Do not stop on a slope to take a photo. Report from a safe place." (Hindi: "ढलान पर रुककर फ़ोटो न लें। सुरक्षित जगह से रिपोर्ट करें।")
- On send, online: button shows progress, then the confirmation screen: a short check-draw, "Report sent. An official will check it.", and two buttons "See my reports" and "Done".
- On send, offline: "Saved on this phone. It sends when you have signal." The report appears in My reports with status "Waiting to send".
- **My reports** (`/report/mine`, reachable from the `more` menu and the confirmation): rows with thumbnail, type, stretch, time, and a status chip: Waiting to send (Granite outline), Pending review (Granite), Approved (River fill, check), Rejected (Granite, with reason if the admin gave one). When approved: "Your report is now on the map."

### 3.7 Drive mode `/drive` (P1)

A full-screen, night-safe screen for drivers who want a glance, not a map. Dark theme by default. Entered from the Map sheet button or the `more` menu.

```
┌────────────────────────────────┐
│ Towards Badrinath       [⇄]    │ direction toggle (auto from GPS heading)
│                                │
│ Ahead                          │
│ Kaliasaur                      │ Drive 56 Condensed
│ ◇ High                         │
│ 12 km · about 25 min           │
│                                │
│ ─────────────────────────────  │
│ Then                           │
│ Rudraprayag bridge   △ Moderate│ Drive 28
│ 31 km                          │
│ Gauchar              ○ Low     │
│ 44 km                          │
│                                │
│ [🔊 Voice alerts: On]  [Exit]  │ 64 px buttons (speaker as Lucide icon)
└────────────────────────────────┘
```

- Shows only the next High/Severe stretch and the next two after it. If nothing ahead is above Low: "Clear ahead for the next 60 km."
- Voice alerts (Web Speech API `speechSynthesis`, `hi-IN` or `en-IN`): speaks once when a High/Severe stretch is 15 km ahead and again at 5 km. Sample: "Kaliasaur, 5 kilometres ahead. High risk. Drive slowly and watch for falling rocks." Always read the **shape word**, never colour.
- Keep the screen awake (`navigator.wakeLock`).
- No taps are needed while driving. The two buttons are for starting and stopping only.
- If GPS is unavailable: "Location is off. Pick where you are." with a stretch picker.

### 3.8 Settings and About (`more` menu)

- Language: हिंदी / English (large radio rows).
- Alerts: threshold, push, SMS, voice.
- Theme: Auto, Light, Night (P2).
- About and data: how the score works in four lines ("Rainfall, slope, soil wetness and past landslides"), data sources (as the team confirms them), the disclaimer, and "Contact: {team email}".

---

## 4. Key flows (the demo path)

**A. Plan a trip (open the demo with this)**
Open app → Plan trip → From Rishikesh, To Badrinath already set → DayStrip shows which days are risky → tap "Check my trip" → verdict "Go with care" → scroll the strip → tap the High stretch → read "Why" → "Share on WhatsApp".

**B. Risk responds to rain**
Open `/?demo=1` → demo panel → Heavy rain scenario → watch strip and map recolour → open Alerts and see the new alert.

**C. Report → official approves → map**
Report tab → photo, type → send → switch to the website admin → approve → the report appears on the map and in My reports as Approved.

**D. Driver glance**
`more` → Drive mode → show the "Ahead" screen with voice on.

---

## 5. Micro-interactions

| Moment | Behaviour |
|---|---|
| Strip first load | Draws left to right, 700 ms, once per session (see motion rules). |
| Segment tap | Line thickens and gets a White 3 px outer ring; the sheet rises to half. 200 ms. |
| Strip ↔ map sync | Selecting on the strip pans the map to fit the stretch, and the reverse. |
| Pull to refresh on Map | Refetches `/risk-map`, StatusLine shows "Updating". |
| Report sent | Check mark draws in 300 ms, no confetti. |
| Toasts | Bottom, above the nav, 4 s, Ink background, white text, one optional action. |

---

## 6. Screen build order (matches the build plan)

1. Map + sheet + Segment detail (Full day 1)
2. Trip Planner form + result (Full day 2)
3. Alerts + Subscribe sheet
4. Report + My reports
5. Hindi pass and states (Session 2)
6. Drive mode (Session 3)

## 7. Acceptance criteria

- A first-time user reaches a trip verdict in under 20 seconds with no typing.
- A report can be submitted in under 30 seconds, offline included.
- Every risk shown has shape + word + colour.
- App is usable at 360 px, in Hindi, with the network off.
- The strip, map and sheet stay in sync for every selection.
