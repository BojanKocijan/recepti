import React from "react";
import { ChefHat, ChevronRight } from "lucide-react";
import { DAYS_FULL_EN, DAYS_FULL_SR } from "../../constants/config";
import { fmt } from "../../utils/pricing";

export function DayPickerSheet({ day, slot, recipes, onPick, onClose, recipeStoreCost, t, lang, tRecipe }) {
  const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;
  const slotLabel = slot === 'lunch' ? t.lunch : t.dinner;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center fade-in overlay-light" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-t-3xl slide-up overflow-hidden bg-c-bg" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 pt-3 pb-4">
          <div className="w-10 h-1 rounded-full mx-auto mb-4 bg-c-separator" />
          <h3 className="text-xl font-bold">{t.pickMealFor} {DAYS_FULL[day]} · {slotLabel}</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2">
          {recipes.length === 0 ? (
            <div className="text-center py-12 text-c-text-secondary">
              <ChefHat size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t.noRecipesSaved}</p>
              <p className="text-xs mt-1">{t.addFromRecipes}</p>
            </div>
          ) : recipes.map(r => (
            <button key={r.id} onClick={() => onPick(r.id)} className="ios-btn w-full ios-card p-3 flex items-center gap-3 text-left">
              <div className="text-2xl">{r.emoji || "🍽️"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{tRecipe(r).name}</div>
                <div className="text-xs flex items-center gap-2 text-c-text-secondary">
                  {r.minutes && <span>{r.minutes} {t.min}</span>}
                  {r.minutes && <span>·</span>}
                  <span>{fmt(recipeStoreCost(r))}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-c-text-tertiary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
