import { State, showToast } from '../state.js';
import { calculateSemesterGPA, calculateCGPA, GRADING_SCALES, getGradePoints } from '../calculator.js';

let activeLevel = '100L';
let activeSemester = 'first';

export function renderSemesters(navigateTo) {
  const container = document.getElementById('app-main');
  if (!container) return;

  const scale = State.getScale();
  const semestersData = State.getSemesters();
  const scaleConfig = GRADING_SCALES[scale] || GRADING_SCALES['5.0'];

  // Ensure level & semester arrays exist
  if (!semestersData[activeLevel]) {
    semestersData[activeLevel] = { first: [], second: [] };
  }
  if (!Array.isArray(semestersData[activeLevel].first)) {
    semestersData[activeLevel].first = [];
  }
  if (!Array.isArray(semestersData[activeLevel].second)) {
    semestersData[activeLevel].second = [];
  }

  const currentCourses = semestersData[activeLevel][activeSemester];
  const semStats = calculateSemesterGPA(currentCourses, scale);
  const cgpaStats = calculateCGPA(semestersData, scale);

  const levels = ['100L', '200L', '300L', '400L', '500L'];

  container.className = "flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full view-enter space-y-6";

  container.innerHTML = `
    <!-- Top Summary Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Current Semester GPA</span>
          <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">${semStats.gpa}</div>
          <span class="text-xs text-slate-500">${semStats.totalUnits} Units • ${semStats.totalQualityPoints} Quality Pts</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
          <i class="fa-solid fa-book-open"></i>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Cumulative CGPA (${scale})</span>
          <div class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">${cgpaStats.cgpa}</div>
          <span class="text-xs text-slate-500">${cgpaStats.totalUnits} Total Units</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
          <i class="fa-solid fa-award"></i>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Degree Classification</span>
        <div class="my-1">
          <span class="inline-block px-3 py-1 rounded-lg text-xs font-bold border ${cgpaStats.classification ? cgpaStats.classification.color : ''}">
            ${cgpaStats.classification ? cgpaStats.classification.title : 'N/A'}
          </span>
        </div>
        <button id="copy-report-btn" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline text-left mt-1">
          <i class="fa-regular fa-copy mr-1"></i> Copy Summary Report
        </button>
      </div>
    </div>

    <!-- Level Selector & Semester Tabs -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <!-- Level Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          ${levels.map(lvl => `
            <button data-level="${lvl}" class="level-btn px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${activeLevel === lvl ? 'bg-slate-900 text-white dark:bg-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}">
              ${lvl}
            </button>
          `).join('')}
        </div>

        <!-- Semester Toggle -->
        <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button data-sem="first" class="sem-btn px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeSemester === 'first' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
            First Semester
          </button>
          <button data-sem="second" class="sem-btn px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeSemester === 'second' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
            Second Semester
          </button>
        </div>
      </div>

      <!-- Add Course Form -->
      <form id="add-course-form" class="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div class="sm:col-span-3">
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Course Code *</label>
          <input type="text" id="course-code" placeholder="e.g. CSC 201" required class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>
        <div class="sm:col-span-4">
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Course Title (Optional)</label>
          <input type="text" id="course-title" placeholder="e.g. Computer Programming I" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Credit Units *</label>
          <input type="number" id="course-units" min="1" max="15" value="3" required class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>
        <div class="sm:col-span-3 flex items-end gap-2">
          <div class="flex-grow">
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Grade *</label>
            <select id="course-grade" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer">
              ${scaleConfig.grades.map(g => `<option value="${g.grade}">${g.grade} (${g.points} pts)</option>`).join('')}
            </select>
          </div>
          <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors h-[38px] flex items-center gap-1.5">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </form>

      <!-- Courses Table -->
      <div class="overflow-x-auto">
        ${currentCourses.length === 0 ? `
          <div class="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center text-lg mb-3">
              <i class="fa-solid fa-folder-open"></i>
            </div>
            <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">No courses added for ${activeLevel} (${activeSemester === 'first' ? 'First' : 'Second'} Semester)</h4>
            <p class="text-xs text-slate-500 mt-1">Use the form above to add your registered courses and calculate your GPA.</p>
          </div>
        ` : `
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40">
                <th class="px-4 py-3 font-semibold">Course Code</th>
                <th class="px-4 py-3 font-semibold">Course Title</th>
                <th class="px-4 py-3 font-semibold text-center">Units</th>
                <th class="px-4 py-3 font-semibold text-center">Grade</th>
                <th class="px-4 py-3 font-semibold text-center">Quality Pts</th>
                <th class="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${currentCourses.map(course => {
                const pts = getGradePoints(course.grade, scale);
                const qp = pts * (parseFloat(course.units) || 0);
                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">${course.code}</td>
                    <td class="px-4 py-3 text-slate-600 dark:text-slate-300">${course.title || '-'}</td>
                    <td class="px-4 py-3 text-center font-medium">${course.units}</td>
                    <td class="px-4 py-3 text-center">
                      <select data-id="${course.id}" class="inline-grade-select px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs cursor-pointer">
                        ${scaleConfig.grades.map(g => `<option value="${g.grade}" ${course.grade === g.grade ? 'selected' : ''}>${g.grade}</option>`).join('')}
                      </select>
                    </td>
                    <td class="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">${qp}</td>
                    <td class="px-4 py-3 text-right">
                      <button data-id="${course.id}" class="delete-course-btn text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Remove Course">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;

  // Level Switcher
  container.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeLevel = btn.getAttribute('data-level');
      renderSemesters(navigateTo);
    });
  });

  // Semester Switcher
  container.querySelectorAll('.sem-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSemester = btn.getAttribute('data-sem');
      renderSemesters(navigateTo);
    });
  });

  // Add Course
  document.getElementById('add-course-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('course-code').value.trim().toUpperCase();
    const title = document.getElementById('course-title').value.trim();
    const units = parseInt(document.getElementById('course-units').value, 10);
    const grade = document.getElementById('course-grade').value;

    if (!code || isNaN(units) || units <= 0) return;

    const updatedSemesters = State.getSemesters();
    if (!updatedSemesters[activeLevel]) updatedSemesters[activeLevel] = { first: [], second: [] };
    if (!Array.isArray(updatedSemesters[activeLevel][activeSemester])) updatedSemesters[activeLevel][activeSemester] = [];

    updatedSemesters[activeLevel][activeSemester].push({
      id: Date.now().toString(),
      code,
      title,
      units,
      grade
    });

    State.saveSemesters(updatedSemesters);
    showToast(`${code} added!`, 'success');
    renderSemesters(navigateTo);
  });

  // Inline Grade Edit
  container.querySelectorAll('.inline-grade-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const courseId = select.getAttribute('data-id');
      const newGrade = e.target.value;
      const updatedSemesters = State.getSemesters();
      const list = updatedSemesters[activeLevel][activeSemester];
      const target = list.find(c => c.id === courseId);
      if (target) {
        target.grade = newGrade;
        State.saveSemesters(updatedSemesters);
        showToast(`Updated ${target.code} grade to ${newGrade}`, 'info');
        renderSemesters(navigateTo);
      }
    });
  });

  // Delete Course
  container.querySelectorAll('.delete-course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-id');
      const updatedSemesters = State.getSemesters();
      updatedSemesters[activeLevel][activeSemester] = updatedSemesters[activeLevel][activeSemester].filter(c => c.id !== courseId);
      State.saveSemesters(updatedSemesters);
      showToast('Course removed', 'info');
      renderSemesters(navigateTo);
    });
  });

  // Copy Report
  document.getElementById('copy-report-btn').addEventListener('click', () => {
    const user = State.getUser();
    const summaryText = `AcadTrack Academic Summary\nStudent: ${user.name} (${user.matricNumber})\nDepartment: ${user.department} | Level: ${user.level}\nScale: ${scale}\nCurrent Semester (${activeLevel} - ${activeSemester === 'first' ? '1st' : '2nd'}): ${semStats.gpa} GPA (${semStats.totalUnits} Units)\nCumulative CGPA: ${cgpaStats.cgpa} / ${scale}\nClass of Degree: ${cgpaStats.classification ? cgpaStats.classification.title : 'N/A'}`;
    navigator.clipboard.writeText(summaryText).then(() => {
      showToast('Summary copied to clipboard!', 'success');
    });
  });
}