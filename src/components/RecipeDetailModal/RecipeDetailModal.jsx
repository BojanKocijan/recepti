import React, { useState } from "react";
import { ChevronLeft, Printer, Clock, Users, Flame, ChefHat } from "lucide-react";
import { getHFPricePerPortion } from "../../constants/config";
import { fmt, printHTML, calcPackages } from "../../utils/pricing";
import { tIng, tUnit } from "../../data/ingredientDb";
import { NutritionStat } from "../shared/NutritionStat";
import { RecipeStepsTab } from "../RecipeStepsTab";
import { ShoppingListTab } from "../ShoppingListTab";
import { CookMode } from "../CookMode";

export function RecipeDetailModal({ recipe, onClose, onEdit, onUpdateSteps, adjustedPrice, people, store, t, lang }) {
  const [tab, setTab] = useState("recipe");
  const [cooking, setCooking] = useState(false);
  if (!recipe) return null;

  const recipePeople = recipe.people || 2;
  const scale = people / recipePeople;
  const shopping = recipe.ingredients.map((it) => {
    const scaledQty = it.quantity * scale;
    return { ...it, scaledQuantity: scaledQty, ...calcPackages(it, scaledQty, adjustedPrice) };
  });
  const totalCost = shopping.reduce((sum, i) => sum + (i.isPartial ? i.proRatedCost : i.fullPackCost), 0);
  const hfPerPortion = getHFPricePerPortion(people, 5);
  const hfMealCost = hfPerPortion * people;
  const diff = hfMealCost - totalCost;
  const isCheaper = diff > 0;

  const fmtQty = (q) => q < 0.1 ? q.toFixed(2) : q % 1 === 0 ? q.toString() : q.toFixed(2).replace(/\.?0+$/, "");

  const handlePrintRecipe = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${recipe.name}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 24px; color: #1c1c1e; line-height: 1.5; }
  .header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid #1c1c1e; margin-bottom: 24px; }
  .emoji { font-size: 56px; line-height: 1; margin-bottom: 8px; }
  h1 { font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.02em; }
  .meta { color: #6e6e73; font-size: 13px; margin-top: 8px; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .nutrition { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 24px 0; padding: 16px; background: #f2f2f7; border-radius: 12px; }
  .nut-stat { text-align: center; }
  .nut-val { font-size: 22px; font-weight: 800; }
  .nut-val.protein { color: #34C759; }
  .nut-label { font-size: 10px; color: #6e6e73; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 24px; }
  h2 { font-size: 16px; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1.5px solid #1c1c1e; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .ingredient { padding: 6px 0; border-bottom: 1px solid #f2f2f7; font-size: 13px; display: flex; gap: 8px; }
  .ing-qty { font-weight: 700; color: #007AFF; min-width: 80px; }
  .step { padding: 8px 0 8px 36px; position: relative; font-size: 13px; line-height: 1.6; }
  .step-num { position: absolute; left: 0; top: 6px; width: 24px; height: 24px; border-radius: 50%; background: #007AFF; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5ea; font-size: 11px; color: #aeaeb2; text-align: center; }
  @media print { body { margin: 0; } .columns { display: block; } .columns > div:last-child { margin-top: 24px; } }
  @media (max-width: 600px) { .columns { display: block; } .columns > div:last-child { margin-top: 24px; } }
</style></head><body>
  <div class="header">
    <div class="emoji">${recipe.emoji || "🍽️"}</div>
    <h1>${recipe.name}</h1>
    <div class="meta">
      ${recipe.minutes ? `<span>⏱ ${recipe.minutes} ${t.min}</span>` : ''}
      <span>👥 ${people} ${people === 1 ? t.person : t.peopleW}</span>
      <span>🥘 ${recipe.ingredients.length} ${t.items}</span>
    </div>
    ${recipe.tags ? `<div style="margin-top:8px;font-size:11px;color:#6e6e73">${recipe.tags.join(" · ")}</div>` : ''}
  </div>

  ${recipe.nutrition ? `
  <div class="nutrition">
    <div class="nut-stat"><div class="nut-val">${recipe.nutrition.kcal}</div><div class="nut-label">${t.kcal}</div></div>
    <div class="nut-stat"><div class="nut-val protein">${recipe.nutrition.protein}g</div><div class="nut-label">${t.protein}</div></div>
    <div class="nut-stat"><div class="nut-val">${recipe.nutrition.carbs}g</div><div class="nut-label">${t.carbs}</div></div>
    <div class="nut-stat"><div class="nut-val">${recipe.nutrition.fat}g</div><div class="nut-label">${t.fat}</div></div>
  </div>` : ''}

  <div class="columns">
    <div>
      <h2>${t.ingredients}</h2>
      ${shopping.map(it => `
        <div class="ingredient">
          <span class="ing-qty">${fmtQty(it.scaledQuantity)} ${tUnit(it.unit, lang)}</span>
          <span>${tIng(it.name, lang)}</span>
        </div>`).join('')}
    </div>
    <div>
      <h2>${t.instructions}</h2>
      ${(recipe.steps && recipe.steps.length > 0
        ? recipe.steps.map((s, idx) => `<div class="step"><span class="step-num">${idx + 1}</span>${s}</div>`).join('')
        : `<p style="color:#6e6e73;font-size:13px">${t.noInstructions}</p>`)}
    </div>
  </div>

  <div class="footer">${t.printDateLabel}: ${new Date().toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US")} · ${t.aboutText}</div>
</body></html>`;
    printHTML(html);
  };

  if (cooking) return <CookMode recipe={recipe} onClose={() => setCooking(false)} onUpdateSteps={onUpdateSteps} fmtQty={fmtQty} t={t} lang={lang} />;

  return (
    <div className="fixed inset-0 z-50 flex flex-col fade-in bg-c-bg">
      <header className="flex-shrink-0 sticky top-0 z-20 glass-white separator-b">
        <div className="max-w-3xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
          <button onClick={onClose} className="ios-btn px-2 py-1.5 rounded-full text-sm font-semibold flex items-center gap-0.5 text-c-blue">
            <ChevronLeft size={18} /> {t.back}
          </button>
          <div className="flex-1 min-w-0 text-center">
            <div className="text-sm font-bold truncate flex items-center justify-center gap-1.5">
              <span>{recipe.emoji || "🍽️"}</span>
              <span className="truncate">{recipe.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrintRecipe} className="ios-btn p-2 rounded-full text-c-blue bg-c-blue-soft" title={t.printRecipe}>
              <Printer size={16} strokeWidth={2.2} />
            </button>
            <button onClick={() => onEdit(recipe)} className="ios-btn px-2 py-1.5 rounded-full text-sm font-semibold text-c-blue">
              {t.edit}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-32 space-y-4">
          <div className="ios-card p-6 text-center">
            <div className="text-7xl mb-3">{recipe.emoji || "🍽️"}</div>
            <h1 className="text-3xl font-bold tracking-tight">{recipe.name}</h1>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-c-text-secondary">
              {recipe.minutes && <span className="flex items-center gap-1"><Clock size={14} />{recipe.minutes} {t.min}</span>}
              <span className="flex items-center gap-1"><Users size={14} />{people}</span>
              <span className="flex items-center gap-1"><Flame size={14} />{recipe.ingredients.length} {t.items}</span>
            </div>
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {recipe.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-c-bg text-c-text-secondary">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {recipe.nutrition && (
            <div className="ios-card p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-c-text-secondary">
                {t.perPortionLabel}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <NutritionStat value={recipe.nutrition.kcal} label={t.kcal} />
                <NutritionStat value={recipe.nutrition.protein + "g"} label={t.protein} highlight />
                <NutritionStat value={recipe.nutrition.carbs + "g"} label={t.carbs} />
                <NutritionStat value={recipe.nutrition.fat + "g"} label={t.fat} />
              </div>
            </div>
          )}

          <div className={`ios-card p-4 flex items-center justify-between ${isCheaper ? "bg-c-green-soft" : "bg-c-orange-soft"}`}>
            <div>
              <div className={`text-[10px] font-semibold uppercase tracking-wider ${isCheaper ? "text-c-green" : "text-c-orange"}`}>
                {isCheaper ? t.cheaperToCook : t.helloFreshCheaper}
              </div>
              <div className={`text-2xl font-bold mt-0.5 ${isCheaper ? "text-c-green" : "text-c-orange"}`}>
                {isCheaper ? t.save : t.costs}{fmt(Math.abs(diff))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-c-text-secondary">
                {t.yourCost}
              </div>
              <div className="text-2xl font-bold">{fmt(totalCost)}</div>
              <div className="text-[10px] text-c-text-secondary">{t.vsHF} {fmt(hfMealCost)}</div>
            </div>
          </div>

          <div className="ios-card p-1 flex gap-1 sticky top-[52px] z-10 glass-white-95">
            <button onClick={() => setTab("recipe")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "recipe" ? "bg-c-blue text-white" : "text-c-text"}`}>
              {t.recipe}
            </button>
            <button onClick={() => setTab("shop")}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${tab === "shop" ? "bg-c-blue text-white" : "text-c-text"}`}>
              {t.shoppingTab}
            </button>
          </div>

          {tab === "recipe" && <RecipeStepsTab recipe={recipe} shopping={shopping} fmtQty={fmtQty} onUpdateSteps={onUpdateSteps} t={t} lang={lang} />}
          {tab === "shop" && <ShoppingListTab shopping={shopping} fmtQty={fmtQty} totalCost={totalCost} store={store} scale={scale} recipePeople={recipePeople} people={people} t={t} lang={lang} />}
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pt-3 pb-6 glass-white-92 separator-t">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setCooking(true)} className="ios-btn w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-base bg-c-blue shadow-blue">
            <ChefHat size={20} strokeWidth={2.4} />
            {t.startCooking}
          </button>
        </div>
      </div>
    </div>
  );
}
