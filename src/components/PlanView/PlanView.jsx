import React, { useState } from "react";
import { Shuffle, Printer } from "lucide-react";
import { C } from "../../constants/tokens";
import { DAYS, DAYS_FULL_EN, DAYS_FULL_SR, STORE_MULTIPLIERS } from "../../constants/config";
import { fmt, printHTML, calcPackages } from "../../utils/pricing";
import { tIng } from "../../data/ingredientDb";
import { NutritionStat } from "../shared/NutritionStat";
import { MealSlotRow } from "../MealSlotRow";
import { DayPickerSheet } from "../DayPickerSheet";
import { LeftoversSection } from "../LeftoversSection";

export function PlanView({ weekPlan, recipes, assignToDay, recipeStoreCost, people, store, onRandomize, onView, weekStoreCost, weekHFCost, mealsPlanned, t, lang, tRecipe, adjustedPrice, leftovers, onAddBonusRecipe }) {
  const [picker, setPicker] = useState(null);
  const total = weekStoreCost;
  const diff = weekHFCost - weekStoreCost;
  const isCheaper = diff > 0;
  const DAYS_FULL = lang === "sr" ? DAYS_FULL_SR : DAYS_FULL_EN;

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

  const handlePrintWeek = () => {
    const breakdown = buildRecipeBreakdown();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${t.weeklyShopping}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 24px; color: #1c1c1e; line-height: 1.5; }
  h1 { font-size: 26px; margin: 0 0 4px; font-weight: 800; letter-spacing: -0.02em; }
  .subtitle { color: #6e6e73; font-size: 13px; margin-bottom: 24px; }
  .recipe-block { margin-bottom: 24px; padding: 16px; border: 1px solid #e5e5ea; border-radius: 8px; page-break-inside: avoid; }
  .recipe-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .day-label { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #007AFF; background: #E8F0FE; padding: 2px 8px; border-radius: 10px; margin-right: 8px; vertical-align: middle; }
  .recipe-meta { font-size: 12px; color: #6e6e73; margin-bottom: 12px; }
  .recipe-meta .protein { color: #34C759; font-weight: 700; }
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
  <div class="subtitle">${STORE_MULTIPLIERS[store].name} · ${people} ${people === 1 ? t.person : t.peopleW} · ${breakdown.length} ${t.meals}</div>
  ${breakdown.map(({ day, slot, recipe, items, total: rtotal }) => {
    const lr = tRecipe(recipe);
    const slotLabel = slot === 'lunch' ? t.lunch : t.dinner;
    return `
    <div class="recipe-block">
      <div class="recipe-title">
        <span class="day-label">${DAYS_FULL[day]} · ${slotLabel}</span>
        <span>${recipe.emoji || ""}</span>
        <span>${lr.name}</span>
      </div>
      <div class="recipe-meta">${recipe.minutes ? recipe.minutes + ' ' + t.min : ''}${recipe.nutrition ? ' · <span class="protein">' + recipe.nutrition.protein + 'g ' + t.protein + '</span> · ' + recipe.nutrition.kcal + ' ' + t.kcal : ''}</div>
      <table>
        ${items.map(it => `
          <tr>
            <td class="qty">${it.packsNeeded}× ${it.packLabel}</td>
            <td>${tIng(it.name, lang)}</td>
            <td class="cost">${fmt(it.cost)}</td>
          </tr>`).join('')}
        <tr class="total-row">
          <td colspan="2">${t.total}</td>
          <td class="cost">${fmt(rtotal)}</td>
        </tr>
      </table>
    </div>`;
  }).join('')}
  <div class="grand">
    <span>${t.grandTotal}</span>
    <span>${fmt(total)}</span>
  </div>
  <div class="footer">${t.printDateLabel}: ${new Date().toLocaleDateString(lang === "sr" ? "sr-RS" : "en-US")} · ${t.aboutText}</div>
</body></html>`;
    printHTML(html);
  };

  const weekNutrition = Object.values(weekPlan).reduce((acc, slots) => {
    if (!slots || typeof slots !== 'object') return acc;
    [slots.lunch, slots.dinner].filter(Boolean).forEach(rid => {
      const r = recipes.find(x => x.id === rid);
      if (!r || !r.nutrition) return;
      acc.kcal += r.nutrition.kcal * people;
      acc.protein += r.nutrition.protein * people;
      acc.carbs += r.nutrition.carbs * people;
      acc.fat += r.nutrition.fat * people;
    });
    return acc;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="space-y-4">
      {mealsPlanned > 0 && (
        <div className="ios-card p-5">
          <div className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: C.textTertiary }}>
            {t.weekTotalAt} {STORE_MULTIPLIERS[store].name}
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="text-4xl font-bold tracking-tight">{fmt(total)}</div>
            {weekHFCost > 0 && (
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold mb-1.5"
                style={{ background: isCheaper ? C.greenSoft : C.orangeSoft, color: isCheaper ? C.green : C.orange }}>
                {isCheaper ? "−" : "+"}{fmt(Math.abs(diff))} vs HelloFresh
              </div>
            )}
          </div>
          <div className="text-sm mt-1" style={{ color: C.textSecondary }}>
            {mealsPlanned} {t.mealsPlanned}
          </div>

          {weekNutrition.protein > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: C.separator }}>
              <div className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: C.textTertiary }}>
                {t.nutritionWeek} ({mealsPlanned * people} {t.portions})
              </div>
              <div className="grid grid-cols-4 gap-2">
                <NutritionStat value={Math.round(weekNutrition.kcal)} label={t.kcal} color={C.text} />
                <NutritionStat value={Math.round(weekNutrition.protein) + "g"} label={t.protein} color={C.green} highlight />
                <NutritionStat value={Math.round(weekNutrition.carbs) + "g"} label={t.carbs} color={C.text} />
                <NutritionStat value={Math.round(weekNutrition.fat) + "g"} label={t.fat} color={C.text} />
              </div>
              <div className="text-[11px] mt-2 text-center" style={{ color: C.textTertiary }}>
                ≈ {Math.round(weekNutrition.kcal / mealsPlanned / people)} {t.kcal} · {Math.round(weekNutrition.protein / mealsPlanned / people)}g {t.protein} {t.perPortion}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onRandomize} className="ios-btn flex-1 p-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white"
          style={{ background: C.blue }}>
          <Shuffle size={18} strokeWidth={2.4} />
          {t.randomizeWeek}
        </button>
        {mealsPlanned > 0 && (
          <button onClick={handlePrintWeek} className="ios-btn flex-shrink-0 px-4 rounded-2xl flex items-center justify-center gap-2 font-semibold"
            style={{ background: C.card, color: C.blue, border: `1px solid ${C.separator}` }} title={t.printList}>
            <Printer size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div className="ios-card overflow-hidden">
        {DAYS.map((day, idx) => {
          const slots = weekPlan[day] || { lunch: null, dinner: null };
          const lunchRecipe = slots.lunch ? recipes.find(r => r.id === slots.lunch) : null;
          const dinnerRecipe = slots.dinner ? recipes.find(r => r.id === slots.dinner) : null;
          const isLast = idx === DAYS.length - 1;
          return (
            <div key={day}>
              <div className="px-4 pt-2.5 pb-0.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textTertiary }}>{day}</span>
                <span className="text-[10px]" style={{ color: C.textTertiary }}>·</span>
                <span className="text-[10px] font-medium" style={{ color: C.textTertiary }}>{DAYS_FULL[day]}</span>
              </div>
              <MealSlotRow
                slotLabel={t.lunch}
                recipe={lunchRecipe}
                onOpen={() => onView(lunchRecipe)}
                onAdd={() => setPicker({ day, slot: 'lunch' })}
                onClear={() => assignToDay(day, 'lunch', null)}
                recipeStoreCost={recipeStoreCost}
                tRecipe={tRecipe}
                t={t}
              />
              <div className="h-px ml-4" style={{ background: C.separator }} />
              <MealSlotRow
                slotLabel={t.dinner}
                recipe={dinnerRecipe}
                onOpen={() => onView(dinnerRecipe)}
                onAdd={() => setPicker({ day, slot: 'dinner' })}
                onClear={() => assignToDay(day, 'dinner', null)}
                recipeStoreCost={recipeStoreCost}
                tRecipe={tRecipe}
                t={t}
              />
              {!isLast && <div className="h-2" style={{ background: C.bg }} />}
            </div>
          );
        })}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-sm" style={{ color: C.textSecondary }}>
            No recipes yet — try Randomize to fill your week from the library.
          </p>
        </div>
      )}

      {mealsPlanned > 0 && leftovers && leftovers.length > 0 && (
        <LeftoversSection leftovers={leftovers} t={t} lang={lang} people={people} onAddBonusRecipe={onAddBonusRecipe} onView={onView} />
      )}

      {picker && (
        <DayPickerSheet day={picker.day} slot={picker.slot} recipes={recipes} onPick={(id) => { assignToDay(picker.day, picker.slot, id); setPicker(null); }} onClose={() => setPicker(null)} recipeStoreCost={recipeStoreCost} t={t} lang={lang} tRecipe={tRecipe} />
      )}
    </div>
  );
}
