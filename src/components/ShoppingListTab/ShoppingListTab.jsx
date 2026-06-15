import React, { useState } from "react";
import { Check } from "lucide-react";
import { fmt, humanizeAmount, formatLeftover, calcLeftover } from "../../utils/pricing";
import { tIng } from "../../data/ingredientDb";

export function ShoppingListTab({ shopping, totalCost, scale, recipePeople, people, t, lang }) {
  const [checked, setChecked] = useState({});
  return (
    <div className="space-y-4">
      {scale !== 1 && (
        <div className="ios-card p-3 flex items-center gap-2 text-xs bg-c-blue-soft">
          <span className="text-c-blue">ℹ️</span>
          <span className="text-c-text">{t.scaledFrom} {recipePeople} {t.to} {people}</span>
        </div>
      )}

      <div className="ios-card overflow-hidden">
        <div className="px-4 py-3 separator-b">
          <h3 className="font-bold text-base">{t.whatToBuy}</h3>
          <p className="text-xs mt-0.5 text-c-text-secondary">{t.tapToCheck}</p>
        </div>
        {shopping.map((it, idx) => {
          const isChecked = checked[idx];
          return (
            <button key={idx} onClick={() => setChecked({ ...checked, [idx]: !isChecked })}
              className={`ios-btn w-full px-4 py-3 flex items-center gap-3 text-left ${idx < shopping.length - 1 ? "separator-b" : ""}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? "border-c-green bg-c-green" : "border-c-text-tertiary bg-transparent"}`}>
                {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`font-bold tabular-nums ${isChecked ? "text-c-text-tertiary" : "text-c-blue"}`}>
                    {it.packsNeeded}× {it.packLabel}
                  </span>
                </div>
                <div className={`text-sm ${isChecked ? "line-through text-c-text-tertiary" : "text-c-text"}`}>
                  {tIng(it.name, lang)}
                </div>
                {(() => {
                  const human = humanizeAmount(it.scaledQuantity, it.unit, lang);
                  const leftover = calcLeftover(it, it.scaledQuantity);
                  return (
                    <div className="text-[11px] mt-0.5 flex items-center gap-2 flex-wrap text-c-text-tertiary">
                      <span>{t.recipeNeeds} <span className="font-semibold text-c-text">{human.amount} {human.unit}</span></span>
                      {leftover && (
                        <span className="text-c-green">· {lang === "sr" ? "ostaje" : "leftover"} {formatLeftover(leftover, lang)}</span>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-semibold text-sm ${isChecked ? "line-through text-c-text-tertiary" : "text-c-text"}`}>
                  {fmt(it.isPartial ? it.proRatedCost : it.fullPackCost)}
                </div>
              </div>
            </button>
          );
        })}
        <div className="px-4 py-3 flex items-center justify-between bg-c-bg">
          <span className="text-xs font-semibold uppercase tracking-wider text-c-text-secondary">{t.totalCheckout}</span>
          <span className="text-xl font-bold">{fmt(totalCost)}</span>
        </div>
      </div>

      <p className="text-xs text-center px-4 text-c-text-tertiary">
        {t.freshNote}
      </p>
    </div>
  );
}
