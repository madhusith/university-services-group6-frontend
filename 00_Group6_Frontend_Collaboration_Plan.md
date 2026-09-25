# Group 6 Frontend Collaboration Plan
## University Services Management Platform — Facilities & Reservations

## 1. Team Structure

This plan is based on the Jira work items supplied for Group 6.

- **Member 1:** Frontend implementation, integration, calendars, dashboard access, regression.
- **Member 2:** UI/UX design for resource management, calendar/dashboard, and final UI/UX evidence.

The team should work in the **same shared repository**, but never develop directly on `main`.

---

## 2. Git Strategy

### Protected branch
- `main` — stable shared frontend only.

### Rule
Create **one branch per Jira ticket**.

Examples:

```text
feature/USMG6-122-facility-management
feature/USMG6-123-resource-management
feature/USMG6-124-availability-search
feature/USMG6-126-reservation-frontend
feature/USMG6-127-approval-cancellation
feature/USMG6-54-resource-calendar
feature/USMG6-55-facility-calendar
feature/USMG6-56-calendar-filter
feature/USMG6-60-upcoming-reservations
feature/USMG6-61-dashboard-authorization
integration/USMG6-69-group6-backend
test/USMG6-128-frontend-regression

design/USMG6-116-resource-management
design/USMG6-120-calendar-dashboard
docs/USMG6-121-uiux-evidence
```

### Start each ticket

```bash
git checkout main
git pull origin main
git checkout -b <branch-name>
git push -u origin <branch-name>
```

### Before continuing work on an existing branch

```bash
git checkout main
git pull origin main
git checkout <branch-name>
git merge main
```

### Commit style

```text
USMG6-122 add facility list and details
USMG6-122 add create and update form validation
USMG6-122 integrate facility API
```

### Pull request
Each ticket gets its own PR into `main`.

PR title:

```text
USMG6-122 Implement facility management frontend
```

---

# 3. Shared Design System

Use the supplied Group 6 visual palette consistently.

| Token | Value |
|---|---|
| Primary | `#1E40AF` |
| Secondary | `#0F766E` |
| Tertiary | `#3B82F6` |
| Neutral | `#64748B` |
| Font | `Inter` |

Use:
- Primary blue for main actions and active navigation.
- Teal for secondary/positive actions.
- Tertiary blue for links/highlights.
- Neutral slate for muted text and borders.
- Red only for destructive/error states.
- Rounded cards and clean light surfaces.
- Responsive layout for desktop/tablet/mobile.

---

# 4. Recommended Frontend Structure

```text
src/
├── features/
│   ├── facilities/
│   ├── resources/
│   ├── availability/
│   ├── reservations/
│   ├── approvals/
│   ├── calendars/
│   └── dashboard/
├── components/
├── layouts/
├── routes/
├── services/
├── hooks/
├── types/
└── utils/
```

Avoid putting unrelated feature logic in global files.

---

# 5. Sprint 3 Plan — Core Build

## Member 2 first: Design handoff

### USMG6-116 — Design resource management UI/UX
Deliver the approved UI for:
- Resource list.
- Resource details.
- Create resource.
- Update resource.
- Resource type.
- Facility/location assignment.
- Capacity/quantity.
- Availability/status.
- Approval requirement.

### USMG6-120 — Design calendar and dashboard UI/UX
Deliver:
- Resource reservation calendar.
- Facility reservation calendar.
- Resource/facility filter.
- Reservation status summary.
- Resource utilization summary.
- Usage trend presentation.
- Upcoming reservations.
- Responsive layout.

These designs should be handed to Member 1 before the related frontend implementation begins.

---

## Member 1 implementation order

### 1. USMG6-122 — Facility Management
Build:
- Facility list.
- Facility details.
- Create form.
- Update form.
- Activate/deactivate control.
- Validation.
- Loading/success/error states.
- Facility API integration.

### 2. USMG6-123 — Resource Management
Begin after USMG6-116 design handoff.

Build:
- Resource list.
- Resource details.
- Create/update forms.
- Type display.
- Facility/location display.
- Capacity/quantity.
- Availability/status.
- Resource API integration.

### 3. USMG6-124 — Availability Search
Build:
- Date/time selector.
- Search/filter controls.
- Available resource results.
- Unavailable state.
- Eligibility/capacity/operating-hour error messages.
- Loading and empty states.
- Availability API integration.

### 4. USMG6-126 — Reservation Frontend
Build:
- Reservation request form.
- Submit request.
- Reservation details.
- My Reservations.
- Reservation history.
- Status display.
- Validation/error states.
- Reservation API integration.

---

# 6. Sprint 3 Dependency Flow

```text
USMG6-116 Design Resource Management
                ↓
USMG6-123 Resource Management Frontend

USMG6-122 Facility Management
                ↓
USMG6-123 Resource Management
                ↓
USMG6-124 Availability Search
                ↓
USMG6-126 Reservation Frontend
```

Calendar/dashboard design can be completed in parallel:

```text
USMG6-120 Design Calendar & Dashboard
                ↓
Sprint 4 Calendar/Dashboard implementation
```

---

# 7. Sprint 3 Integration Check

Before moving to Sprint 4:

- Facility list loads.
- Facility details loads.
- Facility create/update works.
- Facility status change works.
- Resource CRUD screens work.
- Resource/facility relationship displays correctly.
- Availability search works.
- Reservation request flow works.
- My Reservations and history work.
- All pages use shared theme.
- All pages are responsive.
- No console errors.
- Each ticket has a PR and is merged only after review.

---

# 8. Sprint 4 Plan — Release Integration

## Member 1

### USMG6-69 — Integrate Group 6 backend with shared frontend
Connect:
- Facility Resource Service APIs.
- Reservation Service APIs.
- Auth information.
- Loading/success/error states.
- Real backend data across main Group 6 flows.

### USMG6-127 — Approval and Cancellation Frontend
Build:
- Pending approval queue.
- Request review.
- Approve action.
- Reject with reason.
- Cancel action.
- Confirmation/error states.
- Role-based action visibility.
- Approval API integration.

### USMG6-54 — Resource Reservation Calendar
Build:
- Selected-resource calendar.
- Reservation date/time.
- Clearly separated reservation periods.
- Reservation API data.
- Empty/loading/error states.

### USMG6-55 — Facility Reservation Calendar
Build:
- Selected-facility reservation calendar.
- Date/time information.
- Facility/resource context.
- Empty/loading/error states.

### USMG6-56 — Filter Calendar by Resource/Facility
Build:
- Resource/facility selector.
- Calendar refresh on selection.
- Relevant reservation filtering.
- Invalid/empty selection handling.

### USMG6-60 — Upcoming Reservations
Build:
- Upcoming reservation list.
- Exclude past reservations.
- Resource/facility, date, time and status.
- Empty state.
- Reservation API integration.

### USMG6-61 — Restrict Management Dashboard
Build:
- Role-based route protection.
- Authorized management access.
- Unauthorized response.
- Hide restricted actions for ordinary users.

### USMG6-128 — Frontend Regression and UI Validation
Recheck:
- Facilities.
- Resources.
- Availability.
- Reservations.
- Approvals.
- Calendar/dashboard.
- Loading/error/empty states.
- Responsive layout.

---

## Member 2

### USMG6-121 — Prepare UI/UX Design Evidence
Prepare:
- Final wireframes/screens.
- Main user flows.
- Theme/template evidence.
- Design revisions.
- Comparison between agreed design and implemented screens.
- Final evidence for submission/demo.

Member 2 should also act as the **UI consistency reviewer** during Sprint 4 and compare implemented pages against USMG6-116 and USMG6-120.

---

# 9. Sprint 4 Recommended Execution Order

```text
USMG6-69 API Integration
        ↓
USMG6-127 Approval/Cancellation
        ↓
USMG6-54 + USMG6-55 Calendars
        ↓
USMG6-56 Calendar Filtering
        ↓
USMG6-60 Upcoming Reservations
        ↓
USMG6-61 Dashboard Authorization
        ↓
USMG6-128 Regression/UI Validation
        ↓
USMG6-121 Final UI/UX Evidence
```

Some calendar work can run in parallel after the relevant APIs are stable.

---

# 10. Shared File Ownership

High-conflict files:
- `src/App.*`
- `src/routes/*`
- `src/layouts/*`
- shared sidebar/navigation.
- global CSS/theme files.
- API client/base URL.
- authentication context.
- `package.json`.

Rules:
1. Tell the other member before editing shared files.
2. Keep the edit small.
3. Pull/merge latest `main` before touching shared files.
4. Merge shared infrastructure PRs before dependent feature branches.
5. Do not reformat unrelated files.

---

# 11. Daily Team Routine

## Start of day
1. Pull latest `main`.
2. Check Jira ticket.
3. Confirm which shared files may be edited.
4. Work only on the ticket branch.

## End of day
1. Run frontend.
2. Test modified flow.
3. Check browser console.
4. Commit with Jira ID.
5. Push branch.
6. Update teammate with what changed.
7. Capture screenshots/evidence where useful.

---

# 12. Definition of Done for Every Frontend Ticket

- [ ] All acceptance criteria implemented.
- [ ] Uses agreed Group 6 design system.
- [ ] Responsive at desktop/tablet/mobile widths.
- [ ] Correct loading state.
- [ ] Correct error state.
- [ ] Correct empty state where applicable.
- [ ] API failures do not break UI.
- [ ] No unnecessary duplicated components.
- [ ] No console errors.
- [ ] Branch pushed.
- [ ] PR created.
- [ ] PR reviewed.
- [ ] Ticket tested after merge into `main`.

---

# 13. Final Release Checklist

- [ ] Shared navigation works.
- [ ] Facility management complete.
- [ ] Resource management complete.
- [ ] Availability search complete.
- [ ] Reservation flow complete.
- [ ] Approval/cancellation complete.
- [ ] Resource calendar complete.
- [ ] Facility calendar complete.
- [ ] Calendar filters complete.
- [ ] Upcoming reservations complete.
- [ ] Management dashboard protected.
- [ ] Group 6 backend connected.
- [ ] Regression testing complete.
- [ ] Responsive UI verified.
- [ ] UI/UX evidence ready.
- [ ] Demo flow prepared.
