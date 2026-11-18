import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Heart,
  Calendar,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import ThemeToggle from './ThemeToggle';
import Button from '../ui/Button';

export function Navbar() {
  const { user, profile, isAdmin, isAuthenticated, logout } = useAuth();
  const { totalSpotsCount } = useTrip();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Explore', path: '/home', icon: Compass },
    { name: 'Wishlist', path: '/favorites', icon: Heart },
    { name: 'Trip Planner', path: '/trips', icon: Calendar, badge: totalSpotsCount },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? '/home' : '/'}
          className="flex items-center gap-2.5 group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-700 via-teal-600 to-sunset-500 bg-clip-text text-transparent dark:from-brand-400 dark:via-teal-300 dark:to-sunset-400">
            WanderSpot
          </span>
        </Link>

        {/* Desktop Nav Items */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sunset-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-amber-500 text-white'
                    : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                to="/profile"
                className="flex items-center gap-2 group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs uppercase border border-brand-200 dark:border-brand-700">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {profile?.full_name || 'Traveler'}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {profile?.role || 'user'}
                  </p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-rose-600"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : isLanding ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                User Login
              </Button>
              <Button
                variant="sunset"
                size="sm"
                onClick={() => navigate('/admin-login')}
              >
                Admin Login
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            </div>
          )}

          {/* Mobile hamburger button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pt-3 pb-5 flex flex-col gap-2"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sunset-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Signed in as {profile?.full_name || user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-500 hover:text-rose-600"
              >
                Sign out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
