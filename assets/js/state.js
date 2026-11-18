// Centralized Application State Management with localStorage

const STORAGE_KEYS = {
  USER: 'acadtrack_user',
  SEMESTERS: 'acadtrack_semesters',
  SCALE: 'acadtrack_scale',
  THEME: 'acadtrack_theme'
};

// Default Sample Data for Demo Student
const DEFAULT_DEMO_USER = {
  isLoggedIn: true,
  name: 'Favour Adebayo',
  matricNumber: 'FUTO/2024/CSC/094',
  department: 'Computer Science',
  faculty: 'School of Information and Communication Technology (SICT)',
  level: '200L',
  email: 'favour.adebayo@futo.edu.ng'
};

const DEFAULT_SEMESTERS = {
  '100L': {
    first: [
      { id: '101', code: 'MTH 101', title: 'Elementary Mathematics I', units: 3, grade: 'A' },
      { id: '102', code: 'CHM 101', title: 'General Chemistry I', units: 3, grade: 'B' },
      { id: '103', code: 'PHY 101', title: 'General Physics I', units: 3, grade: 'A' },
      { id: '104', code: 'GST 101', title: 'Use of English I', units: 2, grade: 'A' },
      { id: '105', code: 'CSC 101', title: 'Introduction to Computer Science', units: 3, grade: 'A' }
    ],
    second: [
      { id: '201', code: 'MTH 102', title: 'Elementary Mathematics II', units: 3, grade: 'B' },
      { id: '202', code: 'PHY 102', title: 'General Physics II', units: 3, grade: 'A' },
      { id: '203', code: 'GST 102', title: 'Communication in English', units: 2, grade: 'A' },
      { id: '204', code: 'COS 102', title: 'Introduction to Problem Solving', units: 3, grade: 'A' }
    ]
  },
  '200L': {
    first: [
      { id: '301', code: 'CSC 201', title: 'Computer Programming I', units: 3, grade: 'A' },
      { id: '302', code: 'CSC 203', title: 'Discrete Structures', units: 3, grade: 'B' },
      { id: '303', code: 'IFT 203', title: 'Introduction to Web Technology', units: 3, grade: 'A' },
      { id: '304', code: 'MTH 201', title: 'Mathematical Methods', units: 3, grade: 'B' }
    ],
    second: []
  },
  '300L': { first: [], second: [] },
  '400L': { first: [], second: [] },
  '500L': { first: [], second: [] }
};

class StateManager {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_DEMO_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SEMESTERS)) {
      localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(DEFAULT_SEMESTERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCALE)) {
      localStorage.setItem(STORAGE_KEYS.SCALE, '5.0');
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  }

  saveUser(userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('acadtrack:state-changed', { detail: { type: 'user', data: userData } }));
  }

  getSemesters() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SEMESTERS)) || DEFAULT_SEMESTERS;
    } catch {
      return DEFAULT_SEMESTERS;
    }
  }

  saveSemesters(semestersData) {
    localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(semestersData));
    window.dispatchEvent(new CustomEvent('acadtrack:state-changed', { detail: { type: 'semesters', data: semestersData } }));
  }

  getScale() {
    return localStorage.getItem(STORAGE_KEYS.SCALE) || '5.0';
  }

  setScale(scale) {
    localStorage.setItem(STORAGE_KEYS.SCALE, scale);
    window.dispatchEvent(new CustomEvent('acadtrack:state-changed', { detail: { type: 'scale', data: scale } }));
  }

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    window.dispatchEvent(new CustomEvent('acadtrack:state-changed', { detail: { type: 'theme', data: theme } }));
  }

  logout() {
    const user = this.getUser();
    user.isLoggedIn = false;
    this.saveUser(user);
  }

  login(userData) {
    this.saveUser({ ...userData, isLoggedIn: true });
  }
}

export const State = new StateManager();

// Helper for Toast Notifications
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white';
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg font-medium text-sm transition-all duration-300 translate-y-2 opacity-0 ${bgClass}`;
  toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i><span>${message}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}