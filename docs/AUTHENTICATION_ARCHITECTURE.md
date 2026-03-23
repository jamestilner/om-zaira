# Authentication Module Architecture

## Overview

Authentication is implemented as a **single unified module** with multiple features, not as separate modules.

## Architecture Decision

### ❌ Previous (Incorrect) Approach
- Login as a separate module
- Forgot Password as a separate module  
- Reset Password as a separate module
- Each had its own navigation entry
- Routes: `auth-login`, `auth-forgot`, `auth-reset`
- Authentication was accessible from sidebar menu

### ✅ Current (Correct) Approach
- **Authentication** is the module
- Login, Forgot Password, Reset Password are **features within the module**
- **Landing page pattern**: Authentication is shown when not logged in
- **No navigation entry**: Not accessible from sidebar (it's the entry point)
- **Conditional rendering**: App shows either auth or main application based on `isAuthenticated` state
- Internal state management handles switching between features

## File Structure

```
/src/app/components/
├── Authentication.tsx          # Main module - manages internal navigation
├── AdminLogin.tsx             # Feature: Login screen
├── ForgotPassword.tsx         # Feature: Password recovery
└── ResetPassword.tsx          # Feature: Password reset
```

## How It Works

### 1. Module Container (`Authentication.tsx`)
```typescript
// Manages internal state for which feature to show
const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

// Renders the appropriate feature based on state
{currentScreen === 'login' && <AdminLogin />}
{currentScreen === 'forgot-password' && <ForgotPassword />}
{currentScreen === 'reset-password' && <ResetPassword />}
```

### 2. Navigation Flow
```
User clicks "Authentication" in sidebar
    ↓
App.tsx renders <Authentication />
    ↓
Authentication.tsx shows Login by default
    ↓
User clicks "Forgot Password"
    ↓
Authentication.tsx switches to ForgotPassword feature
    ↓
User submits email and clicks reset link
    ↓
Authentication.tsx switches to ResetPassword feature
    ↓
User resets password successfully
    ↓
Authentication.tsx switches back to Login
```

### 3. User Flows

**Flow 1: Login → Forgot Password → Back to Login**
1. User on Login screen
2. Clicks "Forgot Password?" link
3. ForgotPassword screen appears
4. User clicks "Back to Login"
5. Login screen reappears

**Flow 2: Complete Password Reset**
1. User on Login screen
2. Clicks "Forgot Password?" link
3. Enters email and submits
4. Success message appears with "Demo: Click Reset Link" button
5. User clicks the demo link (simulates email link in production)
6. ResetPassword screen appears
7. User enters new password and submits
8. Redirects to Login screen

## Benefits

### Modularity
- Authentication is a logical unit
- Easy to add new auth features (e.g., 2FA, SSO)
- Clean separation of concerns

### Security & UX
- Authentication is the entry point - users must login first
- No sidebar/navigation until authenticated
- Clear separation between public (auth) and private (app) areas
- Prevents unauthorized access to application features

### Routing Simplicity
- No routing needed for authentication - it's the default state
- Conditional rendering based on authentication status
- Internal navigation is encapsulated within auth module

### Maintainability
- Single source of truth for auth state
- Easy to add auth-related middleware
- Consistent auth flow management
- Token-based authentication ready for backend integration

## Integration Points

### App.tsx - Landing Page Pattern
```typescript
// Authentication is the landing page - shown when not authenticated
if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <Authentication
        onLoginSuccess={() => {
          localStorage.setItem("authToken", "demo-token");
          setIsAuthenticated(true);
          setCurrentPage("dashboard");
        }}
      />
      <Toaster {...} />
    </div>
  );
}

// Main application shown when authenticated
return (
  <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
    <Sidebar {...} />
    <main>
      <GlobalHeader {...} />
      {/* Page routing */}
    </main>
    <Toaster {...} />
  </div>
);
```

### Navigation (navigationData.ts)
```typescript
// Authentication is NOT in the navigation menu
// It's only accessible as the landing page when not authenticated
```

### Authentication Check
```typescript
// Check authentication on app mount
useEffect(() => {
  const authToken = localStorage.getItem("authToken");
  setIsAuthenticated(!!authToken);
}, []);

// Logout clears authentication
const handleLogout = () => {
  localStorage.removeItem("authToken");
  setIsAuthenticated(false);
  setCurrentPage("dashboard"); // Reset to default
};
```

## Future Enhancements

Potential features that could be added to the Authentication module:
- Two-Factor Authentication (2FA)
- Single Sign-On (SSO)
- Account Verification
- Email Verification
- Session Management
- Password Change (for logged-in users)

All of these would be **features within the Authentication module**, not separate modules.

## Best Practices

1. **Keep features as separate components** - Each screen (Login, ForgotPassword, ResetPassword) is its own component for maintainability
2. **Module manages state** - The Authentication module container manages which feature to show
3. **Props for callbacks** - Features receive callbacks to navigate between screens
4. **No direct routing** - Features don't manage routes, only trigger callbacks
5. **Single responsibility** - Each feature component handles one specific task

## Testing Strategy

### Unit Tests
- Test each feature component independently
- Mock callback props
- Test validation logic

### Integration Tests
- Test navigation flow between features
- Test state management in Authentication module
- Test callback execution

### E2E Tests
- Test complete user flows
- Test navigation from sidebar
- Test password reset process end-to-end
