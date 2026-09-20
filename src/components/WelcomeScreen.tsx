import React from 'react';
import { BookOpen, Calculator, Clock, Monitor, Sparkles, ArrowLeft, Award, HelpCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onOpenCalculator: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onOpenCalculator,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-sky-100 p-6 sm:p-10 text-center relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-100 rounded-full blur-2xl pointer-events-none opacity-60" />

      <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-1.5 rounded-full text-xs font-bold border border-sky-200 mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        מבדק במתמטיקה לשכבות ט׳ ו-י׳
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-sky-900 mb-4 leading-tight">
        תלמידים יקרים, ברוכים הבאים למבדק המתמטי!
      </h1>

      <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
        המבדק נועד לשמש כחזרה על התכנים המתמטיים אותם למדנו בכיתה בשבועיים האחרונים.
      </p>

      {/* Structured Instructions Box */}
      <div className="bg-slate-50 border-r-4 border-sky-600 p-5 sm:p-6 rounded-2xl text-right mb-8 shadow-2xs">
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600" />
          הנחיות חשובות למבדק:
        </h2>
        <ul className="space-y-3 text-sm sm:text-base text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-600 mt-2 shrink-0" />
            <span>
              לפניכם שאלות במתמטיקה. כל שאלה מוגבלת בזמן. <strong className="text-sky-950 bg-sky-100/80 px-1 rounded">מומלץ לפתור את השאלה מהמחשב האישי ולא מהנייד.</strong>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-600 mt-2 shrink-0" />
            <span>
              משך זמן המבדק המרבי: <strong>60 דקות</strong> (הטיימר יציג ספירה לאחור לכל שאלה בנפרד).
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-600 mt-2 shrink-0" />
            <span>
              <strong>מותר להיעזר במחשבון מדעי</strong> – הכנו עבורכם מחשבון עזר מובנה בכפתור העליון.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-600 mt-2 shrink-0" />
            <span>
              אם מרגישים שיש צורך, ניתן להיבחן שוב לשיפור התוצאה.
            </span>
          </li>
        </ul>
      </div>

      {/* Chapters Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center text-xs font-semibold">
        <div className="bg-sky-50/70 border border-sky-100 p-2.5 rounded-xl text-sky-900">
          פרק א׳: אריתמטיקה
        </div>
        <div className="bg-sky-50/70 border border-sky-100 p-2.5 rounded-xl text-sky-900">
          פרק ב׳: אלגברה
        </div>
        <div className="bg-sky-50/70 border border-sky-100 p-2.5 rounded-xl text-sky-900">
          פרק ג׳: משוואת הישר
        </div>
        <div className="bg-sky-50/70 border border-sky-100 p-2.5 rounded-xl text-sky-900">
          פרק ד׳: גיאומטריה
        </div>
      </div>

      <div className="text-xl sm:text-2xl font-black text-sky-700 mb-6">
        בהצלחה רבה!
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white text-base sm:text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>מוכנים? עברו למסך הזדהות</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={onOpenCalculator}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-sky-600" />
          <span>פתח מחשבון עזר</span>
        </button>
      </div>
    </div>
  );
};
