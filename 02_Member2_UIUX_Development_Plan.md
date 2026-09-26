# Member 2 — UI/UX and Frontend Support Plan
## Group 6: Facilities, Resources & Reservations

## Role
Primary UI/UX owner for the Group 6 resource, calendar and dashboard experience, plus final design evidence and frontend visual review.

---

# Sprint 3

## USMG6-116 — Design Resource Management UI/UX

### Objective
Design the resource management screens and interactions so frontend implementation can proceed without ambiguity.

### Acceptance Criteria
- Resource list screen.
- Resource details screen.
- Create/update resource forms.
- Resource type.
- Facility/location assignment.
- Capacity/quantity.
- Availability/status controls.
- Approval requirement.
- Ready for frontend implementation.

### Branch
```text
design/USMG6-116-resource-management
```

### Deliverables

#### Resource List
Must show:
- Resource name.
- Resource type.
- Facility/location.
- Capacity/quantity.
- Availability/status.
- Clear View/Edit actions.
- Search/filter pattern where appropriate.
- Empty/loading/error state designs.

#### Resource Details
Must show:
- Resource identity.
- Type.
- Facility/location.
- Capacity/quantity.
- Availability/status.
- Approval requirement.
- Management actions.

#### Create/Update Form
Define:
- Required fields.
- Optional fields.
- Validation messages.
- Disabled/active submit state.
- Cancel/back behaviour.
- Success state.
- Error state.

#### Status controls
Show how availability/status changes are confirmed.

### Design system
Use:
- Primary `#1E40AF`
- Secondary `#0F766E`
- Tertiary `#3B82F6`
- Neutral `#64748B`
- Inter font

### Handoff package
- [ ] Final resource list.
- [ ] Final details view.
- [ ] Create form.
- [ ] Edit form.
- [ ] Validation examples.
- [ ] Status interaction.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Mobile/responsive version.
- [ ] Notes for Member 1.

---

## USMG6-120 — Design Calendar and Dashboard UI/UX

### Objective
Design the resource/facility calendar and management dashboard experience.

### Acceptance Criteria
- Resource calendar.
- Facility calendar.
- Resource/facility filtering.
- Reservation status summary.
- Resource utilization summary.
- Usage trend presentation.
- Upcoming reservations.
- Responsive layout.

### Branch
```text
design/USMG6-120-calendar-dashboard
```

### Calendar design
Design:
- Calendar header.
- Date navigation.
- Resource/facility selector.
- Reservation event visual.
- Status distinction.
- Empty schedule.
- Loading.
- Error.
- Small-screen behaviour.

### Dashboard design
Design:
- Reservation status summary cards.
- Resource utilization.
- Usage trend section.
- Upcoming reservations.
- Filters where required.
- Role-aware management actions.

### Handoff package
- [ ] Resource calendar screen.
- [ ] Facility calendar screen.
- [ ] Filter states.
- [ ] Reservation event states.
- [ ] Empty calendar.
- [ ] Loading calendar.
- [ ] Error calendar.
- [ ] Dashboard summary.
- [ ] Utilization section.
- [ ] Trend presentation.
- [ ] Upcoming reservations section.
- [ ] Mobile/tablet layout.
- [ ] Notes for Member 1.

---

# Sprint 3 Collaboration with Member 1

Member 1 depends on your design for:
- USMG6-123 Resource Management.
- USMG6-54 Resource Calendar.
- USMG6-55 Facility Calendar.
- USMG6-56 Calendar Filter.
- USMG6-60 Upcoming Reservations.
- Dashboard-related implementation.

During implementation:
1. Review Member 1's screen against your design.
2. Check spacing, typography and hierarchy.
3. Check responsive behaviour.
4. Confirm design changes before they become permanent.
5. Keep design revisions documented.

Do not directly rewrite Member 1's feature branch unless you both agree. Prefer review comments or a focused fix branch.

---

# Sprint 4

## USMG6-121 — Prepare UI/UX Design Evidence

### Objective
Prepare final design evidence for assessment and demo.

### Branch
```text
docs/USMG6-121-uiux-evidence
```

### Acceptance Criteria
- Final wireframes/screens organized.
- Main user flows available.
- Theme/template evidence included.
- Useful revisions recorded.
- Implemented screens comparable with agreed designs.
- Evidence ready for submission/demo.

### Evidence structure

```text
UIUX_Evidence/
├── 01_Theme/
├── 02_Resource_Management/
├── 03_Calendar/
├── 04_Dashboard/
├── 05_User_Flows/
├── 06_Design_Revisions/
└── 07_Design_vs_Implementation/
```

### Theme evidence
Include:
- Color palette.
- Typography.
- Button styles.
- Form fields.
- Search component.
- Navigation style.
- Icons/actions.
- Status colours/states.

### User flows
Prepare clear flows such as:

```text
Resource Manager
→ Resource List
→ Resource Details
→ Edit Resource
→ Save
→ Updated Resource Details
```

```text
User
→ Calendar
→ Select Facility/Resource
→ View Reservation Periods
```

```text
Manager
→ Dashboard
→ Review Upcoming Reservations
→ Open Reservation/Management Flow
```

### Design revision log
For each useful change:

| Area | Original | Revised | Reason |
|---|---|---|---|
| Example | Old list action | New action menu | Better mobile usability |

### Design vs implementation evidence
Capture:
- Agreed design.
- Final implemented screen.
- Short note explaining match or justified change.

---

# Sprint 4 UI Validation Support

During Member 1's USMG6-128 regression ticket, you should review:

- [ ] Facility screens follow theme.
- [ ] Resource screens match approved design.
- [ ] Availability screens use consistent inputs/buttons.
- [ ] Reservation screens use consistent status badges.
- [ ] Approval/rejection dialogs are consistent.
- [ ] Calendars match USMG6-120.
- [ ] Dashboard matches USMG6-120.
- [ ] Inter font is used consistently.
- [ ] Primary/secondary colours are consistent.
- [ ] Buttons are consistent.
- [ ] Form spacing is consistent.
- [ ] Empty/loading/error states are visually consistent.
- [ ] Desktop responsive.
- [ ] Tablet responsive.
- [ ] Mobile responsive.

---

# Suggested Git Workflow

For a design evidence update:

```bash
git checkout main
git pull origin main
git checkout -b docs/USMG6-121-uiux-evidence
```

Commit examples:

```text
USMG6-121 organize final UI/UX design evidence
USMG6-121 add design revision comparison
USMG6-121 add final implementation comparison
```

---

# Definition of Done — Design Ticket

- [ ] Every acceptance criterion covered.
- [ ] Uses Group 6 palette.
- [ ] Uses Inter.
- [ ] Desktop layout considered.
- [ ] Tablet layout considered.
- [ ] Mobile layout considered.
- [ ] Loading/empty/error states included where relevant.
- [ ] User flow understandable.
- [ ] Design handoff contains enough detail to implement.
- [ ] Final files organized.
- [ ] Jira evidence ready.

---

# Your Priority

## Sprint 3

```text
USMG6-116 Resource Management Design
            ↓
handoff to Member 1

USMG6-120 Calendar & Dashboard Design
            ↓
handoff to Member 1
```

## Sprint 4

```text
Review implementation continuously
            ↓
USMG6-121 Final UI/UX Evidence
            ↓
support USMG6-128 visual regression
            ↓
final demo/submission package
```

---

# Important Collaboration Rule

Your design work should not be treated as separate from implementation. The goal is:

```text
Design
→ Handoff
→ Implementation
→ UI Review
→ Revision
→ Final Evidence
```

Keep screenshots and revision evidence throughout the work instead of trying to reconstruct everything at the end.
