# Profile Dropdown Features

## Overview

The profile dropdown in the GlobalHeader now has fully functional features for user account management.

## Features Implemented

### 1. **My Profile**
- **Action:** Navigate to user profile page
- **Current Behavior:** Shows alert "Profile page coming soon!"
- **Future:** Will navigate to dedicated profile management page
- **Callback:** `onNavigateToProfile`

### 2. **Change Password**
- **Action:** Opens modal to change user password
- **Features:**
  - Current password field (required)
  - New password field (required, min 8 characters)
  - Confirm password field (required, must match new password)
  - Real-time validation with error messages
  - Success notification on password change
  - Automatic form reset after success
- **Validations:**
  - New password must be at least 8 characters
  - New password must match confirmation
  - New password must be different from current password
- **Toast Notifications:**
  - Error: "New password must be at least 8 characters long"
  - Error: "Passwords do not match"
  - Error: "New password must be different from current password"
  - Success: "Password changed successfully!"

### 3. **Settings**
- **Action:** Navigate to application settings page
- **Current Behavior:** Shows alert "Settings page coming soon!"
- **Future:** Will navigate to dedicated settings page
- **Callback:** `onNavigateToSettings`

### 4. **Help & Support**
- **Action:** Access help documentation or support
- **Current Behavior:** Shows alert "Help & Support feature coming soon!"
- **Future:** Could open:
  - Help documentation modal
  - Support ticket system
  - Knowledge base
  - Live chat support

### 5. **Logout**
- **Action:** Logout user from the application
- **Features:**
  - Confirmation dialog before logout
  - Clears authentication state
  - Redirects to authentication module
- **Confirmation:** "Are you sure you want to logout?"
- **Callback:** `onLogout`

## Technical Implementation

### Props Added to GlobalHeader

```typescript
interface GlobalHeaderProps {
  // ... existing props
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
}
```

### App.tsx Integration

```typescript
// Handlers
const handleNavigateToProfile = () => {
  alert("Profile page coming soon!");
};

const handleNavigateToSettings = () => {
  alert("Settings page coming soon!");
};

const handleLogout = () => {
  setIsAuthenticated(false);
  setCurrentPage("authentication");
};

// Usage
<GlobalHeader
  // ... existing props
  onNavigateToProfile={handleNavigateToProfile}
  onNavigateToSettings={handleNavigateToSettings}
  onLogout={handleLogout}
/>
```

### Change Password Modal

The Change Password modal uses:
- `FormModal` component from HB library
- `FormField`, `FormLabel`, `FormInput` for form fields
- `FormSection` for organizing fields
- `FormFooter` for action buttons
- Toast notifications from Sonner library

**Form State:**
```typescript
const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
```

**Validation Logic:**
```typescript
// Minimum length check
if (passwordForm.newPassword.length < 8) {
  toast.error("New password must be at least 8 characters long");
  return;
}

// Match check
if (passwordForm.newPassword !== passwordForm.confirmPassword) {
  toast.error("Passwords do not match");
  return;
}

// Different from current check
if (passwordForm.currentPassword === passwordForm.newPassword) {
  toast.error("New password must be different from current password");
  return;
}
```

## User Flow

### Profile Dropdown Access
1. User clicks on their avatar in the top-right corner
2. Dropdown menu appears showing:
   - User info (name, email, role)
   - Menu options (Profile, Change Password, Settings, Help)
   - Logout button (in red)

### Change Password Flow
1. User clicks "Change Password" in dropdown
2. Dropdown closes, modal opens
3. User fills in:
   - Current password
   - New password (min 8 chars)
   - Confirm new password
4. User clicks "Change Password" button
5. Validation runs:
   - If errors: Toast notification shows error
   - If valid: Password changes, success toast appears, modal closes

### Logout Flow
1. User clicks "Logout" (from header or sidebar)
2. Confirmation dialog appears: "Are you sure you want to logout?"
3. If confirmed:
   - Authentication state cleared
   - User redirected to Authentication module (login screen)
4. If cancelled:
   - Dialog closes, user remains logged in

## Sidebar Profile Drawer

The sidebar also has a profile drawer with the same features:
- Same logout functionality with confirmation
- Consistent user experience across header and sidebar

## Future Enhancements

### Profile Page
When implemented, should include:
- Personal information (name, email, phone)
- Profile photo upload
- Role and permissions display
- Activity history
- Account creation date

### Settings Page
When implemented, should include:
- Notification preferences
- Language selection
- Theme preferences (already available in header)
- Email preferences
- Privacy settings
- Data export/import

### Help & Support
When implemented, could include:
- Searchable documentation
- Video tutorials
- FAQs
- Contact support form
- Live chat integration
- Support ticket history

## Design Consistency

All dropdown interactions follow the design system:
- Dropdown closes when action is clicked
- Confirmation dialogs for destructive actions
- Toast notifications for feedback
- Consistent styling with the rest of the application
- Dark mode support

## Security Considerations

### Change Password
- In production, should:
  - Verify current password with backend
  - Enforce stronger password policies
  - Check password against common passwords
  - Rate limit password change attempts
  - Log password changes for security audit

### Logout
- Clears local authentication state
- In production, should also:
  - Invalidate server-side session
  - Clear authentication tokens
  - Clear sensitive data from localStorage
  - Redirect to secure login page
