import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const profileLinks = document.querySelectorAll('[data-auth-only="profile"]');
const authButtons = document.querySelectorAll('[data-auth-toggle]');
const syncAuthNav = async () => {
  const { data } = await supabase.auth.getSession();
  const isSignedIn = Boolean(data.session);

  profileLinks.forEach((link) => {
    link.hidden = !isSignedIn;
  });

  authButtons.forEach((button) => {
    button.textContent = isSignedIn ? 'Logout' : 'Login';
    button.onclick = async () => {
      if (isSignedIn) {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
      } else {
        window.location.href = 'login.html';
      }
    };
  });

  if (!isSignedIn && window.location.pathname.endsWith('/profile.html')) {
    window.location.href = 'login.html';
  }
};

syncAuthNav();

export { supabase };
