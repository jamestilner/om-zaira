# Admin Users Management

---

## 1. Module Overview

- **Module Name:** Admin Users Management
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Allow administrators to manage administrator accounts including viewing admins, creating new admin users, and maintaining access roles.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Admin Users
- **Menu Icon (suggested):** users
- **Menu Level:** Primary
- **Default Landing Screen ID:** AD-ADMIN-LIST-01

### 2.2 Visibility Rules
- Visible to:
  - ✅ Admin
  - ❌ Customers

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|------------|------------|----------------|
| AD-ADMIN-LIST-01 | Admin Users List | Listing | Add Admin |
| AD-ADMIN-CREATE-01 | Add Admin User | Modal Form | Create |

---

# 4. Screens & Interaction Specs

---

# 4.1 Admin Users Listing Screen

- **Screen ID:** AD-ADMIN-LIST-01  
- **Screen Type:** Listing  
- **Primary Action:** Add Admin  
- **Secondary Actions:** Edit, Delete

---

## Entry Points

- Click **Admin Users** from left navigation
- Redirect after creating admin

---

## UI Layout

The page consists of four sections:

1. Page Header
2. Search Bar
3. Admin Users Table
4. Row Actions

---

## Page Header

| Element | Description |
|------|-------------|
| Title | Admin Users |
| Subtitle | Manage administrator accounts and permissions |

Right side:

Primary CTA button:

**+ Add New Admin**

Navigation:

Add New Admin → `AD-ADMIN-CREATE-01`

---

## Search Bar

Search placeholder text:
Search by name, email or role...


Search supports:

- Admin name
- Email
- Role

---

## Admin Users Table

| Column | Type | Description |
|------|------|-------------|
| Name | Avatar + Text | Admin name with initials avatar |
| Email | Text | Admin email address |
| Role | Badge | Super Admin / Admin / Manager |
| Status | Badge | Active / Inactive |
| Last Login | Timestamp | Relative login time |
| Created | Date | Account creation date |
| Actions | Icons | Edit / Delete |

---

## Table Row Layout

**Name column layout**

Avatar circle with initials  
Admin name

Example:
RS
Rahul Sharma


---

## Role Badge Types

| Role | Style |
|-----|------|
| Super Admin | Gold badge |
| Admin | Neutral badge |
| Manager | Light badge |

---

## Status Badge Types

| Status | Style |
|------|------|
| Active | Green |
| Inactive | Gray |

---

## Actions Column

| Icon | Action |
|------|-------|
| Edit | Open Edit Admin |
| Delete | Open Delete Confirmation |

Navigation rules:

Edit → Edit Admin Modal  
Delete → Delete Confirmation Modal

---

## States

### Loading
Table skeleton rows appear while data loads.

---

### Empty

Message:
Primary CTA:

Add New Admin

Unable to load admin users.
Please refresh the page.


---

# 4.2 Add Admin User Modal

- **Screen ID:** AD-ADMIN-CREATE-01
- **Screen Type:** Modal Form
- **Primary Action:** Add Admin User
- **Secondary Action:** Cancel

---

## Entry Points

- Click **+ Add New Admin** button

---

## Modal Layout

Header:

Title:

Add New Admin User


Top right:

Close icon (X)

Close behavior:

Close → Close Modal

---

## Form Fields

| Field | Type | Required | Placeholder |
|------|------|----------|-------------|
| Full Name | Text | Yes | Enter full name |
| Email Address | Email | Yes | admin@omzaira.com |
| Role | Dropdown | Yes | Select role |
| Password | Password | Yes | Enter password |
| Confirm Password | Password | Yes | Confirm password |

---

## Role Dropdown Options

| Role |
|-----|
| Super Admin |
| Admin |
| Manager |

---

## Button Actions

| Button | Action |
|------|------|
| Cancel | Close modal |
| Add Admin User | Submit form |

Navigation:

Submit → Return to `AD-ADMIN-LIST-01`

---

## Validation Rules

| Field | Rule |
|------|------|
| Full Name | Required |
| Email | Must be valid email |
| Role | Must be selected |
| Password | Required |
| Confirm Password | Must match password |

---

## Validation Messages
Please enter full name
Please enter a valid email address
Please select a role
Password is required
Passwords do not match


---

## Success Feedback

Toast message:


Admin user created successfully.


---

## Error State

Unable to create admin user.
Please try again.
---

# 5. Notifications & Feedback

Success toast messages:

- Admin user created successfully
- Admin updated successfully
- Admin deleted successfully

Error messages:

- Failed to create admin user
- Failed to delete admin

---

# 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Admin Users | Admin |
| Create Admin | Admin |
| Edit Admin | Admin |
| Delete Admin | Super Admin (recommended) |

---

# 7. Open Questions / TODOs

- Confirm if admin deletion is restricted to Super Admin only
- Confirm if pagination is required for admin listing

---

# 8. Regeneration Rules

- Screen IDs must not change
- One screen = one Figma frame
- Preserve navigation rules