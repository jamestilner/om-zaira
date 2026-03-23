# Admin Authentication

---

## 1. Module Overview

- **Module Name:** Admin Authentication
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
  Provide secure access for administrators to log in, reset passwords, and manage authentication sessions for the admin panel.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Not visible in navigation
- **Menu Icon (suggested):** lock
- **Menu Level:** System
- **Default Landing Screen ID:** AD-AUTH-LOGIN-01

### 2.2 Visibility Rules
- Visible to:
  - ❌ Admin (Login required)
  - ❌ User

Unauthenticated users will always be redirected to **Login Screen**.

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|------------|------------|----------------|
| AD-AUTH-LOGIN-01 | Admin Login | Form | Sign In |
| AD-AUTH-FORGOT-01 | Forgot Password | Form | Send Reset Link |
| AD-AUTH-RESET-01 | Reset Password | Form | Update Password |
| AD-AUTH-LOGOUT-01 | Logout Confirmation | Modal | Confirm Logout |

---

## 4. Screens & Interaction Specs

### 4.1 Admin Login Screen

- **Screen ID:** AD-AUTH-LOGIN-01
- **Screen Type:** Form
- **Primary Action:** Sign In
- **Secondary Actions:** Forgot Password

#### Entry Points
- Visiting Admin Panel URL
- Redirect from protected routes when session expires

#### UI Layout
- Brand Logo
- Page Title: **Admin Login**
- Login Form Card
- Sign In Button
- Forgot Password Link

#### Form Fields

| Field | Type | Required | Validation |
|------|-----|----------|------------|
| Email | Text | ✅ | Valid email format |
| Password | Password | ✅ | Required |

#### Navigation Rules
- Sign In Success → **Admin Dashboard**
- Forgot Password → **AD-AUTH-FORGOT-01**

#### States
- Loading
- Invalid Credentials
- Account Disabled
- Server Error

#### UX Copy
- Invalid Login: **Incorrect email or password.**
- Disabled Account: **Your account is inactive. Contact administrator.**

---

### 4.2 Forgot Password Screen

- **Screen ID:** AD-AUTH-FORGOT-01
- **Screen Type:** Form
- **Primary Action:** Send Reset Link

#### UI Layout
- Page Title: **Forgot Password**
- Instruction Text
- Email Input
- Submit Button

#### Form Fields

| Field | Type | Required |
|------|-----|----------|
| Email | Text | ✅ |

#### Navigation Rules
- Submit → Reset Email Sent Message
- Back → **AD-AUTH-LOGIN-01**

#### States
- Loading
- Email Not Found
- Success Message

#### UX Copy
- Success: **Password reset instructions have been sent to your email.**

---

### 4.3 Reset Password Screen

- **Screen ID:** AD-AUTH-RESET-01
- **Screen Type:** Form
- **Primary Action:** Update Password

#### Form Fields

| Field | Type | Required |
|------|-----|----------|
| New Password | Password | ✅ |
| Confirm Password | Password | ✅ |

#### Validation
- Password must match
- Minimum length requirement

#### Navigation Rules
- Update Password → **AD-AUTH-LOGIN-01**
- Cancel → **AD-AUTH-LOGIN-01**

#### States
- Loading
- Password Mismatch
- Invalid Reset Link
- Success Message

#### UX Copy
- Success: **Password updated successfully. Please login again.**

---

### 4.4 Logout Confirmation Modal

- **Screen ID:** AD-AUTH-LOGOUT-01
- **Screen Type:** Modal

#### Copy
- **Title:** Confirm Logout
- **Message:** Are you sure you want to logout?

#### Navigation Rules
- Confirm → **AD-AUTH-LOGIN-01**
- Cancel → Close Modal

---

## 5. Notifications & Feedback

- Success Toast: **Login successful**
- Error Toast: **Invalid credentials**
- Password Reset Success Message
- Logout Confirmation

---

## 6. Access & Visibility Rules

| Action | Role |
|------|------|
| Login | Public |
| Reset Password | Public |
| Logout | Admin |

---

## 7. Open Questions / TODOs

- Confirm password policy (minimum length / complexity)
- Confirm if Admin panel supports **Admin-created password resets**

---

## 8. Regeneration Rules

- Screen IDs must not change
- One screen = one Figma frame
- Preserve navigation rules