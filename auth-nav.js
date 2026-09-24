import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

const profileLinks = document.querySelectorAll('[data-auth-only="profile"]');
const authButtons = document.querySelectorAll('[data-auth-toggle]');
const syncAuthNav = async () => {
  if (!supabase) {
    authButtons.forEach((button) => {
      button.textContent = 'Login';
      if (button.tagName !== 'A') {
        button.onclick = () => {
          window.location.href = 'login.html';
        };
      }
    });
    return;
  }

  const { data } = await supabase.auth.getSession();
  const isSignedIn = Boolean(data.session);

  profileLinks.forEach((link) => {
    link.hidden = !isSignedIn;
  });

  authButtons.forEach((button) => {
    button.textContent = isSignedIn ? 'Logout' : 'Login';
    button.onclick = async (event) => {
      if (isSignedIn) {
        event.preventDefault();
        await supabase.auth.signOut();
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
