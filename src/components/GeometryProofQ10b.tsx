import React from 'react';

interface GeometryProofProps {
  s1: string;
  r1: string;
  s2: string;
  r2: string;
  s3: string;
  thm: string;
  tri: string;
  onChange: (field: string, value: string) => void;
}

export const GeometryProofQ10b: React.FC<GeometryProofProps> = ({
  s1,
  r1,
  s2,
  r2,
  s3,
  thm,
  tri,
  onChange,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border-2 border-slate-700 rounded-2xl p-4 sm:p-6 shadow-sm my-4" dir="rtl">
      <div className="text-base sm:text-lg font-bold text-slate-900 mb-3 text-right">
        ב. השלם את ההוכחה שלפניך:
      </div>

      {/* Header Box: Diagram + Given / Prove */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-slate-700 p-4 rounded-xl bg-slate-50 mb-6">
        {/* Geometric SVG Diagram */}
        <div className="w-full sm:w-1/2 flex justify-center" dir="ltr">
          <svg
            viewBox="0 0 240 150"
            className="w-full max-w-[220px] h-auto select-none"
          >
            {/* Main segments */}
            {/* H(25, 130) to M(195, 25) - wait: HK is from H(25, 130) to K(230, 130) or crossed? Let's check user's original coordinates: */}
            {/* User SVG had:
                line x1="25" y1="130" x2="195" y2="25" stroke="#000" stroke-width="2" -> H to M
                line x1="60" y1="25" x2="230" y2="130" stroke="#000" stroke-width="2" -> P to K
                Intersection at O around (120, 80)
                line x1="25" y1="130" x2="60" y2="25" -> H to P
                line x1="195" y1="25" x2="230" y2="130" -> M to K
            */}
            <line x1="25" y1="130" x2="195" y2="25" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="60" y1="25" x2="230" y2="130" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="25" y1="130" x2="60" y2="25" stroke="#0284c7" strokeWidth="2.5" />
            <line x1="195" y1="25" x2="230" y2="130" stroke="#0284c7" strokeWidth="2.5" />

            {/* Single tick marks on HO and OK */}
            <line x1="68" y1="93" x2="74" y2="83" stroke="#e11d48" strokeWidth="2.5" />
            <line x1="181" y1="93" x2="187" y2="83" stroke="#e11d48" strokeWidth="2.5" />

            {/* Double tick marks on PO and MO */}
            <line x1="90" y1="52" x2="96" y2="42" stroke="#0284c7" strokeWidth="2" />
            <line x1="95" y1="56" x2="101" y2="46" stroke="#0284c7" strokeWidth="2" />
            <line x1="154" y1="52" x2="160" y2="42" stroke="#0284c7" strokeWidth="2" />
            <line x1="159" y1="56" x2="165" y2="46" stroke="#0284c7" strokeWidth="2" />

            {/* Vertex labels */}
            <text x="12" y="142" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#0f172a">
              H
            </text>
            <text x="50" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#0f172a">
              P
            </text>
            <text x="114" y="96" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#0f172a">
              O
            </text>
            <text x="200" y="20" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#0f172a">
              M
            </text>
            <text x="232" y="142" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#0f172a">
              K
            </text>
          </svg>
        </div>

        {/* Given and To Prove */}
        <div className="w-full sm:w-1/2 text-right text-sm sm:text-base leading-relaxed">
          <div className="font-bold text-slate-800 border-b pb-1 mb-1.5">נתון:</div>
          <div className="font-mono font-medium text-slate-700" dir="ltr">HO = OK</div>
          <div className="font-mono font-medium text-slate-700" dir="ltr">PO = MO</div>
          <div className="mt-3 font-bold text-sky-800 bg-sky-100/60 p-2 rounded-lg border border-sky-200">
            <span>הוכח: </span>
            <span className="font-mono font-bold" dir="ltr">Δ HPO ≅ Δ KMO</span>
          </div>
        </div>
      </div>

      {/* Proof Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-slate-700 text-sm sm:text-base">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border-2 border-slate-700 p-2.5 w-[52%]">טענה</th>
              <th className="border-2 border-slate-700 p-2.5 w-[48%]">נימוק</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <div className="flex items-center justify-center gap-1.5" dir="ltr">
                  <span className="font-serif italic font-bold">HO = </span>
                  <input
                    type="text"
                    value={s1}
                    onChange={(e) => onChange('s1', e.target.value)}
                    placeholder="השלם צלע"
                    className="w-24 text-center p-1.5 border border-sky-400 bg-sky-50 rounded-lg text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </td>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <select
                  value={r1}
                  onChange={(e) => onChange('r1', e.target.value)}
                  className="w-full p-1.5 border border-sky-400 bg-sky-50 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">בחר/י נימוק...</option>
                  <option value="נתון">נתון</option>
                  <option value="צלע משותפת">צלע משותפת</option>
                  <option value="זווית משותפת">זווית משותפת</option>
                </select>
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <div className="flex items-center justify-center gap-1.5" dir="ltr">
                  <span className="font-serif italic font-bold">∠POH = ∠</span>
                  <input
                    type="text"
                    value={s2}
                    onChange={(e) => onChange('s2', e.target.value)}
                    placeholder="השלם זווית"
                    className="w-24 text-center p-1.5 border border-sky-400 bg-sky-50 rounded-lg text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </td>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <select
                  value={r2}
                  onChange={(e) => onChange('r2', e.target.value)}
                  className="w-full p-1.5 border border-sky-400 bg-sky-50 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">בחר/י נימוק...</option>
                  <option value="זוויות קודקודיות שוות זו לזו">זוויות קודקודיות שוות זו לזו</option>
                  <option value="נתון">נתון</option>
                  <option value="זוויות צמודות שוות">זוויות צמודות שוות</option>
                </select>
              </td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <input
                  type="text"
                  value={s3}
                  onChange={(e) => onChange('s3', e.target.value)}
                  placeholder="למשל: PO = MO"
                  className="w-40 text-center p-1.5 border border-sky-400 bg-sky-50 rounded-lg text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  dir="ltr"
                />
              </td>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle font-bold text-slate-800">
                נתון
              </td>
            </tr>

            {/* Row 4: Conclusion */}
            <tr className="bg-sky-50/50">
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-bold">Δ HPO ≅ Δ</span>
                  <select
                    value={tri}
                    onChange={(e) => onChange('tri', e.target.value)}
                    className="p-1.5 border border-sky-400 bg-white rounded-lg text-sm font-bold focus:ring-2 focus:ring-sky-500"
                    dir="ltr"
                  >
                    <option value="">בחר...</option>
                    <option value="KMO">KMO</option>
                    <option value="MOK">MOK</option>
                    <option value="OKM">OKM</option>
                  </select>
                </div>
              </td>
              <td className="border-2 border-slate-700 p-2.5 text-center align-middle">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold">לפי משפט חפיפה</span>
                  <select
                    value={thm}
                    onChange={(e) => onChange('thm', e.target.value)}
                    className="p-1.5 border border-sky-400 bg-white rounded-lg text-sm font-bold focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">בחר/י...</option>
                    <option value="צ.ז.צ">צ.ז.צ</option>
                    <option value="ז.צ.ז">ז.צ.ז</option>
                    <option value="צ.צ.צ">צ.צ.צ</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
