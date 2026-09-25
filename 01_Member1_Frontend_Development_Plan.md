# Member 1 — Frontend Development Plan
## Group 6: Facilities, Resources & Reservations

## Role
Primary frontend implementer for Group 6 features.

This file contains the implementation plan for your Jira work across Sprint 3 and Sprint 4.

---

# Sprint 3 — Core Build

## USMG6-122 — Implement Facility Management Frontend

### Objective
Implement facility management screens in the shared frontend.

### Acceptance Criteria
- Facility list.
- Facility details.
- Create form.
- Update form.
- Activate/deactivate controls.
- Client-side validation.
- Loading, success and error states.
- Facility API integration.

### Branch
```text
feature/USMG6-122-facility-management
```

### Suggested implementation order
1. Inspect existing router, API client and shared UI components.
2. Define facility TypeScript type/interface based on backend contract.
3. Create facility service/API functions.
4. Build Facility List.
5. Build Facility Details.
6. Build reusable Facility Form.
7. Use the form for Create Facility.
8. Reuse it for Update Facility.
9. Add activate/deactivate confirmation.
10. Add validation.
11. Add loading/error/empty/success states.
12. Test with real facility API.
13. Create PR.

### Suggested components
```text
features/facilities/
├── api/
├── components/
├── pages/
├── types/
└── validation/
```

### Test checklist
- [ ] List loads.
- [ ] Details open.
- [ ] Create succeeds.
- [ ] Invalid create is blocked.
- [ ] Update succeeds.
- [ ] Activate/deactivate succeeds.
- [ ] API failure is visible to user.
- [ ] Empty list is handled.
- [ ] Responsive UI.
- [ ] No console errors.

---

## USMG6-123 — Implement Resource Management Frontend

### Dependency
Use the UI/UX delivered under **USMG6-116**.

### Acceptance Criteria
- Resource list.
- Resource details.
- Create/update forms.
- Resource type.
- Facility/location.
- Capacity/quantity.
- Availability/status.
- Resource API integration.

### Branch
```text
feature/USMG6-123-resource-management
```

### Implementation steps
1. Review USMG6-116 design.
2. Review resource API contract.
3. Define resource types.
4. Add API service.
5. Create Resource List.
6. Create Resource Details.
7. Create reusable Resource Form.
8. Add create/update modes.
9. Add facility assignment UI.
10. Add type, capacity/quantity and status controls.
11. Add validation/loading/error/empty states.
12. Integrate API.
13. Test and open PR.

### Test checklist
- [ ] Resource list works.
- [ ] Details work.
- [ ] Resource type displays.
- [ ] Facility/location displays.
- [ ] Capacity/quantity works.
- [ ] Status displays.
- [ ] Create/update works.
- [ ] API errors handled.
- [ ] Responsive.

---

## USMG6-124 — Implement Availability Search UI

### Acceptance Criteria
- Date/time selection.
- Resource filters.
- Available resources.
- Unavailable states.
- Eligibility/capacity/operating-hour errors.
- Loading/empty states.
- Availability API.

### Branch
```text
feature/USMG6-124-availability-search
```

### Implementation steps
1. Build search form.
2. Add date picker.
3. Add time selector.
4. Add resource/facility/type filters as supported by API.
5. Submit availability request.
6. Render available resources.
7. Render unavailable states.
8. Show specific business-rule errors.
9. Add loading/empty/error states.
10. Test edge cases.

---

## USMG6-126 — Implement Reservation Frontend

### Acceptance Criteria
- Reservation form.
- Submit reservation.
- Reservation details.
- My Reservations.
- Reservation history.
- Reservation statuses.
- Validation/error states.
- Reservation APIs.

### Branch
```text
feature/USMG6-126-reservation-frontend
```

### Implementation steps
1. Define reservation types/statuses.
2. Add reservation API service.
3. Build Create Reservation form.
4. Connect selected facility/resource where applicable.
5. Add date/time information.
6. Submit request.
7. Show success/error feedback.
8. Build Reservation Details.
9. Build My Reservations.
10. Build history.
11. Add status badges.
12. Test pending/approved/rejected/cancelled-type states returned by backend.
13. Open PR.

---

# Sprint 3 Completion Gate

Do not move to release work until:

- [ ] USMG6-122 merged.
- [ ] USMG6-123 merged.
- [ ] USMG6-124 merged.
- [ ] USMG6-126 merged.
- [ ] Main frontend builds successfully.
- [ ] Main user path can go Facility/Resource → Availability → Reservation.

---

# Sprint 4 — Release & Integration

## USMG6-69 — Integrate Group 6 Backend with Shared Frontend

### Branch
```text
integration/USMG6-69-group6-backend
```

### Acceptance Criteria
- Facility Resource Service connected.
- Reservation Service connected.
- Loading/success/error handled.
- Auth information passed correctly.
- Main flows use real backend data.

### Work plan
1. Verify environment/base URLs.
2. Verify authentication mechanism.
3. Connect shared API client.
4. Remove temporary mocks from Group 6 features.
5. Verify facility endpoints.
6. Verify resource endpoints.
7. Verify availability endpoints.
8. Verify reservation endpoints.
9. Verify status/approval endpoints.
10. Standardize API error handling.
11. Verify expired/unauthorized scenarios.
12. Test full real-data flow.

---

## USMG6-127 — Approval & Cancellation Frontend

### Branch
```text
feature/USMG6-127-approval-cancellation
```

### Work
- Pending approval queue.
- Manager review.
- Approve.
- Reject + reason.
- Cancel.
- Confirmation.
- Error state.
- Role-based controls.
- API integration.

### Important
Never rely only on hiding buttons for security. The backend must still enforce authorization. The frontend should hide/block unauthorized actions for UX.

---

## USMG6-54 — Resource Reservation Calendar

### Dependency
Use USMG6-120 design.

### Branch
```text
feature/USMG6-54-resource-calendar
```

### Work
- Selected resource.
- Reservation dates/times.
- Clear reservation periods.
- Reservation API.
- Empty/loading/error states.

---

## USMG6-55 — Facility Reservation Calendar

### Dependency
Use USMG6-120 design.

### Branch
```text
feature/USMG6-55-facility-calendar
```

### Work
- Selected facility.
- Facility reservations.
- Date/time.
- Related facility/resource info.
- Empty/loading/error states.

---

## USMG6-56 — Filter Calendar by Resource/Facility

### Branch
```text
feature/USMG6-56-calendar-filter
```

### Work
1. Add filter selector.
2. Support resource/facility mode.
3. Refresh calendar when selected.
4. Render only relevant data.
5. Handle empty/invalid selection.
6. Keep current filter clearly visible.

---

## USMG6-60 — View Upcoming Reservations

### Branch
```text
feature/USMG6-60-upcoming-reservations
```

### Work
- Show future bookings only.
- Show facility/resource.
- Show date.
- Show time.
- Show status.
- Empty state.
- Reservation API.

Test dates carefully so past reservations are not included.

---

## USMG6-61 — Restrict Management Dashboard to Authorized Users

### Branch
```text
feature/USMG6-61-dashboard-authorization
```

### Work
1. Read role from the project's auth context.
2. Add protected-route logic.
3. Permit authorized management roles.
4. Block unauthorized users.
5. Display appropriate Access Denied view.
6. Hide management-only actions/navigation for normal users.
7. Test direct URL access.

---

## USMG6-128 — Frontend Regression and UI Validation

### Branch
```text
test/USMG6-128-frontend-regression
```

### Full regression checklist
- [ ] Facility list/details/create/update/status.
- [ ] Resource list/details/create/update.
- [ ] Availability search.
- [ ] Reservation create/details/list/history.
- [ ] Approval/rejection/cancellation.
- [ ] Resource calendar.
- [ ] Facility calendar.
- [ ] Calendar filtering.
- [ ] Upcoming reservations.
- [ ] Dashboard authorization.
- [ ] Loading states.
- [ ] Error states.
- [ ] Empty states.
- [ ] Mobile responsiveness.
- [ ] Tablet responsiveness.
- [ ] Desktop responsiveness.
- [ ] No console errors.
- [ ] No broken navigation.
- [ ] Final API data displayed correctly.

---

# Recommended Daily Sequence

```text
Pull main
→ switch/create Jira branch
→ implement one small unit
→ run app
→ test
→ commit with Jira ID
→ push
→ repeat
→ final ticket test
→ PR
```

---

# Your Sprint 3 Priority

```text
USMG6-122
    ↓
USMG6-123
    ↓
USMG6-124
    ↓
USMG6-126
```

# Your Sprint 4 Priority

```text
USMG6-69
    ↓
USMG6-127
    ↓
USMG6-54 + USMG6-55
    ↓
USMG6-56
    ↓
USMG6-60
    ↓
USMG6-61
    ↓
USMG6-128
```

---

# Final Rule

Do not invent request/response fields or endpoints. Always implement against the actual shared frontend conventions and Group 6 backend API contract.
