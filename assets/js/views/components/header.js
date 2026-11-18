import { State } from '../../state.js';

export function renderHeader(currentRoute, navigateTo) {
  const user = State.getUser();
  const currentScale = State.getScale();
  const currentTheme = State.getTheme();
  
  const headerEl = document.getElementById('app-header');
  if (!headerEl) return;

  headerEl.className = "sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors";

  headerEl.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo & Brand -->
      <a href="#home" data-route="home" class="flex items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
          <i class="fa-solid fa-graduation-cap text-lg"></i>
        </div>
        <div>
          <span class="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            Acad<span class="text-emerald-600 dark:text-emerald-400">Track</span>
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400 block -mt-1">CGPA Calculator</span>
        </div>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-1">
        <a href="#home" data-route="home" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'home' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i class="fa-solid fa-house mr-1.5 text-xs"></i> Home
        </a>
        <a href="#semesters" data-route="semesters" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'semesters' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i class="fa-solid fa-calculator mr-1.5 text-xs"></i> Calculator & Semesters
        </a>
        <a href="#profile" data-route="profile" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'profile' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
          <i class="fa-solid fa-user-gear mr-1.5 text-xs"></i> Profile
        </a>
      </nav>

      <!-- Right Actions (Scale Selector, Theme Toggle, Auth) -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Scale Switcher -->
        <select id="scale-selector" class="text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
          <option value="5.0" ${currentScale === '5.0' ? 'selected' : ''}>5.0 Scale (Nigeria)</option>
          <option value="4.0" ${currentScale === '4.0' ? 'selected' : ''}>4.0 Scale (US / Standard)</option>
        </select>

        <!-- Theme Toggle -->
        <button id="theme-toggle" class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Toggle Theme">
          <i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-slate-700'}"></i>
        </button>

        <!-- Auth Button -->
        ${user.isLoggedIn ? `
          <button id="logout-btn" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        ` : `
          <a href="#auth" data-route="auth" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In
          </a>
        `}

        <!-- Mobile Menu Hamburger -->
        <button id="mobile-menu-btn" class="md:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
          <i class="fa-solid fa-bars text-base"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
      <a href="#home" data-route="home" class="block px-3 py-2 rounded-lg text-sm font-medium ${currentRoute === 'home' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}">
        <i class="fa-solid fa-house mr-2"></i> Home
      </a>
      <a href="#semesters" data-route="semesters" class="block px-3 py-2 rounded-lg text-sm font-medium ${currentRoute === 'semesters' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}">
        <i class="fa-solid fa-calculator mr-2"></i> Calculator & Semesters
      </a>
      <a href="#profile" data-route="profile" class="block px-3 py-2 rounded-lg text-sm font-medium ${currentRoute === 'profile' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}">
        <i class="fa-solid fa-user-gear mr-2"></i> Profile
      </a>
      ${user.isLoggedIn ? `
        <button id="mobile-logout-btn" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50">
          <i class="fa-solid fa-right-from-bracket mr-2"></i> Sign Out
        </button>
      ` : `
        <a href="#auth" data-route="auth" class="block px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white text-center">
          Sign In / Register
        </a>
      `}
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('scale-selector').addEventListener('change', (e) => {
    State.setScale(e.target.value);
    navigateTo(currentRoute);
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const newTheme = State.getTheme() === 'dark' ? 'light' : 'dark';
    State.setTheme(newTheme);
    applyTheme(newTheme);
    navigateTo(currentRoute);
  });

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  [logoutBtn, mobileLogoutBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        State.logout();
        navigateTo('auth');
      });
    }
  });

  // Handle route navigation link clicks
  headerEl.querySelectorAll('a[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (mobileMenu) mobileMenu.classList.add('hidden');
      navigateTo(route);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}