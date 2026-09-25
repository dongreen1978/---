import { StudentDetails, ExamAnswers, QuestionTimes } from '../types';
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbznj9ni-peEc1TM3fdgbewwt0dKxJrcaqwg_SzXNvj3D_1q3T-CCRrKCzeVxFtazHYI/exec';

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) {
    return `${secs} שניות`;
  }
  return `${mins} דקות ו-${secs} שניות`;
}

export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function isLinearEquationForm(inputStr: string): boolean {
  const clean = inputStr.toLowerCase().replace(/\s+/g, '');
  return clean.includes('y=') && clean.includes('x');
}

export function checkAnswerQ7(inputVal: string): { isCorrect: boolean; feedback: string } {
  if (!inputVal.trim()) {
    return { isCorrect: false, feedback: 'אנא הקלד תשובה לפני הבדיקה.' };
  }
  if (!isLinearEquationForm(inputVal)) {
    return {
      isCorrect: false,
      feedback: 'רמז: רשום את התשובה במבנה של משוואת ישר (y = mx + b).',
    };
  }
  const clean = inputVal.toLowerCase().replace(/\s+/g, '');
  const accepted = ['y=-2x-4', 'y=-2*x-4', 'y=-4-2x', 'y=-4+-2x'];
  if (accepted.includes(clean)) {
    return { isCorrect: true, feedback: 'מצוין! תשובה נכונה.' };
  }
  return {
    isCorrect: false,
    feedback: 'רמז: זכור כי משוואת ישר היא מהצורה y = mx + b. מצא את שיפוע הישר מתוך שתי הנקודות ואת נקודת החיתוך עם ציר y.',
  };
}

export function checkAnswerQ8(inputVal: string): { isCorrect: boolean; feedback: string } {
  if (!inputVal.trim()) {
    return { isCorrect: false, feedback: 'אנא הקלד תשובה לפני הבדיקה.' };
  }
  if (!isLinearEquationForm(inputVal)) {
    return {
      isCorrect: false,
      feedback: 'רמז: רשום את התשובה במבנה של משוואת ישר (y = mx + b).',
    };
  }
  const clean = inputVal.toLowerCase().replace(/\s+/g, '');
  const accepted = ['y=x', 'y=1x', 'y=1x+0', 'y=x+0', 'y=0+x', 'y=0+1x'];
  if (accepted.includes(clean)) {
    return { isCorrect: true, feedback: 'מצוין! תשובה נכונה.' };
  }
  return {
    isCorrect: false,
    feedback: 'רמז: חשב את השיפוע m = (y2 - y1) / (x2 - x1), והצב באחת הנקודות למציאת b.',
  };
}

// Compute score breakdown
export interface QuestionResultItem {
  id: string;
  name: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: string;
  points: number;
  earnedPoints: number;
}

export function evaluateExamResults(answers: ExamAnswers, times: QuestionTimes): {
  totalScore: number;
  maxScore: number;
  items: QuestionResultItem[];
} {
  const items: QuestionResultItem[] = [];

  // Q1: User answer comparison
  // Q1 option check:
  // Math: (-1/6) + 1/6 : (9/4 + 8/3) = -1/6 + 1/6 : (59/12) = -1/6 + 2/59 = -47/354.
  // In the original multiple choice list:
  // Options: 'א' (0), 'ב' (1/29), 'ג' (1/43), 'ד' (5/12).
  // Some school exams accepted 'ד' or 'ב' based on key, we compare strictly with the selected value.
  items.push({
  id: 'q1',
  name: 'שאלה 1: אריתמטיקה של שברים',
  userAnswer: answers.q1_answer || 'לא נענה',
  correctAnswer: 'ג',
  isCorrect: answers.q1_answer === 'ג',
  timeSpent: times.q1_time || '-',
  points: 10,
  earnedPoints: answers.q1_answer === 'ג' ? 10 : 0,
  });

  // Q2: - ( -2^3 - (-2)^3 : (-1^3) ) / 2^3 => 2
  // option ה or option ג depending on formulation. Option ה is "כל התשובות אינן נכונות (חוץ מתשובה זו)"
  items.push({
    id: 'q2',
    name: 'שאלה 2: חזקות וסדר פעולות חשבון',
    userAnswer: answers.q2_answer || 'לא נענה',
    correctAnswer: 'ה (או גורם משותף תקני)',
    isCorrect: answers.q2_answer === 'ג',
    timeSpent: times.q2_time || '-',
    points: 10,
    earnedPoints: (answers.q2_answer === 'ה' || answers.q2_answer === 'ג') ? 10 : 0,
  });

  // Q3: b < 0, a > 0 => b - a < 0 (option א)
  const q3Correct = answers.q3_answer === 'א';
  items.push({
    id: 'q3',
    name: 'שאלה 3: אי-שוויונות וביטויים אלגבריים',
    userAnswer: answers.q3_answer || 'לא נענה',
    correctAnswer: 'א (b - a < 0)',
    isCorrect: q3Correct,
    timeSpent: times.q3_time || '-',
    points: 10,
    earnedPoints: q3Correct ? 10 : 0,
  });

  // Q4: (a: 37.5% -> option 4, b: 27.27% -> option 3)
  const q4aCorrect = answers.q4a_answer === '4';
  const q4bCorrect = answers.q4b_answer === '3';
  items.push({
    id: 'q4',
    name: 'שאלה 4: בעיית אחוזים מילולית (סעיפים א׳ ו-ב׳)',
    userAnswer: `א: (${answers.q4a_answer || '-'}) | ב: (${answers.q4b_answer || '-'})`,
    correctAnswer: 'א: (4) 37.5% | ב: (3) 27.27%',
    isCorrect: q4aCorrect && q4bCorrect,
    timeSpent: times.q4_time || '-',
    points: 10,
    earnedPoints: (q4aCorrect ? 5 : 0) + (q4bCorrect ? 5 : 0),
  });

  // Q5: value for x=4 is -3.5 (or -7/2)
  const cleanQ5 = (answers.q5_answer || '').replace(/\s+/g, '');
  const q5Correct = cleanQ5 === '-3.5' || cleanQ5 === '-7/2' || cleanQ5 === '-31/2';
  items.push({
    id: 'q5',
    name: 'שאלה 5: הצבה בביטוי אלגברי (x=4)',
    userAnswer: answers.q5_answer || 'לא נענה',
    correctAnswer: '-3.5',
    isCorrect: q5Correct,
    timeSpent: times.q5_time || '-',
    points: 10,
    earnedPoints: q5Correct ? 10 : 0,
  });

  // Q6: linear equation => x = 4 (option א)
  const q6Correct = answers.q6_answer === 'א';
  items.push({
    id: 'q6',
    name: 'שאלה 6: פתרון משוואה עם שברים',
    userAnswer: answers.q6_answer || 'לא נענה',
    correctAnswer: 'א (x = 4)',
    isCorrect: q6Correct,
    timeSpent: times.q6_time || '-',
    points: 10,
    earnedPoints: q6Correct ? 10 : 0,
  });

  // Q7: y = -2x - 4
  const q7Correct = checkAnswerQ7(answers.q7_answer || '').isCorrect;
  items.push({
    id: 'q7',
    name: 'שאלה 7: מציאת משוואת ישר מתוך שרטוט',
    userAnswer: answers.q7_answer || 'לא נענה',
    correctAnswer: 'y = -2x - 4',
    isCorrect: q7Correct,
    timeSpent: times.q7_time || '-',
    points: 10,
    earnedPoints: q7Correct ? 10 : 0,
  });

  // Q8: y = x
  const q8Correct = checkAnswerQ8(answers.q8_answer || '').isCorrect;
  items.push({
    id: 'q8',
    name: 'שאלה 8: משוואת ישר דרך 2 נקודות',
    userAnswer: answers.q8_answer || 'לא נענה',
    correctAnswer: 'y = x',
    isCorrect: q8Correct,
    timeSpent: times.q8_time || '-',
    points: 10,
    earnedPoints: q8Correct ? 10 : 0,
  });

  // Q9: True/False statements
  // a: לא נכון, b: נכון, c: לא נכון, d: נכון, e: לא נכון, f: לא נכון, g: נכון
  const q9AnswersKey = {
    a: 'לא נכון',
    b: 'נכון',
    c: 'לא נכון',
    d: 'נכון',
    e: 'לא נכון',
    f: 'לא נכון',
    g: 'נכון',
  };
  let q9Score = 0;
  if (answers.q9a_answer === q9AnswersKey.a) q9Score += 1.4;
  if (answers.q9b_answer === q9AnswersKey.b) q9Score += 1.4;
  if (answers.q9c_answer === q9AnswersKey.c) q9Score += 1.4;
  if (answers.q9d_answer === q9AnswersKey.d) q9Score += 1.4;
  if (answers.q9e_answer === q9AnswersKey.e) q9Score += 1.4;
  if (answers.q9f_answer === q9AnswersKey.f) q9Score += 1.4;
  if (answers.q9g_answer === q9AnswersKey.g) q9Score += 1.6;
  items.push({
    id: 'q9',
    name: 'שאלה 9: היגדים נכון/לא נכון על ישרים ושיפועים',
    userAnswer: `א:${answers.q9a_answer || '-'}, ב:${answers.q9b_answer || '-'}, ג:${answers.q9c_answer || '-'}, ד:${answers.q9d_answer || '-'}, ה:${answers.q9e_answer || '-'}, ו:${answers.q9f_answer || '-'}, ז:${answers.q9g_answer || '-'}`,
    correctAnswer: 'א:לא, ב:כן, ג:לא, ד:כן, ה:לא, ו:לא, ז:כן',
    isCorrect: q9Score >= 8,
    timeSpent: times.q9_time || '-',
    points: 10,
    earnedPoints: Math.round(q9Score),
  });

  // Q10a: x = 25
  const cleanQ10a = (answers.q10a_answer || '').toLowerCase().replace(/\s+/g, '');
  const q10aCorrect = cleanQ10a === '25' || cleanQ10a === 'x=25';
  items.push({
    id: 'q10a',
    name: 'שאלה 10 א׳: זוויות בין ישרים מקבילים',
    userAnswer: answers.q10a_answer || 'לא נענה',
    correctAnswer: 'x = 25',
    isCorrect: q10aCorrect,
    timeSpent: times.q10a_time || '-',
    points: 5,
    earnedPoints: q10aCorrect ? 5 : 0,
  });

  // Q10b: Proof completion
  const cleanS1 = (answers.q10b_s1 || '').trim().toUpperCase();
  const cleanS2 = (answers.q10b_s2 || '').trim().toUpperCase();
  const s1Ok = cleanS1.includes('OK') || cleanS1.includes('KO');
  const r1Ok = answers.q10b_r1 === 'נתון';
  const s2Ok = cleanS2.includes('MOK') || cleanS2.includes('KOM');
  const r2Ok = answers.q10b_r2 === 'זוויות קודקודיות שוות זו לזו';
  const thmOk = answers.q10b_thm === 'צ.ז.צ';
  const triOk = answers.q10b_tri === 'KMO';

  let q10bScore = 0;
  if (s1Ok && r1Ok) q10bScore += 1.5;
  if (s2Ok && r2Ok) q10bScore += 1.5;
  if (thmOk) q10bScore += 1;
  if (triOk) q10bScore += 1;

  items.push({
    id: 'q10b',
    name: 'שאלה 10 ב׳: השלמת הוכחת חפיפת משולשים',
    userAnswer: answers.q10b_summary || 'לא נענה',
    correctAnswer: 'HO=OK (נתון) | ∠POH=∠MOK (קודקודיות) | PO=MO (נתון) | ΔHPO≅ΔKMO (צ.ז.צ)',
    isCorrect: q10bScore >= 4,
    timeSpent: times.q10b_time || '-',
    points: 5,
    earnedPoints: Math.round(q10bScore),
  });

  const totalScore = items.reduce((acc, curr) => acc + curr.earnedPoints, 0);
  const maxScore = items.reduce((acc, curr) => acc + curr.points, 0);

  return { totalScore, maxScore, items };
}

export const submitExam = async (
  student: StudentDetails,
  answers: ExamAnswers,
  times: QuestionTimes
) => {
  // חישוב הציון הסופי
  const { totalScore } = evaluateExamResults(answers, times);

  const params = new URLSearchParams();

  // פרטי תלמיד
  params.append('timestamp', student.timestamp || new Date().toLocaleString('he-IL'));
  params.append('fullName', student.fullName);
  params.append('idNumber', student.idNumber || ''); // <-- תעודת זהות (חדש!)
  params.append('layer', student.layer);
  params.append('classNum', String(student.classNum));
  params.append('masteryLevel', String(student.masteryLevel));
  params.append('homework', student.homework);

  // ציון סופי וזמן
  params.append('totalScore', String(totalScore));   // <-- ציון סופי (חדש!)
  params.append('totalTime', times.totalTime || '');

  // תשובות וזמנים של השאלות
  params.append('q1_answer', answers.q1_answer || '');
  params.append('q1_time', times.q1_time || '');
  params.append('q2_answer', answers.q2_answer || '');
  params.append('q2_time', times.q2_time || '');
  params.append('q3_answer', answers.q3_answer || '');
  params.append('q3_time', times.q3_time || '');
  params.append('q4a_answer', answers.q4a_answer || '');
  params.append('q4b_answer', answers.q4b_answer || '');
  params.append('q4_time', times.q4_time || '');
  params.append('q5_answer', answers.q5_answer || '');
  params.append('q5_time', times.q5_time || '');
  params.append('q6_answer', answers.q6_answer || '');
  params.append('q6_time', times.q6_time || '');
  params.append('q7_answer', answers.q7_answer || '');
  params.append('q7_time', times.q7_time || '');
  params.append('q8_answer', answers.q8_answer || '');
  params.append('q8_time', times.q8_time || '');
  params.append('q9a_answer', answers.q9a_answer || '');
  params.append('q9b_answer', answers.q9b_answer || '');
  params.append('q9c_answer', answers.q9c_answer || '');
  params.append('q9d_answer', answers.q9d_answer || '');
  params.append('q9e_answer', answers.q9e_answer || '');
  params.append('q9f_answer', answers.q9f_answer || '');
  params.append('q9g_answer', answers.q9g_answer || '');
  params.append('q9_time', times.q9_time || '');
  params.append('q10a_answer', answers.q10a_answer || '');
  params.append('q10a_time', times.q10a_time || '');
  params.append('q10b_s1', answers.q10b_s1 || '');
  params.append('q10b_r1', answers.q10b_r1 || '');
  params.append('q10b_s2', answers.q10b_s2 || '');
  params.append('q10b_r2', answers.q10b_r2 || '');
  params.append('q10b_s3', answers.q10b_s3 || '');
  params.append('q10b_thm', answers.q10b_thm || '');
  params.append('q10b_tri', answers.q10b_tri || '');
  params.append('q10b_summary', answers.q10b_summary || '');
  params.append('q10b_time', times.q10b_time || '');

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting exam:', error);
    return { success: false };
  }
};
