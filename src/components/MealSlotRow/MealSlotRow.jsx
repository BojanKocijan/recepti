import React from "react";
import { X, Plus, ChevronRight, Clock } from "lucide-react";
import { fmt } from "../../utils/pricing";

export function MealSlotRow({ slotLabel, recipe, onOpen, onAdd, onClear, recipeStoreCost, tRecipe, t }) {
  return (
    <div onClick={() => recipe ? onOpen() : onAdd()}
      className="ios-btn flex items-center gap-3 px-4 py-3 cursor-pointer">
      <div className="w-12 flex-shrink-0">
        <div className="text-[11px] font-semibold text-c-text-tertiary">{slotLabel}</div>
      </div>
      <div className="flex-1 min-w-0">
        {recipe ? (
          <>
            <div className="font-semibold truncate flex items-center gap-2">
              {recipe.emoji && <span>{recipe.emoji}</span>}
              {tRecipe(recipe).name}
            </div>
            <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap text-c-text-secondary">
              {recipe.minutes && <span className="flex items-center gap-1"><Clock size={11} />{recipe.minutes}m</span>}
              {recipe.nutrition && (<>
                <span>·</span>
                <span className="font-bold text-c-green">{recipe.nutrition.protein}g</span>
                <span>·</span>
                <span>{recipe.nutrition.kcal}kcal</span>
              </>)}
              <span>·</span>
              <span>{fmt(recipeStoreCost(recipe))}</span>
            </div>
          </>
        ) : (
          <div className="text-sm text-c-text-tertiary">{t.tapToAdd}</div>
        )}
      </div>
      {recipe ? (
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="ios-btn p-2 rounded-full bg-c-bg">
            <X size={14} className="text-c-text-secondary" />
          </button>
          <ChevronRight size={18} className="text-c-text-tertiary" />
        </div>
      ) : (
        <Plus size={18} className="text-c-blue" />
      )}
    </div>
  );
}
