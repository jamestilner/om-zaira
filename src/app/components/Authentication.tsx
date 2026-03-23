/**
 * AUTHENTICATION MODULE
 * 
 * This is a unified authentication module that manages all auth-related features.
 * Login, Forgot Password, and Reset Password are FEATURES within this module,
 * not separate modules themselves.
 * 
 * Features:
 * - Login (AD-AUTH-LOGIN-01) - Main login screen
 * - Forgot Password (AD-AUTH-FORGOT-01) - Password recovery request
 * - Reset Password (AD-AUTH-RESET-01) - Password reset with token
 * 
 * Internal Navigation:
 * - The module manages its own state to switch between these screens
 * - External routing only needs to know about "authentication" module
 * - User flows:
 *   1. Login → Forgot Password → Login
 *   2. Login → Forgot Password → Reset Password (via email link) → Login
 * 
 * Based on /Modules/Authentication.md specifications
 */

import { useState } from 'react';
import AdminLogin from './AdminLogin';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

interface AuthenticationProps {
  onLoginSuccess: () => void;
}

type AuthScreen = 'login' | 'forgot-password' | 'reset-password';

export default function Authentication({ onLoginSuccess }: AuthenticationProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  return (
    <>
      {currentScreen === 'login' && (
        <AdminLogin
          onLoginSuccess={onLoginSuccess}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPassword
          onBackToLogin={() => setCurrentScreen('login')}
          onResetPassword={() => setCurrentScreen('reset-password')}
        />
      )}

      {currentScreen === 'reset-password' && (
        <ResetPassword
          onBackToLogin={() => setCurrentScreen('login')}
        />
      )}
    </>
  );
}
