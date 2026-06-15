import React, { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { CATEGORY_CONFIG } from "../../constants/config";
import { INGREDIENT_DB, tIng, tUnit } from "../../data/ingredientDb";
import { fmt } from "../../utils/pricing";
import { SettingsRow } from "../shared/SettingsRow";

export function RecipeModal({ recipe, onSave, onClose, adjustedPrice, people, t, lang }) {
  const [name, setName] = useState(recipe?.name || "");
  const [emoji, setEmoji] = useState(recipe?.emoji || "🍽️");
  const [category, setCategory] = useState(recipe?.category || "dinner");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [recipePeople, setRecipePeople] = useState(recipe?.people || people);
  const [minutes, setMinutes] = useState(recipe?.minutes || 30);
  const [tags, setTags] = useState(recipe?.tags || []);
  const [steps, setSteps] = useState(recipe?.steps || []);
  const [nutrition, setNutrition] = useState(recipe?.nutrition || { kcal: "", protein: "", carbs: "", fat: "" });
  const [search, setSearch] = useState("");

  const filtered = INGREDIENT_DB.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const addIng = (it) => {
    const ex = ingredients.find((i) => i.name === it.name && i.unit === it.unit);
    if (ex) {
      setIngredients(ingredients.map((i) => i.name === it.name && i.unit === it.unit ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setIngredients([...ingredients, { ...it, quantity: 1 }]);
    }
    setSearch("");
  };
  const updateQty = (idx, qty) => {
    const arr = [...ingredients];
    arr[idx].quantity = Math.max(0.1, parseFloat(qty) || 0.1);
    setIngredients(arr);
  };
  const updatePrice = (idx, price) => {
    const arr = [...ingredients];
    arr[idx].price = Math.max(0, parseFloat(price.replace(",", ".")) || 0);
    delete arr[idx]._custom;
    setIngredients(arr);
  };
  const removeIng = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const toggleTag = (tag) => setTags(tags.includes(tag) ? tags.filter(x => x !== tag) : [...tags, tag]);

  const handleSave = () => {
    if (!name || ingredients.length === 0) return;
    const clean = ingredients.map(({ _custom, _scanned, ...rest }) => rest);
    const nutritionClean = nutrition.kcal || nutrition.protein
      ? { kcal: Number(nutrition.kcal) || 0, protein: Number(nutrition.protein) || 0, carbs: Number(nutrition.carbs) || 0, fat: Number(nutrition.fat) || 0 }
      : null;
    onSave({ id: recipe?.id, name, emoji, category, ingredients: clean, people: recipePeople, minutes, tags: tags.length > 0 ? tags : ["meat"], steps: steps.length > 0 ? steps : (recipe?.steps || null), nutrition: nutritionClean });
  };

  const ALL_TAGS = ["meat", "fish", "vegetarian", "vegan", "high-protein", "lean", "quick", "no-cook", "asian", "spicy"];
  const EMOJI_OPTIONS = ["🍽️","🍗","🐟","🥩","🍝","🍕","🍔","🌮","🥘","🍛","🍜","🥗","🍲","🍳","🥙","🌯","🍚","🥦","🍄","🧀"];
  const totalCost = ingredients.reduce((sum, i) => sum + adjustedPrice(i.price) * i.quantity, 0);
  const hasCustom = ingredients.some(i => i._custom);

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in overlay-dark" onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto h-[92vh] flex flex-col rounded-t-3xl slide-up overflow-hidden bg-c-bg" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-4 pt-3 pb-2 flex items-center justify-between bg-c-card separator-b">
          <button onClick={onClose} className="ios-btn px-2 py-1 text-sm font-semibold text-c-blue">{t.cancel}</button>
          <h2 className="font-bold">{recipe?._scanned ? t.reviewScanned : (recipe?.id ? t.editRecipe : t.newRecipe)}</h2>
          <button onClick={handleSave} disabled={!name || ingredients.length === 0} className="ios-btn px-2 py-1 text-sm font-bold disabled:opacity-30 text-c-blue">{t.saveBtn}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
          {hasCustom && (
            <div className="ios-card p-3 flex items-start gap-2 text-sm bg-c-orange-soft">
              <Sparkles size={14} className="text-c-orange mt-0.5 flex-shrink-0" />
              <span className="text-c-text">{t.customNote}</span>
            </div>
          )}

          <div className="ios-card p-4">
            <div className="flex gap-3 items-center">
              <select value={emoji} onChange={(e) => setEmoji(e.target.value)} className="text-3xl bg-transparent outline-none cursor-pointer w-14 text-center">
                {EMOJI_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.newRecipe}
                className="flex-1 text-lg font-bold bg-transparent outline-none" />
            </div>
          </div>

          <div className="ios-card overflow-hidden">
            <SettingsRow label={t.serves}>
              <select value={recipePeople} onChange={(e) => setRecipePeople(Number(e.target.value))} className="bg-transparent outline-none font-medium text-c-blue">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? t.person : t.peopleW}</option>)}
              </select>
            </SettingsRow>
            <SettingsRow label={t.time} last>
              <input type="number" min="5" max="240" value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 30)}
                className="bg-transparent outline-none font-medium w-12 text-right text-c-blue" />
              <span className="ml-1 text-c-text-secondary">{t.min}</span>
            </SettingsRow>
          </div>

          <div className="ios-card overflow-hidden">
            <SettingsRow label={t.category} last>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent outline-none font-medium text-[15px] text-c-blue">
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {lang === "sr" ? v.labelSr : v.labelEn}</option>
                ))}
              </select>
            </SettingsRow>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2 text-c-text-secondary">{t.tags}</h3>
            <div className="ios-card p-3 flex flex-wrap gap-1.5">
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`ios-btn px-2.5 py-1 rounded-full text-xs font-semibold ${tags.includes(tag) ? "bg-c-blue text-white" : "bg-c-bg text-c-text"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2 text-c-text-secondary">
              {t.nutritionPerPortion} <span className="text-c-text-tertiary">{t.optional}</span>
            </h3>
            <div className="ios-card p-3 grid grid-cols-4 gap-2">
              {[
                { key: "kcal", label: t.kcal, placeholder: "480" },
                { key: "protein", label: t.protein + " g", placeholder: "45" },
                { key: "carbs", label: t.carbs + " g", placeholder: "40" },
                { key: "fat", label: t.fat + " g", placeholder: "12" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="text-center">
                  <input type="number" min="0" value={nutrition[key] || ""}
                    onChange={(e) => setNutrition({ ...nutrition, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full text-center text-lg font-bold rounded-lg py-1.5 outline-none bg-c-bg ${key === "protein" ? "text-c-green" : "text-c-text"}`} />
                  <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5 text-c-text-tertiary">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2 text-c-text-secondary">
              {t.ingredientsCount} ({ingredients.length})
            </h3>
            <div className="ios-card overflow-hidden">
              {ingredients.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-c-text-secondary">
                  {t.searchAndAdd}
                </div>
              ) : (
                ingredients.map((it, idx) => (
                  <div key={idx} className={`px-3 py-2.5 flex items-center gap-2 ${idx < ingredients.length - 1 ? "separator-b" : ""}`}>
                    <input type="number" step="0.1" min="0.1" value={it.quantity} onChange={(e) => updateQty(idx, e.target.value)}
                      className="w-14 text-center bg-transparent rounded-md py-1 text-sm font-semibold bg-c-bg text-c-text" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm flex items-center gap-1.5">
                        {tIng(it.name, lang)}
                        {it._custom && <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-c-orange text-white">{t.setPrice}</span>}
                      </div>
                      <div className="text-[10px] text-c-text-tertiary">{tUnit(it.unit, lang)}</div>
                    </div>
                    {it._custom ? (
                      <input type="text" defaultValue={it.price.toFixed(2)} onBlur={(e) => updatePrice(idx, e.target.value)} placeholder="€"
                        className="w-16 text-right rounded-md px-2 py-1 text-sm font-semibold bg-c-orange-soft text-c-text" />
                    ) : (
                      <span className="text-sm font-semibold w-16 text-right">{fmt(adjustedPrice(it.price) * it.quantity)}</span>
                    )}
                    <button onClick={() => removeIng(idx)} className="ios-btn p-1">
                      <X size={14} className="text-c-text-tertiary" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="ios-card flex items-center gap-2 px-3 py-2.5">
              <Search size={16} className="text-c-text-tertiary" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchIngredient}
                className="flex-1 bg-transparent outline-none text-[15px]" />
            </div>
            {search && (
              <div className="ios-card mt-2 max-h-56 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-3 text-sm text-center text-c-text-secondary">{t.noMatches}</div>
                ) : filtered.slice(0, 10).map(it => (
                  <button key={it.name} onClick={() => addIng(it)}
                    className="ios-btn w-full px-4 py-2.5 flex items-center justify-between text-left text-sm separator-b">
                    <span>{tIng(it.name, lang)} <span className="text-xs text-c-text-tertiary">/ {tUnit(it.unit, lang)}</span></span>
                    <span className="font-semibold">{fmt(adjustedPrice(it.price))}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ios-card p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-c-text-secondary">{t.totalFor} {recipePeople} {recipePeople === 1 ? t.person : t.peopleW}</span>
            <span className="text-2xl font-bold">{fmt(totalCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
