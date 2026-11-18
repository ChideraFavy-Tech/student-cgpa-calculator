import { State } from './state.js';
import { renderHeader } from './views/components/header.js';
import { renderFooter } from './views/components/footer.js';
import { renderHome } from './views/home.js';
import { renderAuth } from './views/auth.js';
import { renderProfile } from './views/profile.js';
import { renderSemesters } from './views/semesters.js';

const ROUTES = {
  home: renderHome,
  auth: renderAuth,
  profile: renderProfile,
  semesters: renderSemesters
};

function applyInitialTheme() {
  const theme = State.getTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function navigateTo(route) {
  const targetRoute = ROUTES[route] ? route : 'home';
  window.location.hash = targetRoute;

  renderHeader(targetRoute, navigateTo);
  ROUTES[targetRoute](navigateTo);
  renderFooter();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  applyInitialTheme();
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash);
});

// Listen to browser back/forward buttons
window.addEventListener('hashchange', () => {
  const route = window.location.hash.replace('#', '') || 'home';
  navigateTo(route);
});