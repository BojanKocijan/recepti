import React, { useState } from "react";
import { Search, X, Clock, Check, Plus, Sparkles } from "lucide-react";
import { C } from "../../constants/tokens";
import { MAIN_CATS, catLabel } from "../../constants/config";
import { fmt, calcPackages } from "../../utils/pricing";
import { tIng } from "../../data/ingredientDb";
import { HF_LIBRARY, RECIPE_SR } from "../../data/recipeDb";
import { Chip } from "../shared/Chip";
import { ActionTile } from "../shared/ActionTile";
import { CategoryBadge } from "../shared/CategoryBadge";

export function RecipesView({ recipes, recipeStoreCost, onAdd, onScan, onLibrary, onView, onDelete, onImport, adjustedPrice, people, t, lang, tRecipe }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const q = search.toLowerCase();
  const matchesSearch = (name) => !q || name.toLowerCase().includes(q);
  const matchesCat = (cat) => {
    if (filterCat === "all") return true;
    const c = cat ?? "dinner";
    if (filterCat === "other") return !MAIN_CATS.includes(c);
    return c === filterCat;
  };

  const myFiltered = recipes.filter(r => matchesSearch(tRecipe(r).name) && matchesCat(r.category));
  const importedSourceIds = new Set(recipes.filter(r => r.sourceId).map(r => r.sourceId));
  const libFiltered = HF_LIBRARY.filter(r => {
    const srName = RECIPE_SR[r.id]?.name || r.name;
    if (!matchesSearch(r.name) && !matchesSearch(srName)) return false;
    return matchesCat(r.category);
  });

  const libCost = (r) => {
    const scale = people / (r.people || 2);
    return r.ingredients.reduce((sum, it) => {
      const p = calcPackages(it, it.quantity * scale, adjustedPrice);
      return sum + (p.isPartial ? p.proRatedCost : p.fullPackCost);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <ActionTile icon={Sparkles} label={t.scan} onClick={onScan} color={C.purple} />
        <ActionTile icon={Plus} label={t.new} onClick={onAdd} color={C.green} />
      </div>

      <div className="ios-card flex items-center gap-2 px-3 py-2.5">
        <Search size={16} style={{ color: C.textTertiary }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchRecipes}
          className="flex-1 bg-transparent outline-none text-[15px]" />
        {search && <button onClick={() => setSearch("")} className="ios-btn"><X size={16} style={{ color: C.textTertiary }} /></button>}
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {[
          { key: "all",       label: lang === "sr" ? "Sve" : "All" },
          { key: "breakfast", label: `🌅 ${catLabel("breakfast", lang)}` },
          { key: "lunch",     label: `☀️ ${catLabel("lunch", lang)}` },
          { key: "dinner",    label: `🌙 ${catLabel("dinner", lang)}` },
          { key: "dessert",   label: `🍰 ${catLabel("dessert", lang)}` },
          { key: "other",     label: t.categoryOther },
        ].map(({ key, label }) => (
          <Chip key={key} label={label} active={filterCat === key} onClick={() => setFilterCat(key)} />
        ))}
      </div>

      {myFiltered.length > 0 && (
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: C.textSecondary }}>
            {lang === "sr" ? "Moji recepti" : "My recipes"} ({myFiltered.length})
          </div>
          <div className="space-y-2">
            {myFiltered.map((r) => {
              const localized = tRecipe(r);
              return (
                <button key={r.id} onClick={() => onView(r)} className="ios-btn w-full ios-card p-4 flex items-center gap-3 text-left">
                  <div className="text-3xl flex-shrink-0">{r.emoji || "🍽️"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{localized.name}</div>
                    <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap" style={{ color: C.textSecondary }}>
                      <CategoryBadge category={r.category} lang={lang} />
                      {r.minutes && <span className="flex items-center gap-1"><Clock size={11} />{r.minutes}m</span>}
                      {r.nutrition && (<>
                        <span>·</span>
                        <span className="font-bold" style={{ color: C.green }}>{r.nutrition.protein}g {t.protein}</span>
                        <span>·</span>
                        <span>{r.nutrition.kcal} {t.kcal}</span>
                      </>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-lg">{fmt(recipeStoreCost(r))}</div>
                    <div className="text-[10px]" style={{ color: C.textTertiary }}>{t.forN} {people}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {libFiltered.length > 0 && (
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: C.textSecondary }}>
            {lang === "sr" ? "Biblioteka" : "Library"} ({libFiltered.length})
          </div>
          <div className="space-y-2">
            {libFiltered.map((r) => {
              const imported = importedSourceIds.has(r.id);
              const displayName = lang === "sr" ? (RECIPE_SR[r.id]?.name || r.name) : r.name;
              return (
                <div key={r.id} className="ios-card p-3 flex items-center gap-3">
                  <button onClick={() => onView({ ...r, id: `lib-preview-${r.id}`, sourceId: r.id })} className="ios-btn flex items-center gap-3 flex-1 min-w-0 text-left">
                    <div className="text-3xl flex-shrink-0">{r.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px] truncate">{displayName}</div>
                      <div className="text-xs flex items-center gap-1.5 flex-wrap mt-0.5" style={{ color: C.textSecondary }}>
                        <CategoryBadge category={r.category} lang={lang} />
                        <span>{r.minutes}m</span>
                        <span>·</span>
                        <span className="font-bold" style={{ color: C.green }}>{r.nutrition?.protein}g</span>
                        <span style={{ color: C.textTertiary }}>{t.protein}</span>
                        <span>·</span>
                        <span>{r.nutrition?.kcal} {t.kcal}</span>
                        <span>·</span>
                        <span className="font-semibold">{fmt(libCost(r))}</span>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => onImport(r)} disabled={imported}
                    className="ios-btn px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 flex items-center gap-1"
                    style={{ background: imported ? C.greenSoft : C.blue, color: imported ? C.green : "#fff" }}>
                    {imported ? <><Check size={12} /> {t.added}</> : <><Plus size={12} /> {t.add}</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {myFiltered.length === 0 && libFiltered.length === 0 && (
        <div className="text-center py-8 text-sm" style={{ color: C.textSecondary }}>
          {t.noMatchesFor} "{search}"
        </div>
      )}
    </div>
  );
}
