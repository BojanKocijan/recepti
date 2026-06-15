import React, { useState } from "react";
import { ShoppingCart, ChefHat, TrendingDown, TrendingUp, Printer } from "lucide-react";
import { DAYS, DAYS_FULL_EN, DAYS_FULL_SR, STORE_MULTIPLIERS, HF_SHIPPING } from "../../constants/config";
import { fmt, printHTML, calcPackages } from "../../utils/pricing";
import { tIng } from "../../data/ingredientDb";

export function CompareView({ weekStoreCost, weekHFCost, savings, savingsPercent, shoppingList, adjustedPrice, store, people, mealsPlanned, t, lang, weekPlan, recipes, tRecipe, recipeStoreCost }) {
  const [shopMode, setShopMode] = useState("combined");

  const buildRecipeBreakdown = () => {
    const result = [];
    DAYS.forEach((day) => {
      const slots = weekPlan[day];
      if (!slots || typeof slots !== 'object') return;
      ['lunch', 'dinner'].forEach(slot => {
        const rid = slots[slot];
        if (!rid) return;
        const r = recipes.find(x => x.id === rid);
        if (!r) return;
        const scale = people / (r.people || 2);
        const items = r.ingredients.map((it) => {
          const scaledQty = it.quantity * scale;
          const pack = calcPackages(it, scaledQty, adjustedPrice);
          return { ...it, scaledQuantity: scaledQty, ...pack, cost: pack.isPartial ? pack.proRatedCost : pack.fullPackCost };
        });
        result.push({ day, slot, recipe: r, items, total: recipeStoreCost(r) });
      });
    });
    return result;
  };

  const recipeBreakdown = buildRecipeBreakdown();

  const handlePrintWeekly = () => {
    const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${t.weeklyShopping}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 24px; color: #1c1c1e; line-height: 1.5; }
  h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; letter-spacing: -0.02em; }
  .subtitle { color: #6e6e73; font-size: 13px; margin-bottom: 24px; }
  h2 { font-size: 17px; margin: 28px 0 8px; padding-bottom: 6px; border-bottom: 2px solid #1c1c1e; font-weight: 700; }
  .recipe-block { margin-bottom: 24px; padding: 16px; border: 1px solid #e5e5ea; border-radius: 8px; page-break-inside: avoid; }
  .recipe-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .day-label { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #007AFF; background: #E8F0FE; padding: 2px 8px; border-radius: 10px; margin-right: 8px; vertical-align: middle; }
  .recipe-meta { font-size: 12px; color: #6e6e73; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; border-bottom: 1px solid #f2f2f7; font-size: 13px; }
  td.qty { width: 90px; font-weight: 700; color: #007AFF; }
  td.cost { text-align: right; width: 70px; font-weight: 600; }
  .total-row td { border-top: 2px solid #1c1c1e; border-bottom: none; padding-top: 8px; font-weight: 700; font-size: 14px; }
  .grand { margin-top: 32px; padding: 16px; background: #1c1c1e; color: #fff; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; }
  .footer { margin-top: 24px; font-size: 11px; color: #aeaeb2; text-align: center; }
  @media print { body { margin: 0; } .recipe-block { break-inside: avoid; } }
</style></head><body>
  <h1>${t.weeklyShopping}</h1>
  <div class="subtitle">${STORE_MULTIPLIERS[store].name} · ${people} ${people === 1 ? t.person : t.peopleW} · ${recipeBreakdown.length} ${t.meals}</div>
  ${recipeBreakdown.map(({ day, slot, recipe, items, total }) => {
    const lr = tRecipe(recipe);
    const slotLabel = slot === 'lunch' ? t.lunch : t.dinner;
    return `
    <div class="recipe-block">
      <div class="recipe-title">
        <span class="day-label">${DAYS_FULL[day]} · ${slotLabel}</span>
        <span>${recipe.emoji || ""}</span>
        <span>${lr.name}</span>
      </div>
      <div class="recipe-meta">${recipe.minutes ? recipe.minutes + ' ' + t.min : ''}${recipe.nutrition ? ' · ' + recipe.nutrition.protein + 'g ' + t.protein + ' · ' + recipe.nutrition.kcal + ' ' + t.kcal : ''}</div>
      <table>
        ${items.map(it => `
          <tr>
            <td class="qty">${it.packsNeeded}× ${it.packLabel}</td>
            <td>${tIng(it.name, lang)}</td>
            <td class="cost">${fmt(it.cost)}</td>
          </tr>`).join('')}
        <tr class="total-row">
          <td colspan="2">${t.total}</td>
          <td class="cost">${fmt(total)}</td>
        </tr>
      </table>
    </div>`;
  }).join('')}
  <div class="grand">
    <span>${t.grandTotal}</span>
    <span>${fmt(weekStoreCost)}</span>
  </div>
  <div class="footer">${t.printDateLabel}: ${new Date().toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US")} · ${t.aboutText}</div>
</body></html>`;
    printHTML(html);
  };

  if (mealsPlanned === 0) {
    return (
      <div className="ios-card p-8 text-center">
        <div className="text-5xl mb-3">🛒</div>
        <p className="font-semibold text-lg">{t.nothingPlanned}</p>
        <p className="text-sm mt-1 text-c-text-secondary">{t.planSomeMeals}</p>
      </div>
    );
  }

  const isHFCheaper = savings < 0;
  const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;
  return (
    <div className="space-y-4">
      <div className={`ios-card p-5 ${isHFCheaper ? "bg-c-orange-soft" : "bg-c-green-soft"}`}>
        <div className="flex items-center gap-2 mb-2">
          {isHFCheaper
            ? <TrendingUp size={16} className="text-c-orange" />
            : <TrendingDown size={16} className="text-c-green" />}
          <span className={`text-xs font-semibold uppercase tracking-wider ${isHFCheaper ? "text-c-orange" : "text-c-green"}`}>
            {isHFCheaper ? t.helloFreshWins : t.cookingWins}
          </span>
        </div>
        <div className={`text-5xl font-bold tracking-tight ${isHFCheaper ? "text-c-orange" : "text-c-green"}`}>
          {fmt(Math.abs(savings))}
        </div>
        <div className="text-sm mt-1 text-c-text">
          {isHFCheaper ? `${Math.abs(savingsPercent).toFixed(0)}${t.lessThanCooking}` : `${savingsPercent.toFixed(0)}${t.savedByCooking}`}
          {" · "}
          <span className="text-c-text-secondary">{fmt(Math.abs(savings * 52))}{t.perYear}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="ios-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ShoppingCart size={14} className="text-c-text-secondary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-c-text-secondary">{STORE_MULTIPLIERS[store].name}</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">{fmt(weekStoreCost)}</div>
          <div className="text-[11px] mt-0.5 text-c-text-tertiary">{mealsPlanned} {t.meals} · {mealsPlanned * people} {t.portions}</div>
        </div>
        <div className="ios-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ChefHat size={14} className="text-c-text-secondary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-c-text-secondary">HelloFresh</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">{fmt(weekHFCost)}</div>
          <div className="text-[11px] mt-0.5 text-c-text-tertiary">{t.inclShipping.replace("{shipping}", fmt(HF_SHIPPING))}</div>
        </div>
      </div>

      <div className="ios-card overflow-hidden">
        <div className="px-4 py-3 separator-b flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base truncate">{t.weeklyShopping}</h3>
            <p className="text-xs mt-0.5 truncate text-c-text-secondary">{t.packsToBuy} {STORE_MULTIPLIERS[store].name}</p>
          </div>
          <button onClick={handlePrintWeekly} className="ios-btn flex-shrink-0 p-2 rounded-full flex items-center gap-1 bg-c-blue-soft text-c-blue">
            <Printer size={16} strokeWidth={2.2} />
            <span className="text-xs font-bold pr-1">{t.printList}</span>
          </button>
        </div>

        <div className="px-3 py-2 flex gap-1 separator-b">
          <button onClick={() => setShopMode("byRecipe")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${shopMode === "byRecipe" ? "bg-c-blue text-white" : "text-c-text"}`}>
            {t.byRecipe}
          </button>
          <button onClick={() => setShopMode("combined")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${shopMode === "combined" ? "bg-c-blue text-white" : "text-c-text"}`}>
            {t.combined}
          </button>
        </div>

        {shopMode === "byRecipe" && (
          <div>
            {recipeBreakdown.map(({ day, slot, recipe, items, total }, ridx) => {
              const lr = tRecipe(recipe);
              const slotLabel = slot === 'lunch' ? t.lunch : t.dinner;
              return (
                <div key={`${day}-${slot}`} className={ridx < recipeBreakdown.length - 1 ? "border-b-4 border-c-bg" : ""}>
                  <div className="px-4 py-3 flex items-center gap-2 bg-c-bg">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${slot === 'lunch' ? "bg-c-orange" : "bg-c-blue"}`}>
                      {DAYS_FULL[day]} {slotLabel}
                    </span>
                    <span className="text-xl">{recipe.emoji}</span>
                    <span className="font-semibold text-sm flex-1 truncate">{lr.name}</span>
                    <span className="text-sm font-bold">{fmt(total)}</span>
                  </div>
                  {items.map((it, iidx) => (
                    <div key={iidx} className={`px-4 py-2 flex items-center gap-3 ${iidx < items.length - 1 ? "separator-b" : ""}`}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-c-blue-soft">
                        <span className="text-xs font-bold text-c-blue">{it.packsNeeded}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{tIng(it.name, lang)}</div>
                        <div className="text-[11px] text-c-text-tertiary">{it.packLabel}</div>
                      </div>
                      <div className="text-sm font-semibold">{fmt(it.cost)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {shopMode === "combined" && (
          <div>
            {shoppingList.map((item, i) => {
              const pack = calcPackages(item, item.quantity, adjustedPrice);
              const cost = pack.isPartial ? pack.proRatedCost : pack.fullPackCost;
              return (
                <div key={i} className={`px-4 py-2.5 flex items-center gap-3 ${i < shoppingList.length - 1 ? "separator-b" : ""}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-c-blue-soft">
                    <span className="text-xs font-bold text-c-blue">{pack.packsNeeded}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{tIng(item.name, lang)}</div>
                    <div className="text-[11px] text-c-text-tertiary">{pack.packLabel}</div>
                  </div>
                  <div className="font-semibold text-sm">{fmt(cost)}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="px-4 py-3 flex items-center justify-between bg-c-text text-white">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{t.grandTotal}</span>
          <span className="text-xl font-bold">{fmt(weekStoreCost)}</span>
        </div>
      </div>
    </div>
  );
}
