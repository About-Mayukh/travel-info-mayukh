# Hosting WanderSpot on GitHub Pages

This guide walks you through deploying WanderSpot to GitHub Pages at `https://USERNAME.github.io/REPO_NAME/` using GitHub Actions.

---

## 1. Repository Setup

1. Initialize git in your local repository (if not already done) and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production-quality WanderSpot tourism platform"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

---

## 2. Configure GitHub Pages to use GitHub Actions

1. In your GitHub repository, navigate to **Settings** (top navigation tab).
2. On the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions** from the dropdown menu (instead of "Deploy from a branch").
   - *Note: Our `.github/workflows/deploy.yml` workflow file will automatically build the site and deploy the `dist/` directory whenever you push to `main`.*

---

## 3. Add Repository Secrets

WanderSpot requires environment variables during the build to communicate with Supabase and Unsplash. Never commit live keys directly to public git repositories.

1. In your repository, go to **Settings > Secrets and variables > Actions**.
2. Click **New repository secret** and add the following three secrets:

| Secret Name | Description | Value Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase Project URL | `https://xyzproject.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase `anon` public key | `eyJhbGciOi...` |
| `VITE_UNSPLASH_ACCESS_KEY` | *(Optional)* Unsplash Access Key for admin cover picker | `AbCdEf123456...` |

*(If you do not have an Unsplash key, you can leave it empty; WanderSpot will allow manual image URL pasting inside the Admin spot editor).*

---

## 4. Trigger the Deployment

1. Make a commit or push to `main`, or go to the **Actions** tab on GitHub, select **Deploy WanderSpot to GitHub Pages**, and click **Run workflow**.
2. Wait for the workflow to complete (typically takes 1-2 minutes).
3. Once completed, your live site will be accessible at:
   `https://USERNAME.github.io/REPO_NAME/`

---

## 5. Configure Supabase Authentication Redirect URLs

Because WanderSpot uses email authentication and password resets, Supabase needs to know your live production URL:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **Authentication > URL Configuration**.
3. Set **Site URL** to:
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```
4. Under **Redirect URLs**, add the following entries:
   ```
   https://USERNAME.github.io/REPO_NAME/
   https://USERNAME.github.io/REPO_NAME/**
   http://localhost:5173/
   http://localhost:5173/**
   ```
5. Click **Save**.

### 💡 Email Confirmation Tip for Testing
In Supabase under **Authentication > Providers > Email**:
- While developing and testing, you may uncheck **"Confirm email"** so newly registered test accounts can sign in immediately without waiting for verification emails.
- **Important:** Be sure to turn **"Confirm email"** back on before inviting real public users to ensure email validity and security!

---

## 6. Password Reset Flow Details
When sending password reset emails, WanderSpot configures `redirectTo` to:
```js
redirectTo = window.location.origin + import.meta.env.BASE_URL;
```
Because the app uses `HashRouter`, the user will be redirected back to your GitHub Pages site root where the Supabase auth listener detects the reset token in the URL and securely updates their credentials.

---

## 7. Troubleshooting Guide

| Issue | Likely Cause | Resolution |
|---|---|---|
| **Blank white page after deployment** | Asset paths not using the repository subpath. | Verify that `vite.config.js` specifies `base: process.env.VITE_BASE || '/'` and that `deploy.yml` sets `VITE_BASE: /${{ github.event.repository.name }}/`. Clear browser cache. |
| **Refresh returns 404 error** | Standard browser history mode without server rewrites. | WanderSpot is built with `HashRouter` (`/#/spot/123`), which prevents 404s on static hosts. Additionally, `deploy.yml` copies `dist/index.html` to `dist/404.html` as a SPA fallback. |
| **Password reset link fails or redirects to localhost** | Supabase Site URL / Redirect URLs not updated. | In Supabase **Authentication > URL Configuration**, ensure `https://USERNAME.github.io/REPO_NAME/` is added to Site URL and Redirect URLs. |
| **Data or spots not loading** | Supabase database tables not created or RLS blocking. | Ensure you executed `supabase/schema.sql` and `supabase/seed.sql` in your Supabase SQL Editor. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in GitHub Secrets. |
| **Uploaded photos not displaying or failing to upload** | Supabase Storage bucket missing or private. | Ensure you executed `supabase/storage.sql`. Verify the `spot-photos` bucket is marked as **Public** in Supabase Storage dashboard. |
| **Locked search bar on landing page** | Working as designed. | The search bar on the landing page is intentionally locked. Click "User Login" or "Admin Login" to authenticate; the search bar unlocks immediately after login. |
