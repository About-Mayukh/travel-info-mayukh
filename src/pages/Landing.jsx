import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ShieldCheck, MapPin, Sparkles, Navigation, ArrowRight, Star } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SearchBar from '../components/spots/SearchBar';
import Button from '../components/ui/Button';
import { fadeInUp, staggerContainer } from '../animations/variants';

export function Landing() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-brand-500/25 via-teal-400/20 to-sunset-500/20 blur-[110px] rounded-full pointer-events-none -z-10" />

        {/* Floating Travel Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800/80 bg-brand-50/80 dark:bg-brand-950/60 backdrop-blur-md text-brand-700 dark:text-brand-300 text-xs font-bold tracking-wide uppercase shadow-sm mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-sunset-500 animate-pulse" />
          <span>Discover Prime Tourist Spots of Any Area</span>
        </motion.div>

        {/* Main Headline with Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          Travel smarter with{' '}
          <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-sunset-500 bg-clip-text text-transparent dark:from-brand-400 dark:via-teal-300 dark:to-sunset-400">
            real road distance
          </span>
          , live reviews & photos.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
        >
          WanderSpot reveals the prime tourist spots of any destination—complete with exact driving times, live weather, real visitor photo galleries, and ticket reservation.
        </motion.p>

        {/* Two Buttons Only: User Login & Admin Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl shadow-brand-500/25"
          >
            <span>User Login</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="sunset"
            size="lg"
            onClick={() => navigate('/admin-login')}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-bold shadow-xl shadow-sunset-500/20"
          >
            <ShieldCheck className="w-4 h-4 mr-1" />
            <span>Admin Login</span>
          </Button>
        </motion.div>

        {/* Search Bar - LOCKED as per Requirement 1 & 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-xl mx-auto flex flex-col items-center gap-2"
        >
          <SearchBar isLocked={true} />
          <p className="text-xs text-slate-400">
            Search bar unlocks instantly after signing in to your account.
          </p>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
            Everything travellers need before visiting
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            No guesswork. Built with accurate OpenStreetMap data, OSRM routing and real community reviews.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
              Live Driving Distance & Cost
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates actual highway road distance and driving duration from your current location with automated fuel and toll estimates.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-sunset-50 dark:bg-sunset-950/60 text-sunset-500 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
              Visitor Photo Lightbox
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore authentic visitor-uploaded snapshots before booking. Upload your own travel photos directly from your phone or camera.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
              Day-Wise Trip Planner
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Organize multi-day itineraries with intuitive drag-and-drop reordering, interactive Leaflet area maps, and total budget calculation.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}

export default Landing;
