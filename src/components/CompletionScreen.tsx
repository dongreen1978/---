import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, Clock, RotateCcw, Printer, Share2, Check } from 'lucide-react';
import { StudentDetails, ExamAnswers, QuestionTimes } from '../types';
import { evaluateExamResults } from '../utils/examUtils';

interface CompletionScreenProps {
  student: StudentDetails;
  answers: ExamAnswers;
  times: QuestionTimes;
  submissionStatus: 'loading' | 'success' | 'offline';
  onRetry: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  student,
  answers,
  times,
  submissionStatus,
  onRetry,
}) => {
  const { totalScore, maxScore, items } = evaluateExamResults(answers, times);
  const percentage = Math.round((totalScore / maxScore) * 100);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-sky-100 p-6 sm:p-10 text-right">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          המבחן הוגש בהצלחה!
        </h2>
        <p className="text-slate-600">
          כל הכבוד, <strong>{student.fullName}</strong> ({student.layer}, כיתה {student.classNum}).
        </p>

        {submissionStatus === 'success' && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            התשובות נשלחו בהצלחה לגליון המורה
          </div>
        )}
      </div>

      {/* Score and Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Score Card */}
        <div className="bg-sky-50/70 border border-sky-200 p-5 rounded-2xl text-center flex flex-col justify-center items-center">
          <span className="text-xs font-bold text-sky-700 mb-1">ציון סופי משוער</span>
          <div className="text-4xl font-black text-sky-900 tracking-tight">
            {totalScore}
            <span className="text-lg font-normal text-slate-500">/{maxScore}</span>
          </div>
          <span className="text-xs font-semibold text-sky-600 mt-1">{percentage}% הצלחה</span>
        </div>

        {/* Total Time */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center flex flex-col justify-center items-center">
          <span className="text-xs font-bold text-slate-600 mb-1">זמן כולל בפתרון</span>
          <div className="text-2xl font-bold text-slate-800">
            {times.totalTime || 'פחות משעה'}
          </div>
          <span className="text-xs text-slate-500 mt-1">מתוך 60 דקות מוקצבות</span>
        </div>

        {/* Mastery reflection */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center flex flex-col justify-center items-center">
          <span className="text-xs font-bold text-slate-600 mb-1">תחושת שליטה ראשונית</span>
          <div className="text-2xl font-bold text-slate-800">
            {student.masteryLevel} / 10
          </div>
          <span className="text-xs text-slate-500 mt-1">שיעורי בית: {student.homework}</span>
        </div>
      </div>

      {/* Detailed breakdown list */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b flex items-center justify-between">
          <span>פירוט שאלות ותוצאות</span>
          <span className="text-xs font-semibold text-slate-600">ניקוד לכל שאלה</span>
        </h3>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.isCorrect
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-rose-50/30 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    ⏱️ {item.timeSpent}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.earnedPoints} / {item.points} נק׳
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm mt-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-500 ml-1">תשובתך:</span>
                  <span className="font-semibold text-slate-800" dir="auto">
                    {item.userAnswer}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 ml-1">תשובה נכונה:</span>
                  <span className="font-bold text-emerald-700" dir="auto">
                    {item.correctAnswer}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>היבחן שוב (לשיפור ציון)</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>הדפס / שמור כ-PDF</span>
        </button>
      </div>
    </div>
  );
};
