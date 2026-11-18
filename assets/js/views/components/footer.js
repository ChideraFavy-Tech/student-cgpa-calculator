export function renderFooter() {
  const footerEl = document.getElementById('app-footer');
  if (!footerEl) return;

  footerEl.className = "bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400";

  footerEl.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">A</div>
        <span class="font-semibold text-slate-700 dark:text-slate-200">AcadTrack CGPA Calculator</span>
        <span>&copy; ${new Date().getFullYear()}</span>
      </div>
      <p>Built with HTML, Tailwind CSS & Vanilla JavaScript for undergraduate success.</p>
    </div>
  `;
}