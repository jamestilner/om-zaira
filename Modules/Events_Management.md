# Events Management

---

## 1. Module Overview

- **Module Name:** Events Management
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Allow administrators to create and manage jewelry events such as exhibitions, workshops, launches, and seminars while tracking registrations and capacity.

---

## 2. Navigation & Entry Points

### Left Navigation

| Menu Label | Icon |
|------------|------|
| Events | calendar |

Default Landing Screen:

AD-EVT-LIST-01

---

## 3. Screen Inventory

| Screen ID | Screen Name | Screen Type |
|----------|-------------|-------------|
| AD-EVT-LIST-01 | Events Listing | Listing |
| AD-EVT-CREATE-01 | Create Event | Modal |
| AD-EVT-EDIT-01 | Edit Event | Modal |
| AD-EVT-DETAIL-01 | Event Details | Modal |

---

# 4. Screens & Interaction Specs

---

# 4.1 Events Listing

Screen ID: AD-EVT-LIST-01  
Screen Type: Listing  
Primary Action: Create Event

---

## Page Header

Title:

Events

Subtitle:

Manage jewelry exhibitions, launches and workshops

Right side CTA:

+ Create Event

Navigation:

Create Event → AD-EVT-CREATE-01

---

## Event Statistics Cards

Four dashboard cards appear.

| Card | Description |
|------|-------------|
| Total Events | Total number of events |
| Upcoming | Events scheduled in future |
| Completed | Past events |
| Total Registrations | Total participant registrations |

Example:

Total Events: 8  
Upcoming: 6  
Completed: 2  
Total Registrations: 645

---

## Search & Filters

Search placeholder:

Search events...

Filters dropdown supports:

- Event category
- Status (Upcoming / Completed)
- Location

---

# Event Grid Layout

Events are displayed as **cards in a responsive grid**.

Each card contains:

- Event image
- Category
- Event title
- Description
- Date
- Time
- Location
- Registration progress bar
- Action icons

---

# Event Card Example

Category: Collection Launch

Event Title:

New Year Diamond Collection Launch

Description:

Exclusive preview of our stunning New Year diamond collection featuring contemporary designs.

Date:

Jan 15, 2025

Time:

6:00 PM – 9:00 PM

Location:

Om Zaira Flagship Store, Mumbai

---

## Registration Progress

Example:

Registrations:

127 / 150

Displayed with progress bar.

---

## Event Status Badge

| Status | Style |
|------|------|
| Upcoming | Orange |
| Completed | Green |

---

# Event Card Actions

Icons under the card:

| Icon | Action |
|-----|--------|
| 👁 | View Event |
| ✏️ | Edit Event |
| 🗑 | Delete Event |

Navigation:

View → AD-EVT-DETAIL-01  
Edit → AD-EVT-EDIT-01

---

# States

### Loading

Skeleton event cards appear.

---

### Empty

No events available.

CTA:

Create Event

---

### Error

Unable to load events.

Please refresh the page.

---

# 4.2 Create Event Modal

Screen ID: AD-EVT-CREATE-01  
Screen Type: Modal Form  
Primary Action: Create Event

---

## Modal Header

Title:

Create New Event

Close icon:

X

---

## Form Fields

| Field | Type | Required |
|------|------|----------|
| Event Title | Text | Yes |
| Description | Textarea | No |
| Category | Dropdown | Yes |
| Date | Date Picker | Yes |
| Time | Time Range | Yes |
| Location | Text | Yes |
| Capacity | Number | Yes |

---

## Category Options

Example:

- Collection Launch
- Workshop
- Exhibition
- Seminar
- Consultation
- Member Event

---

## Buttons

| Button | Action |
|------|--------|
| Cancel | Close modal |
| Create Event | Save event |

Navigation:

Create Event → AD-EVT-LIST-01

---

## Validation Rules

| Field | Rule |
|------|------|
| Event Title | Required |
| Category | Required |
| Date | Required |
| Time | Required |
| Location | Required |
| Capacity | Must be numeric |

---

## Success Feedback

Event created successfully.

---

## Error

Unable to create event.

Please try again.

---

# 4.3 Edit Event Modal

Screen ID: AD-EVT-EDIT-01  
Screen Type: Modal Form

Fields identical to Create Event.

Primary button:

Update Event

---

# 4.4 Event Detail Modal

Screen ID: AD-EVT-DETAIL-01  
Screen Type: Detail Modal

---

## Event Overview

Displays:

- Event image
- Event category
- Event title
- Description

Example:

Collection Launch  
New Year Diamond Collection Launch

Exclusive preview of our stunning New Year diamond collection featuring contemporary designs.

---

## Event Details

| Field | Example |
|------|---------|
| Date | Jan 15, 2025 |
| Time | 6:00 PM – 9:00 PM |
| Location | Om Zaira Flagship Store, Mumbai |

---

## Registration Statistics

| Metric | Example |
|------|--------|
| Total Capacity | 150 |
| Registered | 127 |
| Available Seats | 23 |

---

## Registration Progress

Example:

85% progress

Displayed with progress bar.

---

## Footer Actions

| Button | Behavior |
|------|----------|
| Close | Close modal |
| Edit Event | Open Edit Event Modal |

Navigation:

Edit Event → AD-EVT-EDIT-01

---

# 5. Notifications

Success:

- Event created successfully
- Event updated successfully
- Event deleted successfully

Error:

- Failed to create event
- Failed to update event

---

# 6. Access Rules

| Action | Role |
|------|------|
| View Events | Admin |
| Create Event | Admin |
| Edit Event | Admin |
| Delete Event | Admin |

---

# 7. Regeneration Rules

- Screen IDs must remain stable
- One screen = one Figma frame
- Preserve navigation flows