import React, { useState, useEffect } from "react";
import { Calendar, ChefHat, TrendingDown, Settings, Loader2 } from "lucide-react";
import { T } from "./constants/translations";
import { DAYS, STORE_MULTIPLIERS, HF_SHIPPING, DEFAULT_PREFS, getHFPricePerPortion } from "./constants/config";
import { calcPackages, calcLeftover } from "./utils/pricing";
import { tIng, tUnit } from "./data/ingredientDb";
import { HF_LIBRARY, RECIPE_SR } from "./data/recipeDb";
import {
  getRecipes,
  upsertRecipe,
  deleteRecipe as dbDeleteRecipe,
  migrateFromLocalStorage,
} from "./services/recipeService";
import { fetchStoreMultiplier } from "./services/storePrices";
import { Chip } from "./components/shared/Chip";
import { PlanView } from "./components/PlanView";
import { RecipesView } from "./components/RecipesView";
import { CompareView } from "./components/CompareView";
import { RecipeDetailModal } from "./components/RecipeDetailModal";
import { RecipeModal } from "./components/RecipeModal";
import { ScanModal } from "./components/ScanModal";
import { LibraryModal } from "./components/LibraryModal";
import { PrefsModal } from "./components/PrefsModal";

export default function MealPlannerApp() {
  const [store, setStore] = useState("ah");
  const [people, setPeople] = useState(2);
  const [lang, setLang] = useState("en");
  const [liveMultiplier, setLiveMultiplier] = useState(1.0);
  const [fetchingStore, setFetchingStore] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [weekPlan, setWeekPlan] = useState({});
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [activeView, setActiveView] = useState("plan");
  const [loading, setLoading] = useState(true);

  const t = T[lang];

  useEffect(() => {
    (async () => {
      try {
        const [r, p5, p4, s, pr] = await Promise.all([
          window.storage.get("recipes_v4").catch(() => null),
          window.storage.get("weekPlan_v5").catch(() => null),
          window.storage.get("weekPlan_v4").catch(() => null),
          window.storage.get("settings_v4").catch(() => null),
          window.storage.get("prefs_v4").catch(() => null),
        ]);
        if (p5) {
          setWeekPlan(JSON.parse(p5.value));
        } else if (p4) {
          const old = JSON.parse(p4.value);
          const migrated = {};
          DAYS.forEach(d => { migrated[d] = { lunch: null, dinner: old[d] ?? null }; });
          setWeekPlan(migrated);
        }
        if (s) {
          const v = JSON.parse(s.value);
          if (v.store) { setStore(v.store); setLiveMultiplier(STORE_MULTIPLIERS[v.store]?.multiplier ?? 1.0); }
          if (v.people) setPeople(v.people);
          if (v.lang) setLang(v.lang);
        }
        if (pr) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(pr.value) });

        const localRecipes = r ? JSON.parse(r.value) : [];
        await migrateFromLocalStorage(localRecipes);

        const dbRecipes = await getRecipes();
        if (dbRecipes.length > 0) {
          setRecipes(dbRecipes);
        } else if (localRecipes.length > 0) {
          setRecipes(localRecipes);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const persist = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch (e) { console.error(e); } };
  useEffect(() => { if (!loading) persist("weekPlan_v5", weekPlan); }, [weekPlan, loading]);
  useEffect(() => { if (!loading) persist("settings_v4", { store, people, lang }); }, [store, people, lang, loading]);
  useEffect(() => { if (!loading) persist("prefs_v4", prefs); }, [prefs, loading]);

  const tRecipe = (recipe) => {
    if (lang !== "sr" || !recipe) return recipe;
    const sr = recipe.sourceId ? RECIPE_SR[recipe.sourceId] : RECIPE_SR[recipe.id];
    return {
      ...recipe,
      name: sr?.name || recipe.name,
      steps: sr?.steps || recipe.steps,
      ingredients: recipe.ingredients.map(i => ({ ...i, displayName: tIng(i.name, lang), displayUnit: tUnit(i.unit, lang) })),
    };
  };

  const handleStoreChange = async (newStore) => {
    setStore(newStore);
    setLiveMultiplier(STORE_MULTIPLIERS[newStore]?.multiplier ?? 1.0);
    if (newStore === "ah") return;
    setFetchingStore(true);
    try {
      const m = await fetchStoreMultiplier(newStore, STORE_MULTIPLIERS[newStore]?.multiplier ?? 1.0);
      setLiveMultiplier(m);
    } finally {
      setFetchingStore(false);
    }
  };

  const adjustedPrice = (basePrice) => basePrice * liveMultiplier;

  const recipeStoreCost = (recipe) => {
    const recipePeople = recipe.people || 2;
    const scale = people / recipePeople;
    return recipe.ingredients.reduce((sum, it) => {
      const scaledQty = it.quantity * scale;
      const pack = calcPackages(it, scaledQty, adjustedPrice);
      return sum + (pack.isPartial ? pack.proRatedCost : pack.fullPackCost);
    }, 0);
  };

  const mealsPlanned = Object.values(weekPlan).reduce((sum, slots) => {
    if (!slots || typeof slots !== 'object') return sum;
    return sum + (slots.lunch ? 1 : 0) + (slots.dinner ? 1 : 0);
  }, 0);
  const dinnerCount = Object.values(weekPlan).filter(
    slots => slots && typeof slots === 'object' && Boolean(slots.dinner)
  ).length;

  const weekStoreCost = () =>
    Object.values(weekPlan).reduce((sum, slots) => {
      if (!slots || typeof slots !== 'object') return sum;
      return sum + [slots.lunch, slots.dinner].filter(Boolean).reduce((s, rid) => {
        const r = recipes.find((x) => x.id === rid);
        return s + (r ? recipeStoreCost(r) : 0);
      }, 0);
    }, 0);

  const weekHFCost = () => {
    if (dinnerCount === 0) return 0;
    return dinnerCount * getHFPricePerPortion(people, dinnerCount) * people + HF_SHIPPING;
  };

  const savings = weekHFCost() - weekStoreCost();
  const savingsPercent = weekHFCost() > 0 ? (savings / weekHFCost()) * 100 : 0;

  const addOrUpdateRecipe = async (recipe) => {
    const saved = { ...recipe, id: recipe.id || Date.now().toString() };
    await upsertRecipe(saved);
    if (editingRecipe?.id) {
      setRecipes(recipes.map((r) => (r.id === saved.id ? { ...r, ...saved } : r)));
    } else {
      setRecipes((prev) => [...prev, saved]);
    }
    setEditingRecipe(null);
    setShowRecipeModal(false);
  };

  const handleDeleteRecipe = async (id) => {
    await dbDeleteRecipe(id);
    setRecipes(recipes.filter((r) => r.id !== id));
    const np = { ...weekPlan };
    Object.keys(np).forEach((d) => {
      const slots = np[d];
      if (!slots || typeof slots !== 'object') return;
      np[d] = { lunch: slots.lunch === id ? null : slots.lunch, dinner: slots.dinner === id ? null : slots.dinner };
    });
    setWeekPlan(np);
  };

  const updateRecipeSteps = async (id, steps) => {
    const target = recipes.find(r => r.id === id);
    if (target) await upsertRecipe({ ...target, steps });
    setRecipes(recipes.map(r => r.id === id ? { ...r, steps } : r));
    if (viewingRecipe?.id === id) setViewingRecipe({ ...viewingRecipe, steps });
  };

  const assignToDay = (day, slot, recipeId) => {
    const current = weekPlan[day] || { lunch: null, dinner: null };
    setWeekPlan({ ...weekPlan, [day]: { ...current, [slot]: recipeId || null } });
  };

  const importFromLibrary = async (lib) => {
    const existing = recipes.find((r) => r.sourceId === lib.id);
    if (existing) return existing.id;
    const nr = { ...lib, id: `lib-${lib.id}-${Date.now()}`, sourceId: lib.id };
    await upsertRecipe(nr);
    setRecipes((p) => [...p, nr]);
    return nr.id;
  };

  const randomizeWeek = async () => {
    const dietFilter = (r) => {
      if (prefs.diet === "vegan") return r.tags.includes("vegan");
      if (prefs.diet === "vegetarian") return r.tags.includes("vegetarian") || r.tags.includes("vegan");
      if (prefs.diet === "pescatarian") return !r.tags.includes("meat");
      return true;
    };
    const proteinFilter = (r) => {
      if (prefs.diet !== "any") return true;
      return ["meat","fish","vegan","vegetarian"].some(p => r.tags.includes(p) && prefs.proteins[p]);
    };
    const minFilter = (r) => r.minutes <= prefs.maxMinutes;

    const userOnly = recipes.filter(r => !r.sourceId).map(r => ({ ...r, _user: true }));
    const allCandidates = [...HF_LIBRARY, ...userOnly];

    const dinnerCandidates = allCandidates.filter(r => !r.category || r.category === 'dinner')
      .filter(dietFilter).filter(proteinFilter).filter(minFilter);
    const lunchCandidates = allCandidates.filter(r => ['lunch','soup','salad'].includes(r.category))
      .filter(dietFilter).filter(minFilter);

    if (dinnerCandidates.length === 0 && lunchCandidates.length === 0) {
      alert("No recipes match your preferences."); return;
    }

    const np = {}; DAYS.forEach(d => np[d] = { lunch: null, dinner: null });
    const nr = [...recipes];
    const toUpsert = [];

    const assignRec = (rec, day, slot, uniqIdx) => {
      if (rec._user) { np[day][slot] = rec.id; return; }
      const ex = nr.find(r => r.sourceId === rec.id);
      if (ex) { np[day][slot] = ex.id; return; }
      const id = `lib-${rec.id}-${Date.now()}-${slot}-${uniqIdx}`;
      const newRec = { ...rec, id, sourceId: rec.id };
      nr.push(newRec); toUpsert.push(newRec);
      np[day][slot] = id;
    };

    if (dinnerCandidates.length > 0) {
      const shuffled = [...dinnerCandidates].sort(() => Math.random() - 0.5);
      const count = Math.min(prefs.mealsPerWeek, 7, shuffled.length);
      const days = [...DAYS].sort(() => Math.random() - 0.5).slice(0, count).sort((a,b) => DAYS.indexOf(a) - DAYS.indexOf(b));
      shuffled.slice(0, count).forEach((rec, idx) => assignRec(rec, days[idx], 'dinner', idx));
    }

    if (lunchCandidates.length > 0) {
      const shuffled = [...lunchCandidates].sort(() => Math.random() - 0.5);
      const count = Math.min(prefs.mealsPerWeek, 7, shuffled.length);
      const days = [...DAYS].sort(() => Math.random() - 0.5).slice(0, count).sort((a,b) => DAYS.indexOf(a) - DAYS.indexOf(b));
      shuffled.slice(0, count).forEach((rec, idx) => assignRec(rec, days[idx], 'lunch', idx + 100));
    }

    await Promise.all(toUpsert.map(upsertRecipe));
    setRecipes(nr); setWeekPlan(np); setActiveView("plan");
  };

  const shoppingList = () => {
    const map = {};
    Object.values(weekPlan).forEach((slots) => {
      if (!slots || typeof slots !== 'object') return;
      [slots.lunch, slots.dinner].filter(Boolean).forEach((rid) => {
        const r = recipes.find((x) => x.id === rid);
        if (!r) return;
        const scale = people / (r.people || 2);
        r.ingredients.forEach((it) => {
          const key = `${it.name}|${it.unit}`;
          if (!map[key]) map[key] = { name: it.name, unit: it.unit, quantity: 0, price: it.price };
          map[key].quantity += it.quantity * scale;
        });
      });
    });
    return Object.values(map);
  };

  const weeklyLeftovers = () => {
    const toNumber = (val) => {
      if (typeof val === "number") return val;
      if (typeof val !== "string") return 0;
      if (val.includes("/")) {
        const [a, b] = val.split("/").map(s => parseFloat(s.trim()));
        if (b && !isNaN(a) && !isNaN(b)) return a / b;
        return 0;
      }
      const n = parseFloat(val);
      return isNaN(n) ? 0 : n;
    };

    const list = shoppingList();
    const leftovers = [];
    list.forEach((item) => {
      const u = (item.unit || "").toLowerCase().trim();
      const pantryStaples = ["pinch", "tsp", "tbsp"];
      if (pantryStaples.includes(u)) return;
      if (["bulb", "bunch", "pot"].includes(u)) {
        const lo = calcLeftover(item, item.quantity);
        if (!lo) return;
        if (toNumber(lo.amount) < 0.5) return;
        leftovers.push({ name: item.name, ...lo });
        return;
      }

      const lo = calcLeftover(item, item.quantity);
      if (!lo) return;

      if (lo.unit === "g" && lo.amount < 30) return;
      if (lo.unit === "kg" && parseFloat(lo.amount) < 0.05) return;
      if (lo.unit === "ml" && lo.amount < 50) return;
      if (lo.unit === "L" && parseFloat(lo.amount) < 0.1) return;
      if (["each", "kom", "stuk"].includes((lo.unit || "").toLowerCase())) {
        if (toNumber(lo.amount) < 0.5) return;
      }

      leftovers.push({ name: item.name, ...lo });
    });
    return leftovers;
  };

  const handleScanned = (s) => { setEditingRecipe(s); setShowScanModal(false); setShowRecipeModal(true); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-c-bg">
      <Loader2 className="animate-spin text-c-blue" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-c-bg">
      <header className="sticky top-0 z-40 glass-bg separator-b">
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-c-text-tertiary">
              {activeView === "plan" ? t.thisWeek : activeView === "recipes" ? t.recipesShort : t.compareShort}
            </div>
            <h1 className="text-2xl font-bold mt-0.5">
              {activeView === "plan" ? t.weekPlan : activeView === "recipes" ? t.recipes : t.compare}
            </h1>
          </div>
          <button onClick={() => setShowPrefsModal(true)} className="ios-btn p-2 rounded-full bg-c-card">
            <Settings size={20} className="text-c-blue" strokeWidth={2} />
          </button>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Chip label={fetchingStore ? `${STORE_MULTIPLIERS[store].name} …` : STORE_MULTIPLIERS[store].name} onClick={() => {
            const keys = Object.keys(STORE_MULTIPLIERS);
            const ix = keys.indexOf(store);
            handleStoreChange(keys[(ix + 1) % keys.length]);
          }} />
          <Chip label={`${people} ${people === 1 ? t.person : t.peopleW}`} onClick={() => setPeople(people === 6 ? 1 : people + 1)} />
          <Chip label={`${prefs.mealsPerWeek} ${t.mealsPerWeek}`} onClick={() => setPrefs({ ...prefs, mealsPerWeek: prefs.mealsPerWeek === 7 ? 3 : prefs.mealsPerWeek + 1 })} />
          <Chip label={lang === "en" ? "🇬🇧 EN" : "🇷🇸 SR"} onClick={() => setLang(lang === "en" ? "sr" : "en")} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {activeView === "plan" && (
          <PlanView
            weekPlan={weekPlan} recipes={recipes} assignToDay={assignToDay}
            recipeStoreCost={recipeStoreCost} people={people} store={store}
            onRandomize={randomizeWeek} onView={setViewingRecipe}
            weekStoreCost={weekStoreCost()} weekHFCost={weekHFCost()}
            mealsPlanned={mealsPlanned} t={t} lang={lang} tRecipe={tRecipe}
            adjustedPrice={adjustedPrice} leftovers={weeklyLeftovers()}
            onAddBonusRecipe={async (r) => {
              const newRecipe = { ...r, id: `bonus-${Date.now()}` };
              await upsertRecipe(newRecipe);
              setRecipes([...recipes, newRecipe]);
              setViewingRecipe(newRecipe);
            }}
          />
        )}
        {activeView === "recipes" && (
          <RecipesView
            recipes={recipes} recipeStoreCost={recipeStoreCost}
            onAdd={() => { setEditingRecipe(null); setShowRecipeModal(true); }}
            onScan={() => setShowScanModal(true)}
            onLibrary={() => setShowLibraryModal(true)}
            onView={setViewingRecipe} onDelete={handleDeleteRecipe}
            onImport={importFromLibrary} adjustedPrice={adjustedPrice}
            people={people} t={t} lang={lang} tRecipe={tRecipe}
          />
        )}
        {activeView === "compare" && (
          <CompareView
            weekStoreCost={weekStoreCost()} weekHFCost={weekHFCost()}
            savings={savings} savingsPercent={savingsPercent}
            shoppingList={shoppingList()} adjustedPrice={adjustedPrice}
            store={store} people={people} mealsPlanned={mealsPlanned}
            t={t} lang={lang} weekPlan={weekPlan} recipes={recipes}
            tRecipe={tRecipe} recipeStoreCost={recipeStoreCost}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-white separator-t">
        <div className="max-w-3xl mx-auto px-4 py-2 flex justify-around">
          {[
            { id: "plan", label: t.week, Icon: Calendar },
            { id: "recipes", label: t.recipesShort, Icon: ChefHat },
            { id: "compare", label: t.compareShort, Icon: TrendingDown },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveView(id)} className="ios-btn flex flex-col items-center gap-0.5 px-6 py-1">
              <Icon size={24} strokeWidth={activeView === id ? 2.4 : 1.8} className={activeView === id ? "text-c-blue" : "text-c-text-tertiary"} />
              <span className={`text-[10px] font-medium ${activeView === id ? "text-c-blue" : "text-c-text-tertiary"}`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showRecipeModal && (
        <RecipeModal recipe={editingRecipe} onSave={addOrUpdateRecipe}
          onClose={() => { setShowRecipeModal(false); setEditingRecipe(null); }}
          adjustedPrice={adjustedPrice} people={people} t={t} lang={lang} />
      )}
      {showScanModal && (
        <ScanModal onClose={() => setShowScanModal(false)} onScanned={handleScanned} people={people} t={t} />
      )}
      {showLibraryModal && (
        <LibraryModal onClose={() => setShowLibraryModal(false)} recipes={recipes}
          onImport={importFromLibrary} adjustedPrice={adjustedPrice} people={people} t={t} lang={lang} tRecipe={tRecipe} />
      )}
      {showPrefsModal && (
        <PrefsModal prefs={prefs} setPrefs={setPrefs} store={store} setStore={handleStoreChange}
          people={people} setPeople={setPeople} lang={lang} setLang={setLang}
          onClose={() => setShowPrefsModal(false)} t={t} />
      )}
      {viewingRecipe && (
        <RecipeDetailModal recipe={tRecipe(viewingRecipe)}
          onClose={() => setViewingRecipe(null)}
          onEdit={(r) => { setViewingRecipe(null); setEditingRecipe(viewingRecipe); setShowRecipeModal(true); }}
          onUpdateSteps={updateRecipeSteps} adjustedPrice={adjustedPrice}
          people={people} store={store} t={t} lang={lang} />
      )}
    </div>
  );
}
