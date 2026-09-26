# USMG6-120: Calendar & Dashboard UI/UX Design Specification & Handoff Package
**Team Member:** Member 2 (UI/UX Designer)  
**Role:** Primary UI/UX Owner for Resource, Calendar, and Dashboard  
**Target Recipient:** Member 1 (Frontend Implementation & Integration)  
**Status:** Approved & Ready for Implementation  
**Design System Palette:** Primary `#1E40AF` | Secondary `#0F766E` | Tertiary `#3B82F6` | Neutral `#64748B` | Typography: `Inter`

---

## 1. Overview & Objectives

The goal of **USMG6-120** is to specify the design system, information architecture, component layouts, and interactive behaviors for:
1. **The Shared Reservation Calendar:** An interactive timeline and calendar view allowing users and managers to view reservations by resource and facility across Day, Week, and Month scopes.
2. **The Executive Management Dashboard:** A high-level control and operational visibility center providing real-time KPI metrics, resource utilization breakdown, usage trends, and an actionable upcoming reservation agenda.

---

## 2. Reservation Calendar Experience Specification (`/calendars`)

### 2.1 Calendar Header & Navigation Controls
- **Date Navigation Cluster:**
  - Left / Right chevron buttons (`<` and `>`) for navigating backward/forward in time.
  - "Today" button: Instantly repositions view cursor to the current day.
  - Active Date Label: Large typographic header (`h2`, font-weight 700) displaying e.g., "September 2026" (Month View) or "Sep 21 – Sep 27, 2026" (Week View).
- **View Scope Switcher:**
  - Segmented pill toggle: `Month` vs. `Week`.
  - Active tab is filled in `#1E40AF` with crisp white text; inactive tab is transparent slate `#64748B`.

### 2.2 Facility & Resource Filter Bar (USMG6-56)
- **Facility Selector:** Dropdown displaying all university facilities with associated building icons. Default: `All Facilities`.
- **Cascading Resource Selector:** Dropdown dynamically populated with resources located in the chosen facility. Default: `All Resources`.
- **Quick Status Filter:** Toggle chips allowing users to show/hide `CONFIRMED`, `PENDING_APPROVAL`, or `COMPLETED` events.
- **Dynamic Legend:** Visual color indicators explaining badge colors directly below filter controls:
  - Green dot (`#22C55E`): Confirmed Booking
  - Amber dot (`#F59E0B`): Pending Manager Approval
  - Neutral dot (`#94A3B8`): Completed Booking

### 2.3 Calendar Grid & Event Visualization
- **Month View Grid:**
  - 7-column layout (Sunday to Saturday or Monday to Sunday).
  - Out-of-month days rendered in muted slate (`#94A3B8`, opacity 0.5).
  - Current day highlighted with a subtle primary blue circular badge on the date number.
  - Daily cells display max 3 event chips, with a "+X more" counter that expands on click.
- **Event Chips / Blocks:**
  - Truncated single-line badge displaying `[Start Time] [Resource Name] — [User / Purpose]`.
  - Color-coded left border (3px) matching the reservation status.
  - Hover effect: Scale transition with tooltip revealing start/end time, organizer, and capacity.
  - Click interaction: Opens `ReservationDetailModal` with complete details.

### 2.4 Empty, Loading, and Error States for Calendar
- **Loading State:** Centered pulsing circular loader with text: "Syncing reservation schedule...".
- **Empty State:** When no reservations exist for the selected facility/month, display clean calendar grid with subtle empty notification: "No reservations scheduled for this period."
- **Invalid Filter Handling:** If a facility has 0 resources, the resource selector displays "No resources in facility" and defaults to All.

---

## 3. Executive Management Dashboard Specification (`/dashboard` or `/`)

### 3.1 Welcome Banner
- **Visuals:** Full-width gradient card (`linear-gradient(135deg, #1E40AF 0%, #1e3a8a 50%, #0F766E 100%)`).
- **Typography:** Greeting with user's first name, current role badge, and department name.
- **Action Buttons:** Quick shortcut buttons:
  - `+ New Reservation` (Primary teal)
  - `Search Availability` (Secondary white outline)
  - `Review Approvals` (Conditional badge if pending approvals > 0)

### 3.2 Key Performance Indicators (KPI Cards Grid)
Responsive 4-column metrics grid using `StatsCard` components:
1. **Total Facilities:** Number of active campus facilities with building icon (`Building2`).
2. **Active Resources:** Total active resources available for booking with layer icon (`Layers`).
3. **Confirmed Bookings:** Total confirmed reservations for the current month (`CalendarCheck2`).
4. **Pending Approvals:** Urgent actionable items requiring facility manager sign-off (`Clock` / `AlertCircle`).

### 3.3 Resource Utilization & Trend Presentation
- **Facility Utilization Progress Gauges:**
  - Horizontal progress bar for each top facility displaying percentage of hours reserved vs. operational hours.
  - Color gradient: 0-60% Teal (`#0F766E`), 61-85% Blue (`#3B82F6`), 86-100% Amber (`#F59E0B`).
- **Weekly Reservation Volume Trends:**
  - Visual mini-chart or tabular distribution indicating daily booking intensity across Monday–Sunday.
  - Identifies peak campus operational windows (e.g., Wednesday 10:00 AM – 2:00 PM).

### 3.4 Upcoming Reservations Agenda (USMG6-60)
- Displays chronological list of the next 5 upcoming reservations.
- **Card Items:**
  - Date / Time badge (e.g., "Today, 14:00 – 16:00" or "Tomorrow, 09:00 – 11:00").
  - Facility & Resource name.
  - User details (Booked by: Prof. Silva, Faculty of Science).
  - Status pill (`CONFIRMED` or `PENDING`).
  - Action button: `View Details`.
- **Empty State:** Friendly banner: "No upcoming reservations scheduled for the next 7 days. Click below to book a facility."

### 3.5 Role-Based Authorization Hierarchy (USMG6-61)
- **Ordinary Users (STUDENT, LECTURER, STAFF):**
  - View personal upcoming reservations.
  - Access to Availability Search and New Reservation modal.
  - Hidden from administrative metrics (e.g., Pending Approvals counter, Facility CRUD buttons).
- **Managers / Administrators (`FACILITY_MANAGER`, `ADMIN`):**
  - Full system-wide visibility into all university reservations.
  - Prominent pending approval alerts with direct link to `/approvals`.
  - Quick access to Add Facility and Add Resource workflows.

---

## 4. Mobile & Tablet Responsiveness

| Viewport | Calendar Layout | Dashboard Layout |
|---|---|---|
| **Desktop (>=1024px)** | Full 7-column grid with detailed multi-event badges | 4 KPI cards in a row; 2-column split for Utilization vs. Upcoming Agenda |
| **Tablet (641px - 1023px)** | 7-column grid with dot indicators instead of full text chips | 2x2 KPI cards; stacked Utilization and Agenda sections |
| **Mobile (<=640px)** | Condensed list/agenda view of reservations grouped by date | Single column KPI cards; swipeable horizontally; stacked action buttons |

---

## 5. Implementation Checklist & Handoff Notes for Member 1

- [ ] Calendar date calculations should use native `Date` functions or standard date math without external heavy libraries.
- [ ] Connect upcoming reservations to `reservationService.getUpcomingReservations()`.
- [ ] Ensure calendar filtering triggers instant state recalculation using `useMemo`.
- [ ] Restrict approval links using `hasRole(['FACILITY_MANAGER', 'ADMIN'])`.
- [ ] Provide smooth modal opening on event chip clicks without resetting calendar scroll.
