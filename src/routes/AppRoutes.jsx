import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Landing from '../pages/Landing';
import UserLogin from '../pages/UserLogin';
import AdminLogin from '../pages/AdminLogin';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import SearchResults from '../pages/SearchResults';
import SpotDetail from '../pages/SpotDetail';
import Favorites from '../pages/Favorites';
import TripPlannerPage from '../pages/TripPlannerPage';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected User Routes (Search, Spots, Bookings, Favorites, Trips, Profile) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spot/:id"
          element={
            <ProtectedRoute>
              <SpotDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <TripPlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
