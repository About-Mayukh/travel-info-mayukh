import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export function UserLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const { login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signup({ email: email.trim(), password: password.trim(), fullName: fullName.trim() });
        toast.success('Account created successfully! Welcome to WanderSpot.');
      } else {
        await login({ email: email.trim(), password: password.trim() });
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || (isSignUp ? 'Registration failed.' : 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 flex flex-col gap-6"
      >
        {/* Brand header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-slate-100">
            {isSignUp ? 'Join WanderSpot' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isSignUp
              ? 'Create your free account to unlock search, bookings & reviews'
              : 'Sign in to access unlocked search, your wishlist and trips'}
          </p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <Input
              label="Full Name"
              type="text"
              required
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              {!isSignUp && (
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              type="password"
              required
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2 font-bold shadow-md shadow-brand-500/20"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Toggle between Sign In & Sign Up */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
          </span>{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormError(null);
            }}
            className="text-brand-600 dark:text-brand-400 font-bold hover:underline ml-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>

        {/* Admin Login Shortcut */}
        <div className="text-center text-[11px] text-slate-400">
          <span>Are you an administrator? </span>
          <Link to="/admin-login" className="text-sunset-500 font-semibold hover:underline">
            Go to Admin Login
          </Link>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

export default UserLogin;
