# Admin Dashboard

---

## 1. Module Overview

- **Module Name:** Dashboard
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Provide administrators with a quick overview of platform statistics, financial metrics, product activity, and recent system events.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Dashboard
- **Menu Icon (suggested):** dashboard
- **Menu Level:** Primary
- **Default Landing Screen ID:** AD-DASH-01

### 2.2 Visibility Rules
- Visible to:
  - ✅ Admin
  - ❌ Customer

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|------------|------------|----------------|
| AD-DASH-01 | Dashboard | Overview | View Metrics |

---

## 4. Screens & Interaction Specs

### 4.1 Dashboard Screen

- **Screen ID:** AD-DASH-01
- **Screen Type:** Overview
- **Primary Action:** View platform metrics
- **Secondary Actions:** None

---

### Entry Points

- Login Success Redirect
- Dashboard navigation menu click

---

### UI Layout

The dashboard contains three primary sections:

1. Page Header
2. KPI Metrics Cards
3. Recent Activity Panel

---

### Page Header

| Element | Description |
|------|-------------|
| Page Title | Dashboard |
| Subtitle | Welcome back, Admin |
| Admin Avatar | Circular avatar with initials |
| Admin Name | Admin User |
| Admin Email | admin@omzaira.com |

---

### KPI Metrics Cards

The dashboard contains **5 key metric cards displayed horizontally**.

| Card | Metric | Description |
|----|------|-------------|
| Card 1 | Total Users | Total registered customers |
| Card 2 | Active Memberships | Number of active membership plans |
| Card 3 | Pending Payments | Outstanding installment payments |
| Card 4 | Active Products | Number of active catalogue products |
| Card 5 | Upcoming Events | Total scheduled upcoming events |

Each card includes:

- Icon
- Numeric value
- Label

Example card layout:

Icon  
Metric Value  
Metric Label

---

### Recent Activity Panel

Displays the latest platform activities.

Panel Title: **Recent Activity**  
Subtitle: **Latest transactions and updates**

---

### Recent Activity Table

| Column | Type | Description |
|------|------|-------------|
| Type | Badge | Payment / Purchase / Registration / Event |
| Description | Text | Activity description |
| Amount | Currency | Transaction value |
| Time | Relative Time | e.g., 2 mins ago |
| Status | Badge | Success / Failed / Info |

---

### Example Activity Rows

| Type | Description | Amount | Time | Status |
|----|-------------|------|------|------|
| Payment | Priya Sharma paid installment for Gold Savings Plan | ₹5,000 | 2 mins ago | Success |
| Purchase | Rajesh Kumar purchased Diamond Necklace Set | ₹45,000 | 15 mins ago | Success |
| Registration | New customer registered - Anjali Patel | - | 1 hour ago | Info |
| Event | New event created - New Year Collection Launch | - | 2 hours ago | Info |
| Payment Failed | Vikram Singh payment failed for Platinum Plan | ₹8,000 | 3 hours ago | Failed |

---

### Status Badge Colors

| Status | Badge Style |
|------|-------------|
| Success | Green |
| Failed | Red |
| Info | Orange |

---

### Navigation Rules

Currently dashboard components are **informational only**.

Future optional navigation:

| Element | Navigation |
|------|-------------|
| Total Users Card | Membership Users Module |
| Active Products Card | Catalogue Module |
| Upcoming Events Card | Events Module |

---

### States

#### Loading
- Skeleton loading for KPI cards
- Skeleton rows for activity table

#### Empty

Message:

"No recent activity yet."

#### Error

Message:

"Unable to load dashboard data. Please refresh."

#### No Permission

Message:

"You do not have access to view dashboard data."

---

## 5. Notifications & Feedback

- Error Toast: "Failed to load dashboard data."
- Refresh message after reload

---

## 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Dashboard | Admin |

---

## 7. Open Questions / TODOs

- Confirm if dashboard metric cards should link to related modules
- Confirm maximum activity records shown in table

---

## 8. Regeneration Rules

- Screen IDs must not change
- One screen = one Figma frame
- Preserve navigation rules