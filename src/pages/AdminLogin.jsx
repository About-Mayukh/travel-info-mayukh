import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password: password.trim() });

      // Check role strictly: if profiles.role != 'admin', sign out immediately and show error
      if (res.profile?.role !== 'admin') {
        await logout();
        setError('Access denied: You do not have administrator privileges.');
        toast.error('Access denied. Administrator privileges required.');
        return;
      }

      toast.success('Admin authenticated successfully.');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center p-4 sm:p-6 bg-slate-900 text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-8 sm:p-10 flex flex-col gap-6"
      >
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-sunset-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white">
            Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sign in to manage spots, approve community photos, and moderate reviews.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/50 text-rose-300 text-xs font-medium border border-rose-800">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Admin Email"
            type="email"
            required
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@wanderspot.com"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
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
            variant="sunset"
            size="lg"
            loading={loading}
            className="w-full mt-2 font-bold shadow-lg shadow-sunset-500/20"
          >
            <span>Authenticate Admin</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          <span>Not an admin? </span>
          <Link to="/login" className="text-brand-400 font-bold hover:underline ml-1">
            Go to User Login
          </Link>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

export default AdminLogin;
