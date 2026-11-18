import { State } from '../state.js';
import { calculateCGPA, GRADING_SCALES } from '../calculator.js';

export function renderHome(navigateTo) {
  const container = document.getElementById('app-main');
  if (!container) return;

  const user = State.getUser();
  const scale = State.getScale();
  const semestersData = State.getSemesters();
  const cgpaResult = calculateCGPA(semestersData, scale);
  const scaleConfig = GRADING_SCALES[scale] || GRADING_SCALES['5.0'];

  container.className = "flex-grow flex flex-col view-enter";

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Left Hero Text -->
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <i class="fa-solid fa-sparkles"></i> Academic Excellence Tracker
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Master Your Grades with <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Precision</span>
          </h1>
          <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal">
            Calculate your semester GPAs and cumulative CGPA instantly. Supports both 5.0 and 4.0 grading scales, tracks degree classifications, and saves your progress locally.
          </p>
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="#semesters" data-route="semesters" class="px-6 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2">
              <i class="fa-solid fa-calculator"></i> Open Calculator
            </a>
            <a href="#profile" data-route="profile" class="px-6 py-3 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2">
              <i class="fa-solid fa-user-gear"></i> View Profile
            </a>
          </div>
        </div>

        <!-- Right Hero Live Snapshot Card -->
        <div class="lg:col-span-5">
          <div class="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            
            <div class="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-white">${user.name}</h3>
                  <p class="text-xs text-slate-400">${user.department} (${user.level})</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ${scale} Scale
              </span>
            </div>

            <div class="py-6 grid grid-cols-2 gap-4 text-center">
              <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span class="text-xs text-slate-400 block mb-1">Cumulative CGPA</span>
                <span class="text-3xl font-extrabold text-emerald-400">${cgpaResult.cgpa}</span>
                <span class="text-xs text-slate-500 block mt-1">out of ${scale}</span>
              </div>
              <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span class="text-xs text-slate-400 block mb-1">Total Units</span>
                <span class="text-3xl font-extrabold text-white">${cgpaResult.totalUnits}</span>
                <span class="text-xs text-slate-500 block mt-1">Credit Units</span>
              </div>
            </div>

            <div class="pt-2">
              <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span class="text-slate-400">Class of Degree:</span>
                <span class="font-bold text-emerald-400">${cgpaResult.classification ? cgpaResult.classification.title : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grading Scale Reference Table Section -->
    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Grading Scale Reference (${scale})</h2>
        <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Understand how letter grades convert to quality points and how degree classes are awarded.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Grades breakdown table -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-semibold text-sm text-slate-700 dark:text-slate-200 flex items-center justify-between">
            <span>Grade Point Equivalents</span>
            <span class="text-xs text-emerald-600 dark:text-emerald-400">${scaleConfig.name}</span>
          </div>
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900">
                <th class="px-6 py-3 font-semibold">Letter Grade</th>
                <th class="px-6 py-3 font-semibold">Points</th>
                <th class="px-6 py-3 font-semibold">Score Range</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${scaleConfig.grades.map(g => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="px-6 py-3 font-bold text-slate-900 dark:text-white">${g.grade}</td>
                  <td class="px-6 py-3 font-semibold text-emerald-600 dark:text-emerald-400">${g.points} pts</td>
                  <td class="px-6 py-3 text-slate-600 dark:text-slate-400">${g.min}% - ${g.max}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Classifications Table -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-semibold text-sm text-slate-700 dark:text-slate-200">
            Degree Classifications
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            ${scaleConfig.classifications.map(c => `
              <div class="px-6 py-4 flex items-center justify-between">
                <span class="font-medium text-slate-800 dark:text-slate-200 text-sm">${c.title}</span>
                <span class="px-3 py-1 rounded-full text-xs font-bold border ${c.color}">${c.min.toFixed(2)} - ${c.max.toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  container.querySelectorAll('a[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('data-route'));
    });
  });
}