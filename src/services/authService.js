import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Local storage key for fallback demo session
const LOCAL_AUTH_KEY = 'wanderspot_demo_session';

// Recognized administrator emails
const ADMIN_EMAILS = [
  'suryadey5507@gmail.com',
  'mayukhdey9920.apple@gmail.com',
];

export function isEmailAdmin(email, role) {
  if (role === 'admin') return true;
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Helper to get demo session from localStorage
 */
function getLocalDemoSession() {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Helper to save demo session to localStorage
 */
function setLocalDemoSession(user) {
  if (user) {
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_AUTH_KEY);
  }
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, fullName }) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  }

  // Fallback demo mode
  const isDemoAdmin = isEmailAdmin(email);
  const demoUser = {
    id: isDemoAdmin ? 'demo-admin-id' : ('demo-user-' + Math.random().toString(36).substring(2, 9)),
    email,
    user_metadata: { full_name: isDemoAdmin ? 'Surya Dey (Admin)' : (fullName || email.split('@')[0]) },
    profile: {
      full_name: isDemoAdmin ? 'Surya Dey (Admin)' : (fullName || email.split('@')[0]),
      role: isDemoAdmin ? 'admin' : 'user',
    },
  };
  setLocalDemoSession(demoUser);
  return { user: demoUser, session: { user: demoUser } };
}

/**
 * Sign in user with email and password
 */
export async function signIn({ email, password }) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Fetch user profile to verify role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    const isAdminEmail = isEmailAdmin(data.user.email, profile?.role);
    const resolvedProfile = profile || {
      id: data.user.id,
      full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
      role: isAdminEmail ? 'admin' : 'user',
    };

    if (isAdminEmail) {
      resolvedProfile.role = 'admin';
    }

    return {
      user: data.user,
      session: data.session,
      profile: resolvedProfile,
    };
  }

  // Fallback demo mode
  const isDemoAdmin = isEmailAdmin(email);
  const demoUser = {
    id: isDemoAdmin ? 'demo-admin-id' : 'demo-user-id',
    email,
    user_metadata: { full_name: isDemoAdmin ? 'Surya Dey (Admin)' : email.split('@')[0] },
    profile: {
      full_name: isDemoAdmin ? 'Surya Dey (Admin)' : email.split('@')[0],
      role: isDemoAdmin ? 'admin' : 'user',
    },
  };
  setLocalDemoSession(demoUser);
  return { user: demoUser, session: { user: demoUser }, profile: demoUser.profile };
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  setLocalDemoSession(null);
  return true;
}

/**
 * Reset password via email
 */
export async function resetPassword(email) {
  if (isSupabaseConfigured()) {
    const redirectTo = window.location.origin + import.meta.env.BASE_URL;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return data;
  }
  return { message: 'Password reset link sent (demo mode simulated).' };
}

/**
 * Get current session and profile
 */
export async function getCurrentUser() {
  if (isSupabaseConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const isAdminEmail = isEmailAdmin(user.email, profile?.role);
    const resolvedProfile = profile || {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      role: isAdminEmail ? 'admin' : 'user',
    };

    if (isAdminEmail) {
      resolvedProfile.role = 'admin';
    }

    return {
      ...user,
      profile: resolvedProfile,
    };
  }

  return getLocalDemoSession();
}

/**
 * Fetch profile by user ID
 */
export async function getUserProfile(userId) {
  if (isSupabaseConfigured() && userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  }
  return { role: 'user', full_name: 'Travel Enthusiast' };
}
