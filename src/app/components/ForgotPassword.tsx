import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
  onResetPassword?: () => void;
}

export default function ForgotPassword({ onBackToLogin, onResetPassword }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-xl mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Password reset instructions have been sent to your email.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mt-1">
                  {email}
                </p>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Please check your inbox and click the link to reset your password. The link will expire in 24 hours.
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              {/* Demo: Simulate clicking reset link */}
              {onResetPassword && (
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Demo: Click Reset Link
                </button>
              )}

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2.5 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="admin@company.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-sm font-medium transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
