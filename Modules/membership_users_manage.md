admin_admin_membership_users_management.md
# Membership Users Management

---

## 1. Module Overview

- **Module Name:** Membership Users Management
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Allow administrators to manage customers enrolled in membership plans, track installment progress, monitor payments, and view membership status.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Customers
- **Menu Icon (suggested):** users
- **Menu Level:** Primary
- **Default Landing Screen ID:** AD-CUST-LIST-01

### 2.2 Visibility Rules
- Visible to:
  - ✅ Admin
  - ❌ Customers

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|------------|------------|----------------|
| AD-CUST-LIST-01 | Customers List | Listing | View Customer |

---

## 4. Screens & Interaction Specs

---

# 4.1 Customers Listing Screen

- **Screen ID:** AD-CUST-LIST-01
- **Screen Type:** Listing
- **Primary Action:** View Customer
- **Secondary Actions:** Export Data, Filter

---

## Entry Points

- Click **Customers** from left navigation
- Redirect from dashboard widgets (optional)

---

## UI Layout

The page contains the following sections:

1. Page Header
2. Search Bar
3. Filters
4. Export Button
5. Customers Table

---

## Page Header

| Element | Description |
|------|-------------|
| Title | Customers |
| Subtitle | Manage customer memberships and payments |

Right side action:

Button:

Export Data

---

## Search Bar

Placeholder:


Search by name, email, phone or plan...


Supported search fields:

- Customer Name
- Email
- Phone Number
- Membership Plan

---

## Filters

Filters dropdown allows filtering by:

| Filter | Values |
|------|-------|
| Membership Plan | Gold / Platinum / Diamond / Silver |
| Status | Active / Completed / Pending |
| Installment Progress | Partial / Completed |

---

## Customers Table

| Column | Type | Description |
|------|------|-------------|
| Customer | Avatar + Name + Join date |
| Contact | Email + Phone |
| Membership Plan | Plan name + total plan value |
| Progress | Installment progress indicator |
| Total Paid | Paid amount vs total |
| Status | Active / Completed / Pending |
| Next Payment | Next installment date |
| Actions | View |

---

## Customer Column Layout

Displays:

Avatar circle with initials  
Customer name  
Join date

Example:


PS
Priya Sharma
Joined Jan 15, 2024


---

## Contact Column

Displays:

Email  
Phone number

Example:


priya.sharma@email.com

+91 98765 43210


---

## Membership Plan Column

Displays:

Plan Name  
Plan Value

Example:


Gold Savings Plan
₹60,000


---

## Progress Column

Displays installment progress bar.

Example:


6/12 installments
50%
Progress bar


---

## Total Paid Column

Displays amount paid vs total plan value.

Example:


₹30,000
of ₹60,000


---

## Status Badges

| Status | Badge Color |
|------|-------------|
| Active | Green |
| Completed | Gray |
| Pending | Orange |

---

## Next Payment Column

Displays next installment due date.

Example:


Jan 1, 2025


If plan completed:


---

## Actions Column

| Action | Behavior |
|------|---------|
| View | Open Customer Detail Screen |

Navigation:


View → Customer Detail Module


---

## States

### Loading

Skeleton loaders for table rows.

---

### Empty

Message:


No customers found.


---

### Error


Unable to load customers.
Please refresh the page.


---

## 5. Notifications & Feedback

Possible system messages:

- Customer data exported successfully
- Failed to export data
- Filters applied

---

## 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Customers | Admin |
| Export Data | Admin |
| Apply Filters | Admin |

---

## 7. Open Questions / TODOs

- Confirm pagination size for customer list
- Confirm if export format is CSV or Excel
- Confirm customer detail screen scope

---

## 8. Regeneration Rules

- Screen IDs must not change
- One screen = one Figma frame
- Preserve navigation rules