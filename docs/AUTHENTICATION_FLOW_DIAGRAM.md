# Authentication Flow Diagram

## Visual Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Start                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │ Check localStorage  │
                    │ for "authToken"     │
                    └─────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
            ┌───────────────┐   ┌───────────────┐
            │ Token Found   │   │ No Token      │
            └───────────────┘   └───────────────┘
                    ↓                   ↓
        ┌──────────────────┐  ┌────────────────────┐
        │ isAuthenticated  │  │ isAuthenticated    │
        │ = true           │  │ = false            │
        └──────────────────┘  └────────────────────┘
                    ↓                   ↓
        ┌──────────────────┐  ┌────────────────────┐
        │                  │  │                    │
        │  MAIN APP VIEW   │  │  LOGIN VIEW        │
        │                  │  │                    │
        │  • Sidebar       │  │  • Login Form      │
        │  • Header        │  │  • Forgot Password │
        │  • Dashboard     │  │  • Demo Creds      │
        │  • Modules       │  │                    │
        │                  │  │  No Sidebar        │
        └──────────────────┘  │  No Header         │
                              └────────────────────┘
```

## Login Success Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        LOGIN VIEW                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Email: admin@demo.com                                │     │
│  │  Password: ••••••••                                   │     │
│  │                                                        │     │
│  │  [Sign In Button]                                     │     │
│  └──────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘
                              ↓
                     User clicks "Sign In"
                              ↓
                    ┌─────────────────────┐
                    │ Validate Credentials│
                    └─────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌───────────────────┐   ┌───────────────────┐
        │ Valid Credentials │   │ Invalid Creds     │
        └───────────────────┘   └───────────────────┘
                    ↓                   ↓
        ┌──────────────────────┐  ┌───────────────────┐
        │ onLoginSuccess()     │  │ Show Error Msg    │
        │                      │  │ "Incorrect email  │
        │ 1. Store token       │  │ or password"      │
        │ 2. isAuthenticated   │  │                   │
        │    = true            │  │ Stay on Login     │
        │ 3. Navigate to       │  └───────────────────┘
        │    Dashboard         │
        └──────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────────────┐
│                        MAIN APP VIEW                            │
│                                                                 │
│  ┌──────────┐  ┌──────────────────────────────────────────┐  │
│  │          │  │ [Header with Profile]                     │  │
│  │ Sidebar  │  │                                            │  │
│  │          │  │ ┌────────────────────────────────────┐   │  │
│  │ • Dash   │  │ │                                     │   │  │
│  │ • Catalog│  │ │        Dashboard Content           │   │  │
│  │ • Plans  │  │ │                                     │   │  │
│  │ • Events │  │ │                                     │   │  │
│  │ • Cust.  │  │ └────────────────────────────────────┘   │  │
│  │          │  │                                            │  │
│  └──────────┘  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Forgot Password Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        LOGIN VIEW                               │
│                                                                 │
│  User clicks "Forgot Password?"                                │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                   FORGOT PASSWORD VIEW                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Email: [enter email]                                 │     │
│  │                                                        │     │
│  │  [Send Reset Link Button]                             │     │
│  └──────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘
                              ↓
                     User submits email
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                   SUCCESS MESSAGE                               │
│                                                                 │
│  ✓ Check Your Email                                            │
│                                                                 │
│  We've sent a password reset link to:                          │
│  admin@demo.com                                                │
│                                                                 │
│  [Demo: Click Reset Link]  ← Simulates email link             │
│  [Back to Login]                                               │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    User clicks demo link
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                   RESET PASSWORD VIEW                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  New Password: [enter password]                       │     │
│  │  Confirm Password: [enter password]                   │     │
│  │                                                        │     │
│  │  [Reset Password Button]                              │     │
│  └──────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘
                              ↓
                     User submits new password
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                   SUCCESS → REDIRECT                            │
│                                                                 │
│  ✓ Password reset successfully!                                │
│  Redirecting to login...                                       │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    Returns to LOGIN VIEW
```

## Logout Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        MAIN APP VIEW                            │
│                                                                 │
│  User clicks Logout (from Header Profile or Sidebar)          │
└────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │ Confirmation Dialog │
                    │                     │
                    │ "Are you sure you   │
                    │ want to logout?"    │
                    │                     │
                    │ [Cancel]  [OK]      │
                    └─────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌───────────────────┐   ┌───────────────────┐
        │ User Cancels      │   │ User Confirms     │
        └───────────────────┘   └───────────────────┘
                    ↓                   ↓
        ┌───────────────────┐   ┌───────────────────┐
        │ Stay in App       │   │ handleLogout()    │
        │ No Changes        │   │                   │
        └───────────────────┘   │ 1. Remove token   │
                                │ 2. isAuthenticated│
                                │    = false        │
                                │ 3. Reset page     │
                                └───────────────────┘
                                        ↓
┌────────────────────────────────────────────────────────────────┐
│                        LOGIN VIEW                               │
│                                                                 │
│  User is logged out and sees login screen                      │
└────────────────────────────────────────────────────────────────┘
```

## Authentication Module Internal Navigation

```
┌────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION MODULE                         │
│                                                                 │
│  Internal State: currentScreen                                 │
│  Values: 'login' | 'forgot-password' | 'reset-password'        │
└────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                     ↓                      ↓
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ currentScreen│    │ currentScreen     │    │ currentScreen│
│ = 'login'    │    │ = 'forgot-pass'   │    │ = 'reset'    │
└──────────────┘    └──────────────────┘    └──────────────┘
        ↓                     ↓                      ↓
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Render       │    │ Render            │    │ Render       │
│ AdminLogin   │    │ ForgotPassword    │    │ ResetPassword│
└──────────────┘    └──────────────────┘    └──────────────┘

Navigation between screens:
• Login → Forgot: setCurrentScreen('forgot-password')
• Forgot → Reset: setCurrentScreen('reset-password')  
• Forgot → Login: setCurrentScreen('login')
• Reset → Login: setCurrentScreen('login')
```

## Session Persistence

```
┌────────────────────────────────────────────────────────────────┐
│                    Browser/Tab Actions                          │
└────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌──────────────────┐                    ┌──────────────────┐
│ Page Refresh     │                    │ New Tab/Window   │
└──────────────────┘                    └──────────────────┘
        ↓                                           ↓
        └───────────────┬───────────────────────────┘
                        ↓
            ┌───────────────────────┐
            │ App.tsx useEffect     │
            │ runs on mount         │
            └───────────────────────┘
                        ↓
            ┌───────────────────────┐
            │ Check localStorage    │
            │ for "authToken"       │
            └───────────────────────┘
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────┐              ┌──────────────────┐
│ Token Exists │              │ No Token         │
└──────────────┘              └──────────────────┘
        ↓                               ↓
┌──────────────┐              ┌──────────────────┐
│ User stays   │              │ Show Login       │
│ logged in    │              │ User must login  │
│              │              │                  │
│ Show Main    │              │                  │
│ App View     │              │                  │
└──────────────┘              └──────────────────┘
```

## Component Hierarchy

```
App.tsx
├── [If NOT authenticated]
│   └── Authentication Module
│       ├── AdminLogin Component
│       ├── ForgotPassword Component
│       └── ResetPassword Component
│
└── [If authenticated]
    ├── Sidebar Component
    │   └── Profile Drawer
    │       └── Logout Button
    │
    └── Main Content
        ├── GlobalHeader Component
        │   └── User Dropdown
        │       ├── My Profile
        │       ├── Change Password
        │       ├── Settings
        │       ├── Help & Support
        │       └── Logout Button
        │
        └── Page Content
            ├── Dashboard
            ├── Catalogue Management
            ├── Membership Plans
            ├── Events Management
            ├── Membership Users
            ├── Admin Users
            ├── UI Kit
            └── Sample Design
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER ACTION                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENT HANDLER                          │
│                   (onClick, onSubmit)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   CALLBACK PROP                              │
│          (onLoginSuccess, onLogout, etc.)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   APP.TSX HANDLER                            │
│              (handleLogout, handleLogin)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   STATE UPDATE                               │
│          setIsAuthenticated(true/false)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   LOCALSTORAGE UPDATE                        │
│         localStorage.setItem/removeItem("authToken")         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   RE-RENDER                                  │
│         App conditionally shows Login or Main App            │
└─────────────────────────────────────────────────────────────┘
```

## State Diagram

```
                    ┌───────────────┐
                    │               │
                    │  NOT_AUTHED   │ ←─────────┐
                    │               │           │
                    └───────────────┘           │
                            ↓                   │
                      Login Success             │
                            ↓                   │
                    ┌───────────────┐           │
                    │               │           │
                    │ AUTHENTICATED │           │
                    │               │           │
                    └───────────────┘           │
                            ↓                   │
                        Logout                  │
                            │                   │
                            └───────────────────┘

States:
• NOT_AUTHED: isAuthenticated = false, shows Login
• AUTHENTICATED: isAuthenticated = true, shows Main App

Transitions:
• NOT_AUTHED → AUTHENTICATED: Login success
• AUTHENTICATED → NOT_AUTHED: Logout
```

## Error Handling Flow

```
                    ┌───────────────┐
                    │ User Action   │
                    └───────────────┘
                            ↓
                    ┌───────────────┐
                    │ Try Operation │
                    └───────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────┐                    ┌──────────────────┐
│ Success      │                    │ Error/Failure    │
└──────────────┘                    └──────────────────┘
        ↓                                       ↓
┌──────────────┐                    ┌──────────────────┐
│ Continue     │                    │ Show Error       │
│ Normal Flow  │                    │ • Toast Notif    │
│              │                    │ • Error Message  │
│ • Success    │                    │ • Stay on Screen │
│   Toast      │                    │                  │
│ • Navigate   │                    │ User can retry   │
└──────────────┘                    └──────────────────┘

Examples:
• Invalid login → Error message, stay on login
• Network error → Toast notification, retry available
• Validation error → Inline error, prevent submit
```

## Complete User Journey Map

```
1. First Time User
   └→ Open App → See Login → Enter Creds → Success → Dashboard

2. Returning User
   └→ Open App → Check Token → Auto Login → Dashboard

3. User with Tasks
   └→ Login → Dashboard → Navigate Modules → Work → Logout

4. Forgot Password User
   └→ Login → Forgot Link → Enter Email → Success → 
      → Demo Link → Reset → New Password → Login → Dashboard

5. Security-Conscious User
   └→ Login → Profile → Change Password → New Password → 
      → Success Toast → Continue Working
```

---

**Legend:**
- `→` Flow direction
- `┌─┐` Process/State box
- `↓` Sequential step
- `←` Return/Loop back
- `└→` Alternative path
