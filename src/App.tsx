/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StudentDetails,
  ExamAnswers,
  QuestionTimes,
} from './types';
import {
  formatDuration,
  checkAnswerQ7,
  checkAnswerQ8,
  submitExam,
} from './utils/examUtils';
import { SidebarProgress } from './components/SidebarProgress';
import { TimerBadge } from './components/TimerBadge';
import { ScientificCalculatorModal } from './components/ScientificCalculatorModal';
import { InteractiveGraphQ7 } from './components/InteractiveGraphQ7';
import { GeometryDiagramQ10a } from './components/GeometryDiagramQ10a';
import { GeometryProofQ10b } from './components/GeometryProofQ10b';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { QuestionNav } from './components/QuestionNav';
import { Calculator, AlertCircle, Loader2, ArrowLeft, ArrowRight, Send, RotateCcw } from 'lucide-react';

const STEP_TITLES = [
  'הוראות',
  'הזדהות',
  'שאלה 1',
  'שאלה 2',
  'שאלה 3',
  'שאלה 4',
  'שאלה 5',
  'שאלה 6',
  'שאלה 7',
  'שאלה 8',
  'שאלה 9',
  'שאלה 10 א׳',
  'שאלה 10 ב׳',
  'סיכום ותוצאות',
];

const QUESTION_DURATIONS: Record<number, number> = {
  2: 300,  // Q1: 5m
  3: 180,  // Q2: 3m
  4: 300,  // Q3: 5m
  5: 480,  // Q4: 8m
  6: 300,  // Q5: 5m
  7: 600,  // Q6: 10m
  8: 240,  // Q7: 4m
  9: 300,  // Q8: 5m
  10: 300, // Q9: 5m
  11: 300, // Q10a: 5m
  12: 300, // Q10b: 5m
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [answers, setAnswers] = useState<ExamAnswers>({});
  const [times, setTimes] = useState<QuestionTimes>({});

  // Question Inputs State
  const [q1Val, setQ1Val] = useState<string>('');
  const [q2Val, setQ2Val] = useState<string>('');
  const [q3Val, setQ3Val] = useState<string>('');
  const [q4aVal, setQ4aVal] = useState<string>('');
  const [q4bVal, setQ4bVal] = useState<string>('');
  const [q5Val, setQ5Val] = useState<string>('');
  const [q6Val, setQ6Val] = useState<string>('');
  const [q7Val, setQ7Val] = useState<string>('');
  const [q7Feedback, setQ7Feedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [q8Val, setQ8Val] = useState<string>('');
  const [q8Feedback, setQ8Feedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // Q9 Sub-items
  const [q9Answers, setQ9Answers] = useState<{ [key: string]: string }>({});

  // Q10a Input
  const [q10aVal, setQ10aVal] = useState<string>('');

  // Q10b Inputs
  const [q10bState, setQ10bState] = useState({
    s1: '',
    r1: '',
    s2: '',
    r2: '',
    s3: '',
    thm: '',
    tri: '',
  });

  // Track remaining seconds per question
  const [stepElapsedSeconds, setStepElapsedSeconds] = useState<Record<number, number>>({
    2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0,
  });

  // Track accumulated active solving time per question (in ms)
  const [stepAccumulatedMs, setStepAccumulatedMs] = useState<Record<number, number>>({
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  });

  const [overallElapsedSeconds, setOverallElapsedSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<'loading' | 'success' | 'offline'>('loading');
  const [calcModalOpen, setCalcModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Refs
  const examStartRef = useRef<number | null>(null);
  const stepEnterTimeRef = useRef<number>(Date.now());
  const questionTimerInterval = useRef<any>(null);
  const overallTimerInterval = useRef<any>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Audio tone generator
  const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context error ignore
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Record time spent on current step before navigating
  const flushStepTime = (stepIndex: number) => {
    if (stepIndex >= 2 && stepIndex <= 12) {
      const now = Date.now();
      const elapsedOnThisVisit = now - stepEnterTimeRef.current;
      setStepAccumulatedMs((prev) => ({
        ...prev,
        [stepIndex]: (prev[stepIndex] || 0) + Math.max(0, elapsedOnThisVisit),
      }));
    }
    stepEnterTimeRef.current = Date.now();
  };

  // Start exam when student registers
  const handleAuthSubmit = (details: StudentDetails) => {
    setStudent(details);
    setCurrentStep(2); // Move to Q1
    examStartRef.current = Date.now();
    stepEnterTimeRef.current = Date.now();
    scrollToTop();
  };

  // Overall timer ticking (1 hr maximum total)
  useEffect(() => {
    if (currentStep >= 2 && currentStep <= 12) {
      overallTimerInterval.current = setInterval(() => {
        setOverallElapsedSeconds((prev) => {
          if (prev >= 3600) {
            handleFinalExamSubmission(true);
            return 3600;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(overallTimerInterval.current);
    }
    return () => clearInterval(overallTimerInterval.current);
  }, [currentStep]);

  // Question countdown timer management (individual per step)
  // טיימר ספירה למעלה עבור השאלה הנוכחית
  useEffect(() => {
    if (currentStep < 2 || currentStep > 12) {
      clearInterval(questionTimerInterval.current);
      return;
    }

    stepEnterTimeRef.current = Date.now();
    setValidationWarning(null);

    clearInterval(questionTimerInterval.current);
    questionTimerInterval.current = setInterval(() => {
      setStepElapsedSeconds((prev: Record<number, number>) => ({
        ...prev,
        [currentStep]: (prev[currentStep] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(questionTimerInterval.current);
  }, [currentStep]);
  // Save current step data into state
  const syncCurrentQuestionState = () => {
    switch (currentStep) {
      case 2:
        setAnswers((prev) => ({ ...prev, q1_answer: q1Val }));
        break;
      case 3:
        setAnswers((prev) => ({ ...prev, q2_answer: q2Val }));
        break;
      case 4:
        setAnswers((prev) => ({ ...prev, q3_answer: q3Val }));
        break;
      case 5:
        setAnswers((prev) => ({
          ...prev,
          q4a_answer: q4aVal,
          q4b_answer: q4bVal,
        }));
        break;
      case 6:
        setAnswers((prev) => ({ ...prev, q5_answer: q5Val.trim() }));
        break;
      case 7:
        setAnswers((prev) => ({ ...prev, q6_answer: q6Val }));
        break;
      case 8:
        setAnswers((prev) => ({ ...prev, q7_answer: q7Val.trim() }));
        break;
      case 9:
        setAnswers((prev) => ({ ...prev, q8_answer: q8Val.trim() }));
        break;
      case 10:
        setAnswers((prev) => ({
          ...prev,
          q9a_answer: q9Answers.a || '',
          q9b_answer: q9Answers.b || '',
          q9c_answer: q9Answers.c || '',
          q9d_answer: q9Answers.d || '',
          q9e_answer: q9Answers.e || '',
          q9f_answer: q9Answers.f || '',
          q9g_answer: q9Answers.g || '',
        }));
        break;
      case 11:
        setAnswers((prev) => ({ ...prev, q10a_answer: q10aVal.trim() }));
        break;
      case 12:
        setAnswers((prev) => ({
          ...prev,
          q10b_s1: q10bState.s1,
          q10b_r1: q10bState.r1,
          q10b_s2: q10bState.s2,
          q10b_r2: q10bState.r2,
          q10b_s3: q10bState.s3,
          q10b_thm: q10bState.thm,
          q10b_tri: q10bState.tri,
        }));
        break;
      default:
        break;
    }
  };

  // Navigate to any question freely
  const navigateStep = (targetStep: number) => {
    if (targetStep === currentStep) return;
    flushStepTime(currentStep);
    syncCurrentQuestionState();
    setValidationWarning(null);
    setCurrentStep(targetStep);
    scrollToTop();
  };

  // Check if each question currently has an answer
  const currentAnswersMap: Record<string, any> = {
    ...answers,
    q1_answer: q1Val,
    q2_answer: q2Val,
    q3_answer: q3Val,
    q4a_answer: q4aVal && q4bVal ? q4aVal : '',
    q5_answer: q5Val.trim(),
    q6_answer: q6Val,
    q7_answer: q7Val.trim(),
    q8_answer: q8Val.trim(),
    q9_answer: ['a', 'b', 'c', 'd', 'e', 'f', 'g'].every((k) => !!q9Answers[k]) ? 'answered' : '',
    q10a_answer: q10aVal.trim(),
    q10b_answer: (q10bState.s1 && q10bState.r1 && q10bState.s2 && q10bState.r2 && q10bState.s3 && q10bState.thm && q10bState.tri) ? 'answered' : '',
  };

  // Final submission handler
  const handleFinalExamSubmission = async (force = false) => {
    flushStepTime(currentStep);
    syncCurrentQuestionState();

    if (!force) {
      const isComplete = [
        !!q1Val,
        !!q2Val,
        !!q3Val,
        !!q4aVal && !!q4bVal,
        !!q5Val.trim(),
        !!q6Val,
        !!q7Val.trim(),
        !!q8Val.trim(),
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'].every((k) => !!q9Answers[k]),
        !!q10aVal.trim(),
        !!(q10bState.s1 && q10bState.r1 && q10bState.s2 && q10bState.r2 && q10bState.s3 && q10bState.thm && q10bState.tri),
      ];
      const unansweredCount = isComplete.filter((ans) => !ans).length;
      if (unansweredCount > 0) {
        const confirmMsg = `שימו לב: ישנן ${unansweredCount} שאלות שלא נענו במלואן. האם אתם בטוחים שברצונכם לסיים ולהגיש את המבחן כעת?`;
        if (!window.confirm(confirmMsg)) {
          return;
        }
      }
    }

    clearInterval(questionTimerInterval.current);
    clearInterval(overallTimerInterval.current);

    const summaryStr = `HO=${q10bState.s1 || '-'} (${q10bState.r1 || '-'}) | ∠POH=∠${q10bState.s2 || '-'} (${q10bState.r2 || '-'}) | ${q10bState.s3 || '-'} (נתון) | ΔHPO≅Δ${q10bState.tri || '-'} (${q10bState.thm || '-'})`;

    const finalAnswers: ExamAnswers = {
      q1_answer: q1Val || 'לא נענה',
      q2_answer: q2Val || 'לא נענה',
      q3_answer: q3Val || 'לא נענה',
      q4a_answer: q4aVal || 'לא נענה',
      q4b_answer: q4bVal || 'לא נענה',
      q5_answer: q5Val.trim() || 'לא נענה',
      q6_answer: q6Val || 'לא נענה',
      q7_answer: q7Val.trim() || 'לא נענה',
      q8_answer: q8Val.trim() || 'לא נענה',
      q9a_answer: q9Answers.a || 'לא נענה',
      q9b_answer: q9Answers.b || 'לא נענה',
      q9c_answer: q9Answers.c || 'לא נענה',
      q9d_answer: q9Answers.d || 'לא נענה',
      q9e_answer: q9Answers.e || 'לא נענה',
      q9f_answer: q9Answers.f || 'לא נענה',
      q9g_answer: q9Answers.g || 'לא נענה',
      q10a_answer: q10aVal.trim() || 'לא נענה',
      q10b_s1: q10bState.s1 || 'לא נענה',
      q10b_r1: q10bState.r1 || 'לא נענה',
      q10b_s2: q10bState.s2 || 'לא נענה',
      q10b_r2: q10bState.r2 || 'לא נענה',
      q10b_s3: q10bState.s3 || 'לא נענה',
      q10b_thm: q10bState.thm || 'לא נענה',
      q10b_tri: q10bState.tri || 'לא נענה',
      q10b_summary: summaryStr,
    };

    const finalTimes: QuestionTimes = {
      q1_time: formatDuration(stepAccumulatedMs[2] || 0),
      q2_time: formatDuration(stepAccumulatedMs[3] || 0),
      q3_time: formatDuration(stepAccumulatedMs[4] || 0),
      q4_time: formatDuration(stepAccumulatedMs[5] || 0),
      q5_time: formatDuration(stepAccumulatedMs[6] || 0),
      q6_time: formatDuration(stepAccumulatedMs[7] || 0),
      q7_time: formatDuration(stepAccumulatedMs[8] || 0),
      q8_time: formatDuration(stepAccumulatedMs[9] || 0),
      q9_time: formatDuration(stepAccumulatedMs[10] || 0),
      q10a_time: formatDuration(stepAccumulatedMs[11] || 0),
      q10b_time: formatDuration(stepAccumulatedMs[12] || 0),
      totalTime: formatDuration(Date.now() - (examStartRef.current || Date.now())),
    };

    setAnswers(finalAnswers);
    setTimes(finalTimes);

    setIsSubmitting(true);
    setSubmissionStatus('loading');

    if (student) {
      try {
        const result = await submitExam(student, finalAnswers, finalTimes);
        setSubmissionStatus(result.success ? 'success' : 'offline');
      } catch {
        setSubmissionStatus('offline');
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(13); // Show final review & evaluation
      scrollToTop();
    }, 1200);
  };
  const handleRetryExam = () => {
    setAnswers({});
    setTimes({});
    setQ1Val('');
    setQ2Val('');
    setQ3Val('');
    setQ4aVal('');
    setQ4bVal('');
    setQ5Val('');
    setQ6Val('');
    setQ7Val('');
    setQ7Feedback(null);
    setQ8Val('');
    setQ8Feedback(null);
    setQ9Answers({});
    setQ10aVal('');
    setQ10bState({ s1: '', r1: '', s2: '', r2: '', s3: '', thm: '', tri: '' });
    
    // עדכון איפוס השעונים לספירה עולה
    setStepElapsedSeconds({
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    });
    setStepAccumulatedMs({
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    });
    setOverallElapsedSeconds(0);
    setCurrentStep(0);
    scrollToTop();
  };
  // Helper render for bottom navigation bar on each question
  const renderBottomNav = (isAnswered: boolean, onClear?: () => void) => {
    const isFirst = currentStep === 2;
    const isLast = currentStep === 12;

    return (
      <div className="pt-6 border-t border-slate-200 mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            {isAnswered ? (
              <span className="text-emerald-700 font-bold">שאלה זו נענתה (ניתן לחזור ולתקן בכל עת)</span>
            ) : (
              <span>ניתן לדלג על השאלה ולחזור אליה מאוחר יותר</span>
            )}
          </span>
          {onClear && isAnswered && (
            <button
              type="button"
              onClick={onClear}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>נקה תשובה</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateStep(currentStep - 1)}
            disabled={isFirst}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm sm:text-base transition-all ${
              isFirst
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98 cursor-pointer'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>שאלה קודמת</span>
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={() => handleFinalExamSubmission(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>סיום והגשת המבחן</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateStep(currentStep + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <span>לשאלה הבאה</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100/50 flex flex-col justify-between py-6 px-4 sm:px-6 relative text-slate-800" dir="rtl">
      {/* Sidebar Progress */}
      <SidebarProgress
        currentStep={currentStep}
        totalSteps={STEP_TITLES.length}
        stepTitles={STEP_TITLES}
        onSelectStep={(step) => {
          if (step >= 2 && step <= 12) {
            navigateStep(step);
          }
        }}
      />

      {/* Quick Calculator Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setCalcModalOpen(true)}
          className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
          <span>מחשבון מדעי</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto my-auto py-4">
        {/* Step 0: Welcome Screen */}
        {currentStep === 0 && (
          <WelcomeScreen
            onStart={() => setCurrentStep(1)}
            onOpenCalculator={() => setCalcModalOpen(true)}
          />
        )}

        {/* Step 1: Authentication */}
        {currentStep === 1 && <AuthScreen onSubmit={handleAuthSubmit} />}

        {/* Steps 2-12: Questions */}
        {currentStep >= 2 && currentStep <= 12 && (
          <div className="w-full bg-white rounded-3xl shadow-xl border border-sky-100 p-6 sm:p-10 relative">
            {/* Top Timer Bar */}
            <div className="mb-4">
              <TimerBadge
                secondsLeft={stepElapsedSeconds[currentStep] || 0}
                totalDuration={300}
                overallElapsedSeconds={overallElapsedSeconds}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled((prev) => !prev)}
              />
            </div>

            {/* QuestionNav: Interactive Question Navigation Bar */}
            <QuestionNav
              totalQuestions={11}
              currentQuestionIndex={currentStep - 2}
              answers={currentAnswersMap}
              onSelectQuestion={(index) => navigateStep(index + 2)}
            />

            {/* Validation warning banner */}
            {validationWarning && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 text-sm p-3.5 rounded-xl mb-5 flex items-center gap-2 font-medium">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{validationWarning}</span>
              </div>
            )}

            {/* Step 2: Question 1 */}
            {currentStep === 2 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק א׳ - אריתמטיקה ואחוזים
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  1. תוצאת התרגיל הבא היא:
                </h3>

                <div
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-6 flex items-center justify-center text-lg sm:text-xl font-semibold gap-2 shadow-2xs select-none"
                  dir="ltr"
                >
                  <span>(</span>
                  <span className="fraction">
                    <span className="numerator">-1</span>
                    <span className="denominator">6</span>
                  </span>
                  <span>)</span>
                  <span className="mx-1">+</span>
                  <span className="fraction">
                    <span className="numerator">1</span>
                    <span className="denominator">6</span>
                  </span>
                  <span className="mx-1.5">:</span>
                  <span>(</span>
                  <span className="mixed-number">
                    2{' '}
                    <span className="fraction">
                      <span className="numerator">1</span>
                      <span className="denominator">4</span>
                    </span>
                  </span>
                  <span className="mx-1">+</span>
                  <span className="fraction">
                    <span className="numerator">8</span>
                    <span className="denominator">3</span>
                  </span>
                  <span>)</span>
                  <span className="ml-2">=</span>
                </div>

                <div className="space-y-3 my-6">
                  {[
                    { val: 'א', label: 'א. 0' },
                    {
                      val: 'ב',
                      label: (
                        <span>
                          ב.{' '}
                          <span className="fraction font-semibold">
                            <span className="numerator">1</span>
                            <span className="denominator">29</span>
                          </span>
                        </span>
                      ),
                    },
                    {
                      val: 'ג',
                      label: (
                        <span>
                          ג.{' '}
                          <span className="fraction font-semibold">
                            <span className="numerator">47-</span>
                            <span className="denominator">354</span>
                          </span>
                        </span>
                      ),
                    },
                    {
                      val: 'ד',
                      label: (
                        <span>
                          ד.{' '}
                          <span className="fraction font-semibold">
                            <span className="numerator">5</span>
                            <span className="denominator">12</span>
                          </span>
                        </span>
                      ),
                    },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        q1Val === opt.val
                          ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q1"
                        value={opt.val}
                        checked={q1Val === opt.val}
                        onChange={(e) => {
                          setQ1Val(e.target.value);
                          setValidationWarning(null);
                        }}
                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                      />
                      <span className="text-base">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {renderBottomNav(!!q1Val, () => setQ1Val(''))}
              </div>
            )}

            {/* Step 3: Question 2 */}
            {currentStep === 3 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק א׳ - אריתמטיקה ואחוזים
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  2. איזה מבין המשפטים נכון לגבי התרגיל הבא:
                </h3>

                <div
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-6 flex items-center justify-center text-xl font-semibold select-none"
                  dir="ltr"
                >
                  <span className="mr-2 text-2xl">-</span>
                  <div className="fraction">
                    <span className="numerator">
                      <span className="ltr-text font-bold">-2³</span> -{' '}
                      <span className="ltr-text font-bold">(-2)³</span> :{' '}
                      <span className="ltr-text font-bold">(-1³)</span>
                    </span>
                    <span className="denominator font-bold">2³</span>
                  </div>
                </div>

                <div className="space-y-3 my-6">
                  {[
                    {
                      val: 'א',
                      label: (
                        <span>
                          א. ניתן להוציא גורם משותף <span className="ltr-text font-mono font-bold">-2³</span> בלבד, לצמצם בו את השבר ולקבל <span className="ltr-text font-mono font-bold">-1</span>.
                        </span>
                      ),
                    },
                    {
                      val: 'ב',
                      label: (
                        <span>
                          ב. ניתן להוציא גורם משותף <span className="ltr-text font-mono font-bold">-2³</span>, אך לא ניתן לצמצם בו.
                        </span>
                      ),
                    },
                    {
                      val: 'ג',
                      label: (
                        <span>
                          ג. ניתן להוציא גורם משותף <span className="ltr-text font-mono font-bold">-2³</span> או <span className="ltr-text font-mono font-bold">2³</span>, לצמצם והתוצאה תהייה זהה.
                        </span>
                      ),
                    },
                    {
                      val: 'ד',
                      label: 'ד. לא צריך לצמצם, התשובה היא 0.',
                    },
                    {
                      val: 'ה',
                      label: 'ה. כל התשובות אינן נכונות (חוץ מתשובה זו).',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        q2Val === opt.val
                          ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        value={opt.val}
                        checked={q2Val === opt.val}
                        onChange={(e) => {
                          setQ2Val(e.target.value);
                          setValidationWarning(null);
                        }}
                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                      />
                      <span className="text-sm sm:text-base leading-relaxed">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {renderBottomNav(!!q2Val, () => setQ2Val(''))}
              </div>
            )}

            {/* Step 4: Question 3 */}
            {currentStep === 4 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק א׳ - אריתמטיקה ואחוזים
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  3. נתונים שני מספרים a, b וידוע ש:{' '}
                  <span className="ltr-text font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg">
                    b &lt; 0 , a &gt; 0
                  </span>
                </h3>
                <p className="text-base text-slate-700 font-semibold mb-6">
                  איזה מבין המשפטים הבאים <u>נכון בהכרח</u>?
                </p>

                <div className="space-y-3 my-6">
                  {[
                    {
                      val: 'א',
                      label: (
                        <span>
                          א.{' '}
                          <span className="ltr-text font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                            b - a &lt; 0
                          </span>
                        </span>
                      ),
                    },
                    {
                      val: 'ב',
                      label: (
                        <span>
                          ב.{' '}
                          <span className="ltr-text font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                            a³ &gt; b²
                          </span>
                        </span>
                      ),
                    },
                    {
                      val: 'ג',
                      label: (
                        <span>
                          ג.{' '}
                          <span className="ltr-text font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                            a² + b² ≤ 0
                          </span>
                        </span>
                      ),
                    },
                    {
                      val: 'ד',
                      label: (
                        <span>
                          ד.{' '}
                          <span className="ltr-text font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                            a(a - b) ≤ 0
                          </span>
                        </span>
                      ),
                    },
                    {
                      val: 'ה',
                      label: 'ה. כל התשובות שגויות (חוץ מתשובה זו).',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        q3Val === opt.val
                          ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q3"
                        value={opt.val}
                        checked={q3Val === opt.val}
                        onChange={(e) => {
                          setQ3Val(e.target.value);
                          setValidationWarning(null);
                        }}
                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                      />
                      <span className="text-base">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {renderBottomNav(!!q3Val, () => setQ3Val(''))}
              </div>
            )}

            {/* Step 5: Question 4 */}
            {currentStep === 5 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק א׳ - אריתמטיקה ואחוזים
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  4. תרגיל מילולי באחוזים
                </h3>

                <div className="bg-sky-50/60 border-r-4 border-sky-600 p-5 rounded-xl text-slate-800 text-sm sm:text-base leading-relaxed mb-6">
                  <p className="mb-2">
                    בחג סוכות, מזכירת בית הספר "הכי-טוב" קנתה 2 ק"ג עגבניות מהירקן השכונתי כדי להכין סלט. היא שילמה עבור הקנייה 40 ש"ח.
                  </p>
                  <p className="mb-2">
                    חודש לאחר מכן, הגיעה המזכירה לירקן עם 40 ש"ח במטרה לרכוש שוב 2 ק"ג עגבניות, אלא שמחיר ק"ג עגבניות עלה וחסרו לה 15 ש"ח.
                  </p>
                  <p>
                    חודש לאחר הקנייה השנייה, מחיר העגבניות ירד ושוב הצטרכה המזכירה לשלם 40 ש"ח בעבור אותה הכמות (2 קילוגרם).
                  </p>
                </div>

                {/* Subquestion A */}
                <div className="mb-6">
                  <h4 className="text-base font-bold text-sky-900 mb-3">
                    א. בכמה אחוזים התייקר קילוגרם עגבניות חודש לאחר סוכות?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { val: '1', label: '(1) 10%' },
                      { val: '2', label: '(2) 15%' },
                      { val: '3', label: '(3) 27%' },
                      { val: '4', label: '(4) 37.5%' },
                      { val: '5', label: '(5) 40%' },
                    ].map((opt) => (
                      <label
                        key={opt.val}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          q4aVal === opt.val
                            ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                            : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="q4a"
                          value={opt.val}
                          checked={q4aVal === opt.val}
                          onChange={(e) => {
                            setQ4aVal(e.target.value);
                            setValidationWarning(null);
                          }}
                          className="w-4 h-4 accent-sky-600 cursor-pointer"
                        />
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-200 my-6" />

                {/* Subquestion B */}
                <div className="mb-6">
                  <h4 className="text-base font-bold text-sky-900 mb-3">
                    ב. בהנחה שלא חלו שינויים נוספים במחיר העגבניות בחודשים שחלפו מסוכות עד לרכישה השלישית, מה היה (באחוזים) גובה הירידה במחיר?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { val: '1', label: '(1) 10%' },
                      { val: '2', label: '(2) 15%' },
                      { val: '3', label: '(3) 27.27%' },
                      { val: '4', label: '(4) 37.5%' },
                      { val: '5', label: '(5) 40%' },
                    ].map((opt) => (
                      <label
                        key={opt.val}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          q4bVal === opt.val
                            ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                            : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="q4b"
                          value={opt.val}
                          checked={q4bVal === opt.val}
                          onChange={(e) => {
                            setQ4bVal(e.target.value);
                            setValidationWarning(null);
                          }}
                          className="w-4 h-4 accent-sky-600 cursor-pointer"
                        />
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {renderBottomNav(!!q4aVal && !!q4bVal, () => {
                  setQ4aVal('');
                  setQ4bVal('');
                })}
              </div>
            )}

            {/* Step 6: Question 5 */}
            {currentStep === 6 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ב׳: אלגברה
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  5. נתון הביטוי האלגברי הבא:
                </h3>

                <div
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-6 flex items-center justify-center text-xl font-semibold gap-3 select-none"
                  dir="ltr"
                >
                  <div className="fraction">
                    <span className="numerator font-mono">-x + 4</span>
                    <span className="denominator font-mono">3</span>
                  </div>
                  <span className="text-2xl">-</span>
                  <div className="fraction">
                    <span className="numerator font-mono">2.5x - 1</span>
                    <span className="denominator font-mono">2</span>
                  </div>
                  <span className="text-2xl">+</span>
                  <span className="font-mono">1</span>
                </div>

                <p className="text-center font-bold text-lg text-slate-800 my-4">
                  מה ערך הביטוי עבור{' '}
                  <span className="ltr-text font-mono text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                    x = 4
                  </span>
                  ?
                </p>

                <div className="max-w-xs mx-auto my-6">
                  <label htmlFor="q5-input" className="block text-center text-sm font-semibold text-slate-700 mb-2">
                    הכנס את התשובה שלך:
                  </label>
                  <input
                    id="q5-input"
                    type="text"
                    value={q5Val}
                    onChange={(e) => {
                      setQ5Val(e.target.value);
                      setValidationWarning(null);
                    }}
                    placeholder="למשל: -3.5"
                    className="w-full text-center py-3.5 px-4 text-xl font-bold font-mono border-2 border-slate-300 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 text-slate-800"
                    dir="ltr"
                  />
                </div>

                {renderBottomNav(!!q5Val.trim(), () => setQ5Val(''))}
              </div>
            )}

            {/* Step 7: Question 6 */}
            {currentStep === 7 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ב׳: אלגברה
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  6. פתור את המשוואה הבאה:
                </h3>

                <div
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-6 flex items-center justify-center text-lg sm:text-xl font-semibold gap-3 select-none overflow-x-auto"
                  dir="ltr"
                >
                  <div className="fraction">
                    <span className="numerator font-mono">-x + 4</span>
                    <span className="denominator font-mono">3</span>
                  </div>
                  <span className="text-2xl">-</span>
                  <div className="fraction">
                    <span className="numerator font-mono">2x - 1</span>
                    <span className="denominator font-mono">2</span>
                  </div>
                  <span className="text-2xl">+</span>
                  <span className="mixed-number">
                    3{' '}
                    <span className="fraction">
                      <span className="numerator font-mono">1</span>
                      <span className="denominator font-mono">2</span>
                    </span>
                  </span>
                  <span className="text-2xl">=</span>
                  <span className="font-mono">0</span>
                </div>

                <p className="font-bold text-base text-slate-800 mb-4">
                  פתרון המשוואה הוא:
                </p>

                <div className="space-y-3 my-6">
                  {[
                    { val: 'א', label: 'א) x = 4' },
                    { val: 'ב', label: 'ב) x = 0' },
                    { val: 'ג', label: 'ג) למשוואה אין פתרון.' },
                    { val: 'ד', label: 'ד) למשוואה אינסוף פתרונות.' },
                    { val: 'ה', label: 'ה) כל התשובות לא נכונות (חוץ מתשובה זו).' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        q6Val === opt.val
                          ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q6"
                        value={opt.val}
                        checked={q6Val === opt.val}
                        onChange={(e) => {
                          setQ6Val(e.target.value);
                          setValidationWarning(null);
                        }}
                        className="w-4 h-4 accent-sky-600 cursor-pointer"
                      />
                      <span className="text-base font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {renderBottomNav(!!q6Val, () => setQ6Val(''))}
              </div>
            )}

            {/* Step 8: Question 7 */}
            {currentStep === 8 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ג': משוואת הישר
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  7. בהסתמך על השרטוט, מהי משוואת הישר?
                </h3>

                <InteractiveGraphQ7 />

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 my-5">
                  <label htmlFor="ans-q7" className="block text-sm font-bold text-slate-800 mb-2">
                    תשובתך (רשום/י את משוואת הישר בצורה y = mx + b):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="ans-q7"
                      type="text"
                      value={q7Val}
                      onChange={(e) => {
                        setQ7Val(e.target.value);
                        setValidationWarning(null);
                      }}
                      placeholder="למשל: y = -2x - 4"
                      className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 text-base font-mono font-bold text-slate-800"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setQ7Feedback(checkAnswerQ7(q7Val))}
                      className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors text-sm shrink-0 cursor-pointer"
                    >
                      בדוק תשובה בלבד
                    </button>
                  </div>

                  {q7Feedback && (
                    <div
                      className={`mt-3 p-3 rounded-xl text-sm font-semibold ${
                        q7Feedback.isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {q7Feedback.feedback}
                    </div>
                  )}
                </div>

                {renderBottomNav(!!q7Val.trim(), () => {
                  setQ7Val('');
                  setQ7Feedback(null);
                })}
              </div>
            )}

            {/* Step 9: Question 8 */}
            {currentStep === 9 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ג': משוואת הישר
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  8. נתונות הנקודות:{' '}
                  <span className="ltr-text font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                    A(-2, -2)
                  </span>
                  ,{' '}
                  <span className="ltr-text font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                    B(-4, -4)
                  </span>
                  .
                </h3>
                <p className="text-base text-slate-700 font-semibold mb-6">
                  מצא את משוואת הישר העובר דרך שתי הנקודות.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 my-5">
                  <label htmlFor="ans-q8" className="block text-sm font-bold text-slate-800 mb-2">
                    תשובתך (משוואת ישר בצורה y = mx + b):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="ans-q8"
                      type="text"
                      value={q8Val}
                      onChange={(e) => {
                        setQ8Val(e.target.value);
                        setValidationWarning(null);
                      }}
                      placeholder="למשל: y = x"
                      className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 text-base font-mono font-bold text-slate-800"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setQ8Feedback(checkAnswerQ8(q8Val))}
                      className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors text-sm shrink-0 cursor-pointer"
                    >
                      בדוק תשובה בלבד
                    </button>
                  </div>

                  {q8Feedback && (
                    <div
                      className={`mt-3 p-3 rounded-xl text-sm font-semibold ${
                        q8Feedback.isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {q8Feedback.feedback}
                    </div>
                  )}
                </div>

                {renderBottomNav(!!q8Val.trim(), () => {
                  setQ8Val('');
                  setQ8Feedback(null);
                })}
              </div>
            )}

            {/* Step 10: Question 9 */}
            {currentStep === 10 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ג': משוואת הישר
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  9. ענה נכון / לא נכון על המשפטים הבאים:
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  יש לסמן עבור כל אחד מ-7 המשפטים. תוכלו לשנות את הסימון בכל עת.
                </p>

                <div className="space-y-4 my-6">
                  {[
                    {
                      id: 'a',
                      text: 'א. אם הפרש שיעורי ה-y בין שתי נקודות הוא אפס, והפרש שיעורי ה-x אינו אפס, אז השיפוע של הישר העובר בין שתי נקודות אינו מוגדר.',
                    },
                    {
                      id: 'b',
                      text: 'ב. פונקציה קבועה היא פונקציית קו ישר שלה שיפוע אפס.',
                    },
                    {
                      id: 'c',
                      text: 'ג. ישר המקביל לציר ה-x, שיפועו אינו מוגדר.',
                    },
                    {
                      id: 'd',
                      text: 'ד. משוואת קו ישר מייצגת ישר שאין לו התחלה ואין לו סוף.',
                    },
                    {
                      id: 'e',
                      text: 'ה. אם משוואת ישר מייצגת גרף המקביל לציר ה-y, אז היא מהסוג y = a (כאשר a הוא מספר כלשהו).',
                    },
                    {
                      id: 'f',
                      text: 'ו. בפשטות: שיפוע ישר מייצג ירידה (או עלייה) כלשהי בציר ה-x, על כל התקדמות אחת בציר ה-y.',
                    },
                    {
                      id: 'g',
                      text: 'ז. קיימת משוואת ישר שאינה מייצגת פונקציה.',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 p-4 rounded-xl border-r-4 border-sky-600 border border-slate-200"
                    >
                      <p className="text-sm sm:text-base font-semibold text-slate-800 mb-3 leading-relaxed">
                        {item.text}
                      </p>
                      <div className="flex gap-4">
                        {['נכון', 'לא נכון'].map((choice) => (
                          <label
                            key={choice}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm font-bold transition-all ${
                              q9Answers[item.id] === choice
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q9_${item.id}`}
                              value={choice}
                              checked={q9Answers[item.id] === choice}
                              onChange={() => {
                                setQ9Answers((prev) => ({
                                  ...prev,
                                  [item.id]: choice,
                                }));
                                setValidationWarning(null);
                              }}
                              className="hidden"
                            />
                            <span>{choice}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {renderBottomNav(
                  ['a', 'b', 'c', 'd', 'e', 'f', 'g'].every((k) => !!q9Answers[k]),
                  () => setQ9Answers({})
                )}
              </div>
            )}

            {/* Step 11: Question 10a */}
            {currentStep === 11 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ד׳: גיאומטריה
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  10. א. בשרטוט שלפניך נתון כי{' '}
                  <span className="ltr-text font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                    a ∥ b
                  </span>
                </h3>

                <GeometryDiagramQ10a />

                <p className="text-center font-bold text-lg text-slate-800 my-4">
                  מצא את ערכו של x:
                </p>

                <div className="max-w-xs mx-auto my-6">
                  <label htmlFor="ans-q10a" className="block text-center text-sm font-semibold text-slate-700 mb-2">
                    הכנס את תשובתך (ערכו של x):
                  </label>
                  <input
                    id="ans-q10a"
                    type="text"
                    value={q10aVal}
                    onChange={(e) => {
                      setQ10aVal(e.target.value);
                      setValidationWarning(null);
                    }}
                    placeholder="למשל: 25 או x = 25"
                    className="w-full text-center py-3 px-4 text-xl font-bold font-mono border-2 border-slate-300 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 text-slate-800"
                    dir="ltr"
                  />
                </div>

                {renderBottomNav(!!q10aVal.trim(), () => setQ10aVal(''))}
              </div>
            )}

            {/* Step 12: Question 10b */}
            {currentStep === 12 && (
              <div>
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                  פרק ד׳: גיאומטריה
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  10. ב. השלמת הוכחת חפיפת משולשים
                </h3>

                <GeometryProofQ10b
                  s1={q10bState.s1}
                  r1={q10bState.r1}
                  s2={q10bState.s2}
                  r2={q10bState.r2}
                  s3={q10bState.s3}
                  thm={q10bState.thm}
                  tri={q10bState.tri}
                  onChange={(field, value) => {
                    setQ10bState((prev) => ({ ...prev, [field]: value }));
                    setValidationWarning(null);
                  }}
                />

                {renderBottomNav(
                  !!(q10bState.s1 && q10bState.r1 && q10bState.s2 && q10bState.r2 && q10bState.s3 && q10bState.thm && q10bState.tri),
                  () =>
                    setQ10bState({
                      s1: '',
                      r1: '',
                      s2: '',
                      r2: '',
                      s3: '',
                      thm: '',
                      tri: '',
                    })
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 13: Summary / Review & Grading */}
        {currentStep === 13 && student && (
          <CompletionScreen
            student={student}
            answers={answers}
            times={times}
            submissionStatus={submissionStatus}
            onRetry={handleRetryExam}
          />
        )}
      </main>

      {/* Submitting Spinner Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-sky-200">
            <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-900 mb-1">מעבד תוצאות...</h4>
            <p className="text-sm text-slate-600">
              התשובות נרשמות במערכת ומחושב המשוב האישי שלך.
            </p>
          </div>
        </div>
      )}

      {/* Scientific Calculator Modal */}
      <ScientificCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
      />
    </div>
  );
}