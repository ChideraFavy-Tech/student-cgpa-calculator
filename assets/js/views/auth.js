import { State, showToast } from '../state.js';

export function renderAuth(navigateTo) {
  const container = document.getElementById('app-main');
  if (!container) return;

  const user = State.getUser();

  container.className = "flex-grow flex items-center justify-center py-12 px-4 view-enter bg-slate-50 dark:bg-slate-950";

  container.innerHTML = `
    <div class="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30 text-xl font-bold">
          <i class="fa-solid fa-user-graduate"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Student Portal Access</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Sign in to sync your courses and calculate your CGPA</p>
      </div>

      <!-- Quick Demo Login Banner -->
      <div class="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center space-y-2">
        <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">Want to test right away?</span>
        <button id="demo-login-btn" class="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors">
          <i class="fa-solid fa-bolt mr-1.5"></i> Load Demo Student Account
        </button>
      </div>

      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span class="flex-shrink mx-4 text-xs text-slate-400 uppercase">Or update profile details</span>
        <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <form id="auth-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input type="text" id="auth-name" value="${user.name || ''}" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Matriculation Number</label>
          <input type="text" id="auth-matric" value="${user.matricNumber || ''}" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <input type="text" id="auth-dept" value="${user.department || ''}" required class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Level</label>
            <select id="auth-level" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer">
              <option value="100L" ${user.level === '100L' ? 'selected' : ''}>100L</option>
              <option value="200L" ${user.level === '200L' ? 'selected' : ''}>200L</option>
              <option value="300L" ${user.level === '300L' ? 'selected' : ''}>300L</option>
              <option value="400L" ${user.level === '400L' ? 'selected' : ''}>400L</option>
              <option value="500L" ${user.level === '500L' ? 'selected' : ''}>500L</option>
            </select>
          </div>
        </div>

        <button type="submit" class="w-full py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md transition-colors">
          Save & Proceed to Calculator
        </button>
      </form>
    </div>
  `;

  document.getElementById('demo-login-btn').addEventListener('click', () => {
    State.login({
      name: 'Favour Adebayo',
      matricNumber: 'FUTO/2024/CSC/094',
      department: 'Computer Science',
      level: '200L',
      email: 'favour.adebayo@futo.edu.ng'
    });
    showToast('Demo student account loaded successfully!', 'success');
    navigateTo('semesters');
  });

  document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      isLoggedIn: true,
      name: document.getElementById('auth-name').value,
      matricNumber: document.getElementById('auth-matric').value,
      department: document.getElementById('auth-dept').value,
      level: document.getElementById('auth-level').value,
      email: user.email || 'student@futo.edu.ng'
    };
    State.saveUser(updated);
    showToast('Profile saved successfully!', 'success');
    navigateTo('semesters');
  });
}