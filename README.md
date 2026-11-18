# WanderSpot 🗺️✨

> Discover prime tourist spots of any area, read authentic visitor reviews, see exact driving road distances and durations from your current location, inspect live weather, and view community photos with a lightbox.

Designed and engineered for travellers, with clean, commented, beginner-friendly code ideal for first-year B.Tech students and software engineering enthusiasts.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; v20 LTS preferred)
- **npm** (v9+)
- A modern web browser with geolocation support

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/USERNAME/wanderspot.git
cd wanderspot
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root (or copy `.env.example`):
```bash
cp .env.example .env
```
Populate the keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```
> **Note:** If Supabase keys are left empty, WanderSpot seamlessly operates in high-fidelity demo mode with pre-seeded tourist spots across 5 famous Indian destinations (Darjeeling, Jaipur, Digha, Goa, Munnar) so you can immediately explore and test all features without configuration.

### 4. Supabase Setup (Database, Security & Storage)
To connect your own remote Supabase database:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run `supabase/schema.sql` to create tables, automatic user profile triggers, and strict Row Level Security (RLS) policies.
4. Run `supabase/storage.sql` to initialize the `spot-photos` public storage bucket and upload policies.
5. Run `supabase/seed.sql` to populate sample spots, reviews, and community photos.
6. Copy your **Project URL** and **anon public key** from `Project Settings > API` into your `.env` file.

### 5. Creating Your First Administrator
1. Sign up on WanderSpot via **User Login** using your email address (e.g. `admin@wanderspot.com`).
2. Go to your Supabase Dashboard > **Table Editor** > `profiles` table.
3. Locate your user row and change the `role` column from `'user'` to `'admin'`.
4. Now you can sign in via **Admin Login** to access the complete Admin Control Center!

### 6. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 7. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack
- **Frontend:** React 18 + Vite
- **Routing:** React Router v6 (`HashRouter` for zero-configuration static GitHub Pages compatibility)
- **Styling:** Tailwind CSS with teal & sunset-orange palette, dark/light theme persistence
- **Animations:** Framer Motion (page transitions, 3D tilt hover cards, count-ups, prefers-reduced-motion)
- **Maps:** Leaflet & OpenStreetMap tiles (`react-leaflet`)
- **Backend & Storage:** Supabase Auth (email/password), PostgreSQL with RLS, Supabase Storage
- **Routing & Driving Distance:** OSRM Public Server with 5-second timeout and Haversine formula fallback
- **Weather:** Open-Meteo Live Forecast API (no API key required)
- **Geocoding Fallback:** OpenStreetMap Nominatim
- **Admin Photo Search:** Unsplash Developer API with photographer attribution & download triggers
- **Hosting:** GitHub Pages via GitHub Actions CI/CD workflow

---

## 📖 Documentation Index
- [`ABOUT.md`](./ABOUT.md): Comprehensive architectural decisions, feature reasons, API details, and future roadmap.
- [`about-folders.md`](./about-folders.md): Directory and file structure breakdown explaining the single responsibility of every file.
- [`GITHUB_PAGES_DEPLOY.md`](./GITHUB_PAGES_DEPLOY.md): Step-by-step GitHub Pages automated deployment instructions, repository secrets setup, and troubleshooting guide.
