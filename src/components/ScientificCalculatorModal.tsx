import React, { useState } from 'react';
import { Calculator, X, Delete, RotateCcw } from 'lucide-react';

interface ScientificCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificCalculatorModal: React.FC<ScientificCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const append = (val: string) => {
    setError(null);
    setExpression((prev) => prev + val);
  };

  const clearAll = () => {
    setExpression('');
    setResult('0');
    setError(null);
  };

  const backspace = () => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (!expression.trim()) return;
      // Convert display math symbols to JS safe syntax
      let sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

      // Validate only allowed characters
      if (/[^0-9+\-*/().Mathsqrt\s]/.test(sanitized)) {
        throw new Error('ביטוי לא חוקי');
      }

      // eslint-disable-next-line no-new-func
      const calcResult = Function(`'use strict'; return (${sanitized})`)();

      if (typeof calcResult === 'number' && !isNaN(calcResult) && isFinite(calcResult)) {
        // Round nicely if decimal
        const rounded = Number.isInteger(calcResult)
          ? calcResult.toString()
          : Number(calcResult.toFixed(6)).toString();
        setResult(rounded);
      } else {
        setError('שגיאת חישוב');
      }
    } catch {
      setError('תחביר שגוי');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calculator-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        dir="ltr"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-sky-700 text-white select-none">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-200" />
            <h3 id="calculator-title" className="font-bold text-sm tracking-wide">מחשבון עזר מדעי</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="סגור מחשבון"
            className="p-1 rounded-lg hover:bg-sky-600/80 text-sky-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-slate-900 text-right flex flex-col justify-end min-h-[90px]">
          <div className="text-xs text-slate-400 font-mono tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none">
            {expression || '0'}
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 truncate">
            {error ? <span className="text-rose-400 text-sm">{error}</span> : `= ${result}`}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-3 bg-slate-100 grid grid-cols-4 gap-2 select-none">
          {/* Scientific Row 1 */}
          <button
            onClick={() => append('^2')}
            className="p-2.5 text-xs font-semibold bg-white hover:bg-sky-50 text-sky-800 rounded-xl border border-slate-200 shadow-2xs"
          >
            x²
          </button>
          <button
            onClick={() => append('^3')}
            className="p-2.5 text-xs font-semibold bg-white hover:bg-sky-50 text-sky-800 rounded-xl border border-slate-200 shadow-2xs"
          >
            x³
          </button>
          <button
            onClick={() => append('^')}
            className="p-2.5 text-xs font-semibold bg-white hover:bg-sky-50 text-sky-800 rounded-xl border border-slate-200 shadow-2xs"
          >
            xʸ
          </button>
          <button
            onClick={() => append('√(')}
            className="p-2.5 text-xs font-semibold bg-white hover:bg-sky-50 text-sky-800 rounded-xl border border-slate-200 shadow-2xs"
          >
            √x
          </button>

          {/* Scientific Row 2 */}
          <button
            onClick={() => append('(')}
            className="p-2.5 text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl border border-slate-300 shadow-2xs"
          >
            (
          </button>
          <button
            onClick={() => append(')')}
            className="p-2.5 text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl border border-slate-300 shadow-2xs"
          >
            )
          </button>
          <button
            onClick={clearAll}
            className="p-2.5 text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl border border-rose-200 shadow-2xs flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> AC
          </button>
          <button
            onClick={backspace}
            className="p-2.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>

          {/* Digits and Operators */}
          {['7', '8', '9', '÷'].map((btn) => (
            <button
              key={btn}
              onClick={() => append(btn)}
              className={`p-3 text-base font-bold rounded-xl shadow-2xs transition-transform active:scale-95 ${
                btn === '÷'
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}

          {['4', '5', '6', '×'].map((btn) => (
            <button
              key={btn}
              onClick={() => append(btn)}
              className={`p-3 text-base font-bold rounded-xl shadow-2xs transition-transform active:scale-95 ${
                btn === '×'
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}

          {['1', '2', '3', '-'].map((btn) => (
            <button
              key={btn}
              onClick={() => append(btn)}
              className={`p-3 text-base font-bold rounded-xl shadow-2xs transition-transform active:scale-95 ${
                btn === '-'
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}

          {['0', '.', '=', '+'].map((btn) => (
            <button
              key={btn}
              onClick={btn === '=' ? calculate : () => append(btn)}
              className={`p-3 text-base font-bold rounded-xl shadow-2xs transition-transform active:scale-95 ${
                btn === '='
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-black col-span-1'
                  : btn === '+'
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Quick Helper */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center" dir="rtl">
          הערה: ניתן להשתמש גם במחשבון הפיזי שלך.
        </div>
      </div>
    </div>
  );
};
