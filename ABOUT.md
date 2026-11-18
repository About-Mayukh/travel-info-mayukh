# About WanderSpot: Design & Architectural Decisions

## 1. Executive Summary
**WanderSpot** is a comprehensive, production-grade tourism platform that addresses common pain points encountered by travellers: discovering prime local attractions, calculating realistic driving road travel times and costs from their starting location, reviewing authentic unedited community photos, and planning day-by-day itineraries.

This document articulates every major architectural decision, technology selection, API integration rationale, and future expansion pathway.

---

## 2. Features & Rationale

### A. Locked Search on Landing Page
- **Decision:** The search bar on the landing hero appears disabled with a lock icon. Clicking it displays a toast notice: *"Please log in to search"*.
- **Rationale:** Protects catalog API bandwidth and user context. Guarantees that search queries can immediately access user geolocation, personal favorites, and itinerary history without anonymous state mismatch.

### B. Strict Email & Password Auth (No Social Logins)
- **Decision:** Authentication relies solely on Supabase Auth via email and password. Google or external OAuth providers were deliberately excluded.
- **Rationale:** Ensures complete privacy control, eliminates third-party developer console dependencies for the student owner, and keeps identity management simple, transparent, and portable across standard PostgreSQL schemas.

### C. Role-Based Admin Enforcement
- **Decision:** Admin login uses the same Supabase Auth instance, but queries `profiles.role = 'admin'`. Non-admin users are logged out with an immediate access restriction warning.
- **Rationale:** Separation of concerns. Prevents privilege escalation while avoiding maintaining dual authentication databases. Row Level Security policies enforce that only `role = 'admin'` can alter spots or perform moderation.

### D. Road Distance & Driving Travel Duration with Haversine Fallback
- **Decision:** Detail pages call the Open Source Routing Machine (OSRM) driving API (`router.project-osrm.org`) using `lon,lat` order. If OSRM fails or exceeds 5 seconds, it silently falls back to straight-line Haversine distance with an informative indicator.
- **Rationale:** Straight-line distances drastically underestimate travel time in mountainous areas (e.g. Darjeeling, Munnar) or coastal detours (e.g. Digha). OSRM provides real turn-by-turn road distance. The strict 5-second timeout and Haversine fallback ensure the page never hangs or crashes even if public routing servers experience latency.

### E. User-Uploaded Photo Gallery with Lightbox & 5MB Limit
- **Decision:** Visitors can upload real photos up to 5 MB into the public `spot-photos` Supabase storage bucket under `{user_id}/{filename}`. A smooth lightbox provides zoom and swipe navigation.
- **Rationale:** Marketing photos often mask real crowd levels or maintenance states. Authentic visitor photos build credibility. The 5MB limit and client-side MIME check prevent storage exhaustion and malicious file payloads.

### F. Day-Wise Trip Planner with Drag-and-Drop
- **Decision:** Travelers can organize spots into multi-day itineraries, drag to reorder visits, and review total ticket costs and consecutive road travel distance.
- **Rationale:** Sightseeing is intrinsically multi-stop. Providing an interactive itinerary planner turns a discovery engine into an end-to-end trip companion.

### G. Live Weather via Open-Meteo
- **Decision:** Spot detail pages display real-time temperature, condition icons, wind speed, humidity, and "Best Time to Visit" guidance from Open-Meteo.
- **Rationale:** Open-Meteo requires no API key, has no rate-limit hurdles for open-source apps, and provides precise hourly and current meteorological data across global coordinates.

---

## 3. Technology Stack Decisions

| Technology | Selection Rationale |
|---|---|
| **React 18 + Vite** | Blazing-fast Hot Module Replacement (HMR), lightweight build output, and component-driven architecture. |
| **HashRouter** | Critical for GitHub Pages static hosting. Standard browser history routing results in HTTP 404 errors on browser page reloads when hosted on static object stores without server-side rewrite rules. |
| **Tailwind CSS** | Utility-first CSS ensuring minimal production bundle size through tree-shaking, seamless dark-mode toggling, and clean maintenance. |
| **Framer Motion** | Declarative layout animations, 3D card tilt physics, smooth exit transitions with `AnimatePresence`, and native `prefers-reduced-motion` compliance. |
| **Leaflet + OpenStreetMap** | Open-source map rendering with zero mandatory billing or proprietary API key requirements (unlike Google Maps Platform). |
| **Supabase** | Open-source Firebase alternative providing PostgreSQL relational database, Row Level Security, instant Auth, and S3-compatible Storage. |

---

## 4. External APIs & Architecture

1. **OSRM (Open Source Routing Machine):**
   - Profile: Driving
   - URL: `https://router.project-osrm.org/route/v1/driving/{userLng},{userLat};{spotLng},{spotLat}?overview=false`
   - Cache: In-memory keyed by user coordinate pair and spot coordinate pair to prevent redundant network calls.

2. **Open-Meteo:**
   - Free, open weather API utilizing WMO weather codes.
   - Converts numeric codes into readable sky conditions and travel tips.

3. **OpenStreetMap Nominatim:**
   - Fallback geocoder when browser geolocation permission is denied.
   - Enforces strict compliance: only triggered on Enter/Search button click, never on typing keystrokes, with a 1-second rate-limiter.

4. **Unsplash API (Admin Only):**
   - Used exclusively inside the Admin spot editor to pick high-resolution cover photos.
   - Strictly honors Unsplash Developer Guidelines: renders photographer attribution and triggers the mandatory `download_location` endpoint.

---

## 5. Future Scope & Roadmap

1. **Online Payment Gateway Integration:**
   - Integrate Razorpay or Stripe for real entry ticket purchases, QR-code entry passes, and automated booking receipts.
2. **Hotel & Transport Booking:**
   - Partner with local cab aggregators, train booking APIs, and boutique homestays near each tourist spot.
3. **Multi-Language Support (i18n):**
   - Provide multilingual localization (Hindi, Bengali, Spanish, French, German) to assist international and regional travellers.
4. **Offline Progressive Web App (PWA) Mode:**
   - Service worker caching of itinerary maps, emergency contact numbers, and saved spot details when travelling in remote zero-network zones.
5. **AI-Powered Trip Generator:**
   - Integrate Gemini Interactions API to automatically synthesize customized 3-day or 5-day itineraries tailored to traveler budget, travel pace, and party size.
