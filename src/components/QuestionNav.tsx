import React from 'react';

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answers,
  onSelectQuestion,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-4 p-3 bg-slate-100 rounded-xl shadow-inner dir-rtl">
      {Array.from({ length: totalQuestions }, (_, index) => {
        const questionNum = index + 1;
        const isCurrent = index === currentQuestionIndex;
        // בדיקה אם נענתה תשובה לשאלה
        const isAnswered = Boolean(
          answers[`q${questionNum}_answer`] || 
          answers[`q${questionNum}`] || 
          answers[`q${questionNum}a_answer`]
        );

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelectQuestion(index)}
            className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center ${
              isCurrent
                ? 'bg-blue-600 text-white scale-110 ring-2 ring-blue-400 shadow-md'
                : isAnswered
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
            title={`עבור לשאלה ${questionNum}`}
          >
            {questionNum}
          </button>
        );
      })}
    </div>
  );
};