import React, { useState } from 'react';
import { User, School, Hash, Sparkles, CheckSquare, ArrowLeft, CreditCard } from 'lucide-react';
import { StudentDetails } from '../types';

interface AuthScreenProps {
  onSubmit: (details: StudentDetails) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState(''); // שדה ת"ז חדש
  const [layer, setLayer] = useState('');
  const [classNum, setClassNum] = useState<number | ''>('');
  const [masteryLevel, setMasteryLevel] = useState<number>(8);
  const [homework, setHomework] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('אנא הכנס שם מלא');
      return;
    }
    if (!idNumber.trim()) {
      setError('אנא הכנס מספר תעודת זהות');
      return;
    }
    if (!layer) {
      setError('אנא בחר שכבה (ט׳ או י׳)');
      return;
    }
    if (!classNum || classNum < 1 || classNum > 5) {
      setError('מספר כיתה חייב להיות בין 1 ל-5');
      return;
    }
    if (!homework) {
      setError('אנא בחר את מידת הכנת שיעורי הבית');
      return;
    }

    setError(null);
    onSubmit({
      timestamp: new Date().toLocaleString('he-IL'),
      fullName: fullName.trim(),
      idNumber: idNumber.trim(), // שליחת תעודת הזהות
      layer,
      classNum: Number(classNum),
      masteryLevel,
      homework,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-sky-100 p-6 sm:p-10 text-right">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-sky-900">מסך הזדהות</h2>
        <p className="text-sm text-slate-500 mt-1">
          אנא מלא את פרטיך לפני תחילת המבחן המתוזמן
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl mb-5 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & ID Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-bold text-slate-800 mb-1.5">
              א. שם פרטי ושם משפחה:
            </label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="למשל: דניאל ישראלי"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors text-slate-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-sm font-bold text-slate-800 mb-1.5">
              ב. מספר תעודת זהות:
            </label>
            <div className="relative">
              <input
                id="idNumber"
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="הכנס 9 ספרות"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Layer & Class Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="layer" className="block text-sm font-bold text-slate-800 mb-1.5">
              ג. שכבה:
            </label>
            <select
              id="layer"
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors text-slate-800 bg-white"
            >
              <option value="" disabled>
                בחר שכבה...
              </option>
              <option value="שכבת ט׳">שכבת ט׳</option>
              <option value="שכבת י׳">שכבת י׳</option>
            </select>
          </div>

          <div>
            <label htmlFor="classNum" className="block text-sm font-bold text-slate-800 mb-1.5">
              ד. כיתה (מספר 1 עד 5):
            </label>
            <input
              id="classNum"
              type="number"
              min="1"
              max="5"
              value={classNum}
              onChange={(e) => setClassNum(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="למשל: 3"
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors text-slate-800"
            />
          </div>
        </div>

        {/* Questionnaire Divider */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-base font-bold text-sky-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            כמה שאלות קצרות לפני שנתחיל...
          </h3>

          {/* Mastery Level */}
          <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="masteryLevel" className="text-sm font-semibold text-slate-800">
                מ-1 עד 10, כמה אני מרגיש שאני שולט בחומר?
              </label>
              <span className="text-base font-extrabold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-lg">
                {masteryLevel} / 10
              </span>
            </div>
            <input
              id="masteryLevel"
              type="range"
              min="1"
              max="10"
              value={masteryLevel}
              onChange={(e) => setMasteryLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[11px] text-slate-600 mt-1">
              <span>1 (זקוק לחיזוק)</span>
              <span>5 (בינוני)</span>
              <span>10 (שולט מצוין)</span>
            </div>
          </div>

          {/* Homework habit */}
          <div>
            <label htmlFor="homework" className="block text-sm font-bold text-slate-800 mb-1.5">
              השלם: אני מכין שיעורי בית במתמטיקה _______
            </label>
            <select
              id="homework"
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors text-slate-800 bg-white"
            >
              <option value="" disabled>
                בחר תשובה...
              </option>
              <option value="לא תמיד">לא תמיד</option>
              <option value="כמעט תמיד">כמעט תמיד</option>
              <option value="תמיד">תמיד</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>התחל מבחן</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};