import { State, showToast } from '../state.js';
import { calculateCGPA, calculateSemesterGPA } from '../calculator.js';

export function renderProfile(navigateTo) {
  const container = document.getElementById('app-main');
  if (!container) return;

  const user = State.getUser();
  const scale = State.getScale();
  const semestersData = State.getSemesters();
  const cgpaResult = calculateCGPA(semestersData, scale);

  const levels = ['100L', '200L', '300L', '400L', '500L'];
  const levelSummaries = levels.map(lvl => {
    const lvlData = semestersData[lvl] || { first: [], second: [] };
    const firstCourses = Array.isArray(lvlData.first) ? lvlData.first : [];
    const secondCourses = Array.isArray(lvlData.second) ? lvlData.second : [];
    const first = calculateSemesterGPA(firstCourses, scale);
    const second = calculateSemesterGPA(secondCourses, scale);
    const totalUnits = first.totalUnits + second.totalUnits;
    const totalQP = first.totalQualityPoints + second.totalQualityPoints;
    const sessionGpa = totalUnits > 0 ? (totalQP / totalUnits).toFixed(2) : '0.00';

    return { level: lvl, first, second, sessionGpa, totalUnits };
  });

  container.className = "flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full view-enter";

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Student Info Card -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              ${(user.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">${user.name}</h2>
              <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">${user.matricNumber}</p>
              <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                ${user.level} • ${user.department}
              </span>
            </div>
          </div>

          <form id="profile-edit-form" class="pt-6 space-y-4">
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">Edit Student Information</h3>
            
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <input type="text" id="prof-name" value="${user.name || ''}" required class="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Matric Number</label>
              <input type="text" id="prof-matric" value="${user.matricNumber || ''}" required class="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Department</label>
                <input type="text" id="prof-dept" value="${user.department || ''}" required class="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current Level</label>
                <select id="prof-level" class="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer">
                  ${levels.map(l => `<option value="${l}" ${user.level === l ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Student Email</label>
              <input type="email" id="prof-email" value="${user.email || ''}" class="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors">
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <!-- Right Column: Academic Standing & Level Breakdown -->
      <div class="lg:col-span-7 space-y-6">
        <!-- CGPA Summary Banner -->
        <div class="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Cumulative Performance (${scale} Scale)</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-4xl sm:text-5xl font-extrabold text-white">${cgpaResult.cgpa}</span>
                <span class="text-slate-400 text-sm">/ ${scale}</span>
              </div>
              <p class="mt-2 text-sm text-slate-300">
                Standing: <strong class="text-emerald-400">${cgpaResult.classification ? cgpaResult.classification.title : 'N/A'}</strong>
              </p>
            </div>
            <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center min-w-[140px]">
              <span class="text-xs text-slate-400 block">Total Credits</span>
              <span class="text-2xl font-bold text-white">${cgpaResult.totalUnits}</span>
              <span class="text-xs text-slate-500 block mt-0.5">${cgpaResult.totalQualityPoints} Quality Pts</span>
            </div>
          </div>
        </div>

        <!-- Level-by-Level Performance Table -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Academic Session Breakdown</h3>
            <button id="go-calc-btn" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Manage Courses <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <th class="px-6 py-3 font-semibold">Level</th>
                  <th class="px-6 py-3 font-semibold">1st Sem GPA</th>
                  <th class="px-6 py-3 font-semibold">2nd Sem GPA</th>
                  <th class="px-6 py-3 font-semibold">Total Units</th>
                  <th class="px-6 py-3 font-semibold">Session GPA</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${levelSummaries.map(s => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="px-6 py-3.5 font-bold text-slate-900 dark:text-white">${s.level}</td>
                    <td class="px-6 py-3.5 text-slate-600 dark:text-slate-300">${s.first.totalUnits > 0 ? s.first.gpa : '-'}</td>
                    <td class="px-6 py-3.5 text-slate-600 dark:text-slate-300">${s.second.totalUnits > 0 ? s.second.gpa : '-'}</td>
                    <td class="px-6 py-3.5 text-slate-600 dark:text-slate-300">${s.totalUnits}</td>
                    <td class="px-6 py-3.5 font-bold ${s.totalUnits > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
                      ${s.totalUnits > 0 ? s.sessionGpa : '-'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('profile-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    State.saveUser({
      ...user,
      name: document.getElementById('prof-name').value.trim(),
      matricNumber: document.getElementById('prof-matric').value.trim(),
      department: document.getElementById('prof-dept').value.trim(),
      level: document.getElementById('prof-level').value,
      email: document.getElementById('prof-email').value.trim()
    });
    showToast('Student profile updated!', 'success');
    renderProfile(navigateTo);
  });

  document.getElementById('go-calc-btn').addEventListener('click', () => navigateTo('semesters'));
}