import React, { useState } from "react";
import { Search, X, Check, Plus } from "lucide-react";
import { C } from "../../constants/tokens";
import { fmt, calcPackages } from "../../utils/pricing";
import { HF_LIBRARY, RECIPE_SR } from "../../data/recipeDb";
import { Chip } from "../shared/Chip";

export function LibraryModal({ onClose, recipes, onImport, adjustedPrice, people, t, lang, tRecipe }) {
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const importedSourceIds = new Set(recipes.filter(r => r.sourceId).map(r => r.sourceId));
  const filtered = HF_LIBRARY.filter((r) => {
    const localizedName = (RECIPE_SR[r.id]?.name || r.name).toLowerCase();
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !localizedName.includes(search.toLowerCase())) return false;
    if (filterTag !== "all" && !r.tags.includes(filterTag)) return false;
    return true;
  });

  const recipeCost = (r) => {
    const recipePeople = r.people || 2;
    const scale = people / recipePeople;
    return r.ingredients.reduce((sum, it) => {
      const sq = it.quantity * scale;
      const p = calcPackages(it, sq, adjustedPrice);
      return sum + (p.isPartial ? p.proRatedCost : p.fullPackCost);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto h-[92vh] flex flex-col rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-4 pt-3 pb-3" style={{ background: C.card }}>
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: C.separator }} />
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">{t.recipeLibrary}</h2>
            <button onClick={onClose} className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
              <X size={18} style={{ color: C.text }} />
            </button>
          </div>
          <div className="ios-card flex items-center gap-2 px-3 py-2.5 mb-3" style={{ background: C.bg }}>
            <Search size={16} style={{ color: C.textTertiary }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search25}
              className="flex-1 bg-transparent outline-none text-[15px]" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {["all", "high-protein", "lean", "meat", "fish", "vegetarian", "vegan", "quick", "no-cook"].map((tag) => (
              <Chip key={tag} label={tag} active={filterTag === tag} onClick={() => setFilterTag(tag)} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-8">
          {filtered.map((r) => {
            const imported = importedSourceIds.has(r.id);
            const displayName = lang === "sr" ? (RECIPE_SR[r.id]?.name || r.name) : r.name;
            return (
              <div key={r.id} className="ios-card p-3 flex items-center gap-3">
                <div className="text-3xl flex-shrink-0">{r.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] truncate">{displayName}</div>
                  <div className="text-xs flex items-center gap-1.5 flex-wrap mt-0.5" style={{ color: C.textSecondary }}>
                    <span>{r.minutes}m</span>
                    <span>·</span>
                    <span className="font-bold" style={{ color: C.green }}>{r.nutrition?.protein}g</span>
                    <span style={{ color: C.textTertiary }}>{t.protein}</span>
                    <span>·</span>
                    <span>{r.nutrition?.kcal} {t.kcal}</span>
                    <span>·</span>
                    <span className="font-semibold">{fmt(recipeCost(r))}</span>
                  </div>
                </div>
                <button onClick={() => onImport(r)} disabled={imported}
                  className="ios-btn px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 flex items-center gap-1"
                  style={{ background: imported ? C.greenSoft : C.blue, color: imported ? C.green : "#fff" }}>
                  {imported ? <><Check size={12} /> {t.added}</> : <><Plus size={12} /> {t.add}</>}
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: C.textSecondary }}>{t.noRecipesMatch}</div>
          )}
        </div>
      </div>
    </div>
  );
}
