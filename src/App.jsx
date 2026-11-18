import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TripProvider } from './context/TripContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
              <Navbar />
              <div className="flex-1 flex flex-col">
                <AppRoutes />
              </div>
              <Footer />
            </div>
          </ToastProvider>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
