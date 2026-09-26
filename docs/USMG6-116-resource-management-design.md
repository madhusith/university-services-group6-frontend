# USMG6-116: Resource Management UI/UX Design Specification & Handoff Package
**Team Member:** Member 2 (UI/UX Designer)  
**Role:** Primary UI/UX Owner for Resource, Calendar, and Dashboard  
**Target Recipient:** Member 1 (Frontend Implementation & Integration)  
**Status:** Approved & Ready for Implementation  
**Design System Palette:** Primary `#1E40AF` | Secondary `#0F766E` | Tertiary `#3B82F6` | Neutral `#64748B` | Typography: `Inter`

---

## 1. Overview & Objectives

The primary objective of **USMG6-116** is to deliver unambiguous, high-fidelity UI/UX design specifications, component wireframes, state interaction flows, and validation rules for the University Services Management Platform's **Resource Management** module.

This design enables University Facility Managers and Administrators to maintain an accurate, categorized inventory of university resources (laboratories, lecture halls, equipment, computing labs, study rooms, conference spaces), monitor their real-time availability, configure booking restrictions, and enforce approval policies.

---

## 2. Design System Tokens & Foundations

All resource management screens must adhere to the Group 6 Design Tokens:

| Token Category | Variable / Token | Hex / Value | Usage & Context |
|---|---|---|---|
| **Primary Brand** | `--primary-800` | `#1E40AF` | Primary action buttons, active navigation states, primary table headers |
| **Secondary Brand** | `--secondary-700` | `#0F766E` | Badges, success actions, secondary highlights, equipment filters |
| **Tertiary Accent** | `--tertiary-500` | `#3B82F6` | Interactive links, focused input borders, hover glow rings |
| **Neutral Slate** | `--neutral-500` | `#64748B` | Secondary text, field descriptions, placeholder text |
| **Neutral Border** | `--neutral-200` | `#E2E8F0` | Subtle card borders, divider lines, table row borders |
| **Background Main** | `--bg-main` | `#F8FAFC` | Page body background (clean off-white slate) |
| **Surface Card** | `--bg-card` | `#FFFFFF` | Form containers, modal bodies, resource cards |
| **Status Available** | `--success-500` | `#22C55E` | Available status badge & indicators |
| **Status In Use / Maint.**| `--warning-500` | `#F59E0B` | In-use / Maintenance status badge |
| **Status Deactivated** | `--danger-500` | `#EF4444` | Inactive / Decommissioned badges, validation errors |
| **Typography** | Font Family | `Inter, -apple-system, sans-serif` | Clean, highly legible sans-serif for numbers & labels |

---

## 3. Screen Layout Specifications

### 3.1 Resource Inventory List View (`/resources`)

#### UX Purpose
Enables facility administrators and general university staff to explore, filter, and manage campus resources with immediate visibility into real-time availability and approval requirements.

#### Layout Structure
1. **Header Action Bar:**
   - **Page Title:** "Resource Management" with subtitle "Manage and monitor campus equipment, lecture halls, and facilities".
   - **Primary Action (Role-Gated):** `+ Add Resource` button (rendered in `#1E40AF`, visible only to `FACILITY_MANAGER` and `ADMIN`).
2. **Filter & Search Toolbar (Sticky / Top of Page):**
   - **Search Input:** Real-time text search querying resource name, code, description, and tags. Includes search lens icon (`#64748B`).
   - **Facility Dropdown Filter:** Dynamically populated with all active facilities (e.g., "All Facilities", "Faculty of Science", "Main Library", "IT Complex").
   - **Resource Type Dropdown:** Options: `ALL`, `ROOM`, `LAB`, `EQUIPMENT`, `SPORTS`, `OTHER`.
   - **Status Dropdown:** Options: `ALL`, `AVAILABLE`, `MAINTENANCE`, `INACTIVE`.
   - **Active Counter Badge:** Shows total matching items (e.g., "Showing 8 resources").
3. **Card Grid Presentation:**
   - Responsive multi-column layout (3 columns on desktop `>1024px`, 2 columns on tablet `640px - 1024px`, 1 column on mobile `<640px`).
   - Each resource card contains:
     - **Card Header:** Resource Name (`h3`, semi-bold `#0F172A`) and Status Badge (`AVAILABLE`, `MAINTENANCE`, `INACTIVE`).
     - **Location Row:** Facility icon (`Building2`) + Facility Name + Room/Floor number.
     - **Capacity Row:** User icon (`Users`) + Capacity figure (e.g., "60 Seats" or "Qty: 1").
     - **Approval Tag:** Shield icon (`ShieldAlert` / `ShieldCheck`) highlighting whether reservations require manual manager sign-off.
     - **Action Footer:**
       - `View Details` (Ghost button with eye icon).
       - `Edit` (Secondary button with edit icon, role-gated).
       - `Book Now` (Teal secondary button for instant reservation creation).

---

### 3.2 Resource Details Modal (`ResourceDetailModal`)

#### UX Purpose
Displays comprehensive configuration details for a selected resource without navigating away from the inventory list, minimizing user context switching.

#### Detailed Layout Sections:
1. **Modal Header:**
   - Title: Resource Name.
   - Resource Code Badge (e.g., `RES-LAB-01`).
   - Close (`X`) button in top-right corner.
2. **Key Metric Indicators (3-Column Grid):**
   - **Capacity / Quantity:** Clear numeric presentation with icon.
   - **Resource Type:** Category badge (Room, Lab, Equipment).
   - **Status Badge:** Visual indicator of operating status.
3. **Detailed Information Panels:**
   - **Facility & Location:** Associated campus building, floor level, and access instructions.
   - **Approval Policy Notice:**
     - *If Requires Approval:* Prominent amber notice advising that booking requests require Facility Manager sign-off.
     - *If Instant Confirmation:* Green notice advising that booking is automatically confirmed upon submission.
   - **Features & Amenities Chips:** Interactive chips displaying installed equipment (e.g., "Projector 4K", "Gigabit LAN", "Air Conditioned", "Surround Sound").
   - **Maintenance / Out-of-Service Notes:** If status is `MAINTENANCE`, display administrator reason and estimated recovery date.
4. **Action Footer:**
   - `Close` button (Neutral outline).
   - `Edit Resource` button (Primary blue, role-gated).
   - `Book This Resource` button (Primary teal, opens booking modal).

---

### 3.3 Create & Update Resource Form Modal (`ResourceFormModal`)

#### Field Definitions & Validation Rules

| Field Name | Type | Required? | Validation Constraints | Default / Helper Text |
|---|---|---|---|---|
| **Resource Name** | Text Input | **Yes** | Min 3 chars, Max 80 chars. Must be unique within facility. | "e.g., Advanced AI Research Lab 02" |
| **Facility** | Select Dropdown | **Yes** | Must select a valid active facility. | "Select campus facility..." |
| **Resource Type** | Select Dropdown | **Yes** | Must be one of `ROOM`, `LAB`, `EQUIPMENT`, `SPORTS`, `OTHER`. | Defaults to `ROOM` |
| **Capacity** | Number Input | **Yes** | Integer >= 1, <= 2000. | "Max occupants or unit quantity" |
| **Location / Room** | Text Input | **Yes** | Min 2 chars, Max 50 chars. | "e.g., Level 3, Block B, Room 304" |
| **Requires Approval** | Toggle / Checkbox | **Yes** | Boolean. | "Toggle ON if manager must approve bookings" |
| **Initial Status** | Select Dropdown | **Yes** | `AVAILABLE`, `MAINTENANCE`, `INACTIVE`. | Defaults to `AVAILABLE` |
| **Description** | Textarea | No | Max 500 characters. | "Specify amenities, equipment details, access rules" |

#### Form States & Interactivity:
- **Client-Side Validation:** Triggers on blur and submit. Invalid fields display red border (`--danger-500`) and feedback text below the input.
- **Submit Button State:** Disabled with spinner indicator while the API request is in progress (`isSubmitting === true`).
- **Cancel Button:** Reverts unsaved changes and prompts if changes were made.

---

## 4. State Design Specifications

### 4.1 Loading State
- Visual Skeleton / Spinner centered in card grid.
- Primary `#1E40AF` pulsing spinner with text: "Loading university resources...".
- Prevents layout shift during initial data fetch.

### 4.2 Empty State
- Rendered when 0 resources match current filter/search parameters.
- **Illustration / Icon:** Large muted `Layers` icon in `#CBD5E1`.
- **Title:** "No Resources Found".
- **Description:** "No resources match your current filter criteria. Try adjusting your search query or clear all filters."
- **Action:** "Reset Filters" button.

### 4.3 Error State
- Rendered when network or backend API failure occurs (`500 Internal Server Error`, `Network Disconnected`).
- **Alert Banner:** Rose red background (`#FEF2F2`) with red border (`#F87171`) and `AlertCircle` icon.
- **Action:** "Retry Connection" button that re-triggers `loadData()`.

### 4.4 Mobile & Tablet Responsiveness
- **Desktop (>=1024px):** 3-column grid, horizontal filter bar, 600px wide modal dialogs.
- **Tablet (641px - 1023px):** 2-column grid, compact 2x2 filter bar layout.
- **Mobile (<=640px):** Single-column stacked cards, full-width search input, stacked filter selects, modal slides up as a bottom sheet with 95% viewport width.

---

## 5. Implementation Notes for Member 1

1. **Service Hookup:** Connect form submissions to `resourceService.createResource()` and `resourceService.updateResource()`.
2. **Facility Association:** Ensure selecting a facility populates the appropriate `facilityId` foreign key and updates display labels.
3. **Role Gating:** Utilize `const { hasRole } = useAuth()` and restrict create/edit/delete actions to `['FACILITY_MANAGER', 'ADMIN']`. Ordinary students/staff can only view details and trigger `Book Now`.
4. **Toast Feedback:** Trigger `useToast().success()` upon creation/update and `useToast().error()` upon failure.
5. **No Regressions:** Maintain card hover transitions (`translateY(-3px)`) and glowing outline styles defined in `src/index.css`.
