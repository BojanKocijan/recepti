import React from "react";
import { X, Plus, ChevronRight, Clock } from "lucide-react";
import { C } from "../../constants/tokens";
import { fmt } from "../../utils/pricing";

export function MealSlotRow({ slotLabel, recipe, onOpen, onAdd, onClear, recipeStoreCost, tRecipe, t }) {
  return (
    <div onClick={() => recipe ? onOpen() : onAdd()}
      className="ios-btn flex items-center gap-3 px-4 py-3 cursor-pointer">
      <div className="w-12 flex-shrink-0">
        <div className="text-[11px] font-semibold" style={{ color: C.textTertiary }}>{slotLabel}</div>
      </div>
      <div className="flex-1 min-w-0">
        {recipe ? (
          <>
            <div className="font-semibold truncate flex items-center gap-2">
              {recipe.emoji && <span>{recipe.emoji}</span>}
              {tRecipe(recipe).name}
            </div>
            <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: C.textSecondary }}>
              {recipe.minutes && <span className="flex items-center gap-1"><Clock size={11} />{recipe.minutes}m</span>}
              {recipe.nutrition && (<>
                <span>·</span>
                <span className="font-bold" style={{ color: C.green }}>{recipe.nutrition.protein}g</span>
                <span>·</span>
                <span>{recipe.nutrition.kcal}kcal</span>
              </>)}
              <span>·</span>
              <span>{fmt(recipeStoreCost(recipe))}</span>
            </div>
          </>
        ) : (
          <div className="text-sm" style={{ color: C.textTertiary }}>{t.tapToAdd}</div>
        )}
      </div>
      {recipe ? (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
            <X size={14} style={{ color: C.textSecondary }} />
          </button>
          <ChevronRight size={18} style={{ color: C.textTertiary }} />
        </div>
      ) : (
        <Plus size={18} style={{ color: C.blue }} />
      )}
    </div>
  );
}
