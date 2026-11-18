# WanderSpot: Complete Folder & File Structure Guide

Every file and folder in WanderSpot adheres strictly to single-responsibility design:
- **Components** show things and handle user interactions.
- **Services** talk to Supabase and external APIs.
- **Utils** calculate numbers, format text, and perform pure logic.
- Components never call Supabase directly.

---

```
wanderspot/
├── .github/
│   └── workflows/
│       └── deploy.yml               # CI/CD: Automated build and GitHub Pages deployment workflow
├── public/
│   ├── favicon.svg                  # WanderSpot compass brand icon
│   └── placeholder-spot.svg         # SVG fallback placeholder for spots without photography
├── supabase/
│   ├── schema.sql                   # Database schema DDL, RLS policies, trigger for profiles
│   ├── storage.sql                  # Storage bucket definition and RLS policies for 'spot-photos'
│   └── seed.sql                     # Rich seed dataset with 25 Indian spots, reviews, and photos
├── src/
│   ├── assets/                      # Imported static image assets and icons
│   ├── animations/
│   │   ├── variants.js              # Framer motion variants, micro-interactions, reduced motion check
│   │   ├── pageTransition.js        # Standardized page enter/exit animation presets
│   │   └── cardTilt.js              # Smooth 3D tilt and perspective hover calculation hook
│   ├── components/
│   │   ├── admin/
│   │   │   ├── StatsCards.jsx       # Aggregated stats cards (users, spots, reviews, photos)
│   │   │   ├── SpotForm.jsx         # Create/Edit spot form with coordinate & price validation
│   │   │   ├── CoverPhotoPicker.jsx # Unsplash modal search with photographer attribution
│   │   │   ├── PhotoModeration.jsx  # Photo approval, rejection, and deletion panel
│   │   │   └── ReviewModeration.jsx # Spam review moderation and deletion table
│   │   ├── layout/
│   │   │   ├── Navbar.jsx           # Responsive header, search status, auth badges, mobile drawer
│   │   │   ├── Footer.jsx           # Copyright, API attributions, and OpenStreetMap credits
│   │   │   ├── PageWrapper.jsx      # Animated Framer Motion wrapper for page transitions
│   │   │   └── ThemeToggle.jsx      # Dark / light mode button with sun/moon icon transition
│   │   ├── map/
│   │   │   ├── SpotsMap.jsx         # Leaflet MapContainer, TileLayer, and auto-bounds updater
│   │   │   └── SpotMarker.jsx       # Custom SVG map pin with preview popup and detail navigation
│   │   ├── photos/
│   │   │   ├── PhotoGallery.jsx     # Masonry-style user photo gallery with like counters
│   │   │   ├── PhotoUpload.jsx      # 5MB validated photo upload modal with live image preview
│   │   │   └── Lightbox.jsx         # Full-screen modal with image zoom, swipe, and keyboard controls
│   │   ├── reviews/
│   │   │   ├── ReviewList.jsx       # List of community reviews with average rating breakdown
│   │   │   ├── ReviewForm.jsx       # 1 to 5 star rating selector and comment submission form
│   │   │   └── ReviewItem.jsx       # Individual review item card with author info and delete button
│   │   ├── spots/
│   │   │   ├── SearchBar.jsx        # Locked on landing (toast notice) & unlocked debounced search
│   │   │   ├── SpotCard.jsx         # Spot card with 3D tilt, zoom, price, ratings, top 2 reviews
│   │   │   ├── SpotList.jsx         # Responsive grid layout with loading skeletons and empty states
│   │   │   ├── FilterBar.jsx        # Category pills, rating filters, price sliders, and sorting options
│   │   │   ├── BookingPanel.jsx     # Adult/child ticket counters, date picker, and booking action
│   │   │   ├── DistanceInfo.jsx     # OSRM road distance, duration, travel cost, and Nominatim fallback
│   │   │   └── WeatherCard.jsx      # Open-Meteo live weather conditions and best time to visit
│   │   ├── trip/
│   │   │   ├── TripPlanner.jsx      # Day-by-day itinerary manager interface
│   │   │   ├── ItineraryDay.jsx     # Individual day card with drag-and-drop spot ordering
│   │   │   └── TripSummary.jsx      # Cumulative distance, ticket costs, and travel budget summary
│   │   └── ui/
│   │       ├── Button.jsx           # Button with primary, sunset, outline variants and loading spinners
│   │       ├── Input.jsx            # Form input with leading/trailing icons and dark mode styling
│   │       ├── Modal.jsx            # Accessible dialog with blur backdrop, AnimatePresence, Esc close
│   │       ├── Toast.jsx            # Toast provider and notification banner for alerts & warnings
│   │       ├── Skeleton.jsx         # Shimmer placeholder skeleton loaders for spots and text
│   │       ├── StarRating.jsx       # Interactive 1-5 star selector and read-only rating display
│   │       └── Loader.jsx           # Animated compass spinner for loading states
│   ├── context/
│   │   ├── AuthContext.jsx          # Supabase authentication session, user profile, and role state
│   │   ├── ThemeContext.jsx         # Dark / light theme provider synced with localStorage
│   │   └── TripContext.jsx          # Multi-day trip itinerary, spot sequence, and cost calculators
│   ├── hooks/
│   │   ├── useAuth.js               # Re-exports authentication context hook
│   │   ├── useGeolocation.js        # Browser GPS location with Nominatim city fallback
│   │   ├── useDebounce.js           # Debounce hook for responsive search queries
│   │   ├── useSpots.js              # Spot querying, category filtering, sorting, distance enrichment
│   │   └── useFavorites.js          # Wishlist toggle and query hook for user favorites
│   ├── lib/
│   │   └── supabase.js              # The ONLY place where Supabase client is initialized; demo seed data
│   ├── pages/
│   │   ├── Landing.jsx              # Hero landing page, locked search bar, User Login & Admin Login
│   │   ├── UserLogin.jsx            # Email & password sign in / sign up toggle
│   │   ├── AdminLogin.jsx           # Admin portal login strictly validating profiles.role = 'admin'
│   │   ├── ForgotPassword.jsx       # Password reset email request interface
│   │   ├── Home.jsx                 # Main exploration page with unlocked search & category pills
│   │   ├── SearchResults.jsx        # Search results page with interactive map toggle and filters
│   │   ├── SpotDetail.jsx           # Two-column desktop (tabs on mobile) booking and photos layout
│   │   ├── Favorites.jsx            # User's saved spot wishlist grid
│   │   ├── TripPlannerPage.jsx      # Itinerary builder with drag-and-drop and print export
│   │   ├── Profile.jsx              # User profile with bookings, favorites, photos, and reviews tabs
│   │   ├── AdminDashboard.jsx       # Stats cards, spot CRUD, photo moderation, and review moderation
│   │   └── NotFound.jsx             # 404 error page with quick return navigation
│   ├── routes/
│   │   ├── AppRoutes.jsx            # HashRouter route configuration wrapped in AnimatePresence
│   │   ├── ProtectedRoute.jsx       # Route guard requiring authenticated user session
│   │   └── AdminRoute.jsx           # Route guard strictly requiring role === 'admin'
│   ├── services/
│   │   ├── authService.js           # Supabase Auth methods (signUp, signIn, signOut, resetPassword)
│   │   ├── spotService.js           # Tourist spots CRUD and area queries
│   │   ├── reviewService.js         # Community review queries and submissions
│   │   ├── photoService.js          # Supabase storage photo uploads, likes, and admin approvals
│   │   ├── bookingService.js        # Reservation creation and itinerary booking persistence
│   │   ├── favoriteService.js       # User wishlist queries and toggle actions
│   │   ├── weatherService.js        # Open-Meteo live weather forecast fetching and WMO decoding
│   │   ├── routingService.js        # OSRM highway road driving distance with 5-second Haversine fallback
│   │   ├── unsplashService.js       # Unsplash photo search, photographer attribution, download ping
│   │   └── geocodeService.js        # OpenStreetMap Nominatim city search with 1s rate limiter
│   ├── styles/
│   │   └── index.css                # Tailwind directives, Google fonts, custom scrollbars, Leaflet styles
│   ├── utils/
│   │   ├── distance.js              # Great-circle Haversine formula calculation in kilometers
│   │   ├── price.js                 # Ticket prices and highway road driving travel cost estimation
│   │   ├── format.js                # Formats distance (km/m), duration (hours/mins), currency (₹), dates
│   │   └── validators.js            # Validates photo file types, 5 MB file size limit, and coordinates
│   ├── App.jsx                      # App root component combining context providers and layout
│   └── main.jsx                     # Entry point mounting React DOM inside HashRouter
├── .env.example                     # Sample environment variable template with empty values
├── .env                             # Active environment configuration
├── index.html                       # HTML5 root with responsive meta tags and brand typography
├── package.json                     # Node.js project manifest and dependency versions
├── vite.config.js                   # Vite configuration with base path support for GitHub Pages
├── tailwind.config.js               # Tailwind design system configuration
├── postcss.config.js                # PostCSS plugins (Tailwind & Autoprefixer)
├── README.md                        # Project installation, setup guide, and credentials instructions
├── ABOUT.md                         # Architecture, decision rationale, API explanations, and roadmap
├── about-folders.md                 # This folder tree and single-responsibility reference guide
└── GITHUB_PAGES_DEPLOY.md           # Step-by-step GitHub Pages automated deployment instructions
```
