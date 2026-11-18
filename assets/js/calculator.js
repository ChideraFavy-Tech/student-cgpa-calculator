// GPA & CGPA Calculator Engine supporting 5.0 and 4.0 Grading Scales

export const GRADING_SCALES = {
  '5.0': {
    name: '5.0 Scale (Standard Nigerian University)',
    grades: [
      { grade: 'A', points: 5, min: 70, max: 100 },
      { grade: 'B', points: 4, min: 60, max: 69 },
      { grade: 'C', points: 3, min: 50, max: 59 },
      { grade: 'D', points: 2, min: 45, max: 49 },
      { grade: 'E', points: 1, min: 40, max: 44 },
      { grade: 'F', points: 0, min: 0, max: 39 }
    ],
    classifications: [
      { min: 4.50, max: 5.00, title: 'First Class Honours', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' },
      { min: 3.50, max: 4.49, title: 'Second Class Honours (Upper Division)', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800' },
      { min: 2.40, max: 3.49, title: 'Second Class Honours (Lower Division)', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800' },
      { min: 1.50, max: 2.39, title: 'Third Class Honours', color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800' },
      { min: 1.00, max: 1.49, title: 'Pass', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
      { min: 0.00, max: 0.99, title: 'Fail', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800' }
    ]
  },
  '4.0': {
    name: '4.0 Scale (US / Standard Scale)',
    grades: [
      { grade: 'A', points: 4, min: 70, max: 100 },
      { grade: 'B', points: 3, min: 60, max: 69 },
      { grade: 'C', points: 2, min: 50, max: 59 },
      { grade: 'D', points: 1, min: 40, max: 49 },
      { grade: 'F', points: 0, min: 0, max: 39 }
    ],
    classifications: [
      { min: 3.50, max: 4.00, title: 'Summa Cum Laude / First Class', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' },
      { min: 3.00, max: 3.49, title: 'Magna Cum Laude / Second Upper', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800' },
      { min: 2.00, max: 2.99, title: 'Cum Laude / Second Lower', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800' },
      { min: 1.00, max: 1.99, title: 'Pass', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
      { min: 0.00, max: 0.99, title: 'Fail', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800' }
    ]
  }
};

/**
 * Get grade point for a letter grade on a given scale
 */
export function getGradePoints(letterGrade, scale = '5.0') {
  const scaleConfig = GRADING_SCALES[scale] || GRADING_SCALES['5.0'];
  const found = scaleConfig.grades.find(g => g.grade.toUpperCase() === letterGrade.toUpperCase());
  return found ? found.points : 0;
}

/**
 * Calculate GPA for a single semester/array of courses
 * Course format: { code: 'MTH 101', units: 3, grade: 'A' }
 */
export function calculateSemesterGPA(courses, scale = '5.0') {
  let totalUnits = 0;
  let totalQualityPoints = 0;

  if (!Array.isArray(courses) || courses.length === 0) {
    return { gpa: '0.00', totalUnits: 0, totalQualityPoints: 0 };
  }

  courses.forEach(c => {
    const units = parseFloat(c.units) || 0;
    const points = getGradePoints(c.grade, scale);
    if (units > 0) {
      totalUnits += units;
      totalQualityPoints += units * points;
    }
  });

  const gpa = totalUnits === 0 ? 0 : totalQualityPoints / totalUnits;
  return {
    gpa: gpa.toFixed(2),
    totalUnits,
    totalQualityPoints
  };
}

/**
 * Calculate cumulative CGPA across all stored semesters/levels
 */
export function calculateCGPA(semestersData, scale = '5.0') {
  let cumulativeUnits = 0;
  let cumulativeQualityPoints = 0;

  if (!semestersData) return { cgpa: '0.00', totalUnits: 0, totalQualityPoints: 0, classification: null };

  Object.values(semestersData).forEach(levelSemesters => {
    // levelSemesters has { first: [...], second: [...] }
    ['first', 'second'].forEach(semKey => {
      const courses = levelSemesters[semKey] || [];
      const res = calculateSemesterGPA(courses, scale);
      cumulativeUnits += res.totalUnits;
      cumulativeQualityPoints += res.totalQualityPoints;
    });
  });

  const cgpaNum = cumulativeUnits === 0 ? 0 : cumulativeQualityPoints / cumulativeUnits;
  const classification = getDegreeClassification(cgpaNum, scale);

  return {
    cgpa: cgpaNum.toFixed(2),
    totalUnits: cumulativeUnits,
    totalQualityPoints: cumulativeQualityPoints,
    classification
  };
}

/**
 * Get degree classification based on CGPA and scale
 */
export function getDegreeClassification(cgpa, scale = '5.0') {
  const scaleConfig = GRADING_SCALES[scale] || GRADING_SCALES['5.0'];
  const val = parseFloat(cgpa) || 0;
  const match = scaleConfig.classifications.find(c => val >= c.min && val <= c.max);
  return match || scaleConfig.classifications[scaleConfig.classifications.length - 1];
}