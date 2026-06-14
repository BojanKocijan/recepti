import React, { useState } from "react";
import { Sparkles, Loader2, ChevronRight, Shuffle, Plus, Clock } from "lucide-react";
import { C } from "../../constants/tokens";
import { INGREDIENT_DB } from "../../data/ingredientDb";
import { tIng } from "../../data/ingredientDb";
import { fmt, formatLeftover, humanizeAmount } from "../../utils/pricing";

const BONUS_TEMPLATES = [
  {
    id: "omelet",
    name_en: "Power omelet", name_sr: "Proteinski omlet",
    emoji: "🍳", minutes: 12,
    requires: ["Eggs"],
    uses: ["Eggs", "Egg whites (carton)", "Spinach", "Cherry tomatoes", "Mushrooms", "Bell pepper", "Onion", "Red onion", "Garlic", "Aged cheese", "Grated cheese", "Feta", "Parmesan", "Bacon strips", "Lean turkey mince"],
    nutrition: { kcal: 380, protein: 35, carbs: 8, fat: 22 },
    steps_en: [
      "Whisk 3 whole eggs (and any egg whites) with salt and pepper.",
      "Sauté any vegetables you have — onion, mushrooms, peppers, spinach — in a non-stick pan with a little oil for 3-4 minutes.",
      "Pour in the egg mixture, swirl pan to coat. Add any cheese on top.",
      "Cook 2-3 minutes until just set, fold in half. Serve immediately."
    ],
    steps_sr: [
      "Umuti 3 cela jaja (plus belanca ako imaš) sa solju i biberom.",
      "Propržiti povrće koje imaš — luk, pečurke, papriku, spanać — u tiganju bez lepljenja sa malo ulja, 3-4 min.",
      "Sipaj jaja, promešaj da prekrije dno tiganja. Dodaj sir na vrh.",
      "Kuvaj 2-3 minuta dok se ne stegne, presavij na pola i serviraj."
    ]
  },
  {
    id: "stir-fry",
    name_en: "Leftover stir-fry", name_sr: "Šara na brzaka",
    emoji: "🥢", minutes: 18,
    requires: ["Chicken breast", "Chicken thigh fillet", "Tofu", "Tempeh", "Lean turkey mince", "Lean beef mince 5%", "Beef mince", "Shrimp"],
    uses: ["Chicken breast", "Chicken thigh fillet", "Tofu", "Tempeh", "Beef mince", "Lean turkey mince", "Lean beef mince 5%", "Shrimp", "Bell pepper", "Broccoli", "Carrots", "Spinach", "Mushrooms", "Garlic", "Ginger", "Soy sauce", "Cherry tomatoes", "Green beans", "Edamame (frozen)", "Brown rice", "Rice", "Quinoa"],
    nutrition: { kcal: 480, protein: 45, carbs: 40, fat: 12 },
    steps_en: [
      "Cube your protein (chicken/tofu/turkey). Cut vegetables into bite-size pieces.",
      "Heat a teaspoon of oil in a wok or large pan. Stir-fry protein until cooked, 5-6 min. Set aside.",
      "Add hard vegetables first (carrots, broccoli, peppers), stir-fry 3 min. Add softer ones (spinach, mushrooms), 2 more min.",
      "Return protein. Add soy sauce, minced garlic and ginger. Toss for 1 minute.",
      "Serve over rice/quinoa if you have any."
    ],
    steps_sr: [
      "Iseci protein na kockice (pile/tofu/ćuretina). Iseci povrće na zalogaj-veličine.",
      "Zagrej kašičicu ulja u tiganju. Propržiti protein dok se ne ispeče, 5-6 min. Skloni.",
      "Dodaj tvrđe povrće prvo (šargarepa, brokoli, paprika), 3 min. Onda meke (spanać, pečurke), još 2 min.",
      "Vrati protein. Dodaj soja sos, iseckani beli luk i đumbir. Promešaj 1 minut.",
      "Serviraj sa pirinčem/kvinojom ako imaš."
    ]
  },
  {
    id: "salad",
    name_en: "Power protein salad", name_sr: "Proteinska salata",
    emoji: "🥗", minutes: 10,
    requires: ["Tuna in water (can)", "Chicken breast", "Eggs", "Chickpeas", "Black beans", "Kidney beans", "Tofu", "Feta"],
    uses: ["Tuna in water (can)", "Chicken breast", "Eggs", "Chickpeas", "Black beans", "Kidney beans", "Tofu", "Feta", "Cherry tomatoes", "Tomatoes", "Cucumber", "Lettuce (head)", "Spinach", "Arugula", "Red onion", "Avocado", "Lemon", "Olive oil", "Fresh parsley", "Fresh basil"],
    nutrition: { kcal: 420, protein: 38, carbs: 25, fat: 18 },
    steps_en: [
      "Drain any canned protein (tuna, beans, chickpeas) and place in a large bowl.",
      "Chop vegetables: tomatoes, cucumber, lettuce, onion. Add to bowl.",
      "Cube any cooked protein you have (chicken, tofu, hard-boiled eggs).",
      "Dress with olive oil, lemon juice, salt, pepper. Toss gently.",
      "Top with crumbled feta or avocado if you have. Serve."
    ],
    steps_sr: [
      "Iscedi konzervirani protein (tunjevina, pasulj, leblebije) i stavi u veliku činiju.",
      "Iseckaj povrće: paradajz, krastavac, salatu, luk. Dodaj u činiju.",
      "Iseci protein koji imaš (pile, tofu, kuvana jaja) na kockice.",
      "Začini maslinovim uljem, sokom od limuna, soli, biberom. Lagano promešaj.",
      "Dodaj izmrvljeni feta ili avokado na vrh ako imaš. Serviraj."
    ]
  },
  {
    id: "soup",
    name_en: "Hearty leftover soup", name_sr: "Brza supa od ostataka",
    emoji: "🍲", minutes: 25,
    requires: ["Stock cube", "Chicken breast", "Lean turkey mince", "Red lentils", "Chickpeas", "Black beans"],
    uses: ["Chicken breast", "Lean turkey mince", "Red lentils", "Chickpeas", "Black beans", "Carrots", "Onion", "Garlic", "Spinach", "Tomatoes", "Tomato paste", "Bell pepper", "Mushrooms", "Stock cube", "Fresh parsley", "Ginger"],
    nutrition: { kcal: 400, protein: 40, carbs: 35, fat: 8 },
    steps_en: [
      "Dice onion, carrots, and any other firm vegetables. Mince garlic.",
      "Sauté in a soup pot with a teaspoon of oil for 5 minutes.",
      "Add cubed protein (chicken/turkey/lentils/beans) and brown lightly.",
      "Pour in 800ml water with crumbled stock cube. Add tomato paste if you have. Simmer 15 minutes.",
      "Add leafy greens (spinach) at the end. Season and serve hot."
    ],
    steps_sr: [
      "Iseci luk, šargarepu i drugo tvrđe povrće. Iseckaj beli luk.",
      "Propržiti u šerpi sa kašičicom ulja, 5 minuta.",
      "Dodaj protein (pile/ćureće/sočivo/pasulj) i lagano propržiti.",
      "Sipaj 800ml vode sa kockom bujona. Dodaj paradajz pire ako imaš. Krčkaj 15 min.",
      "Dodaj zelenje (spanać) na kraju. Začini i serviraj vruće."
    ]
  },
  {
    id: "wrap",
    name_en: "Protein wrap", name_sr: "Proteinski rolat",
    emoji: "🌯", minutes: 8,
    requires: ["Wraps", "Whole wheat wraps"],
    uses: ["Wraps", "Whole wheat wraps", "Tuna in water (can)", "Chicken breast", "Eggs", "Greek yogurt", "Skyr (0% fat)", "Hummus", "Cherry tomatoes", "Cucumber", "Lettuce (head)", "Spinach", "Arugula", "Red onion", "Bell pepper", "Avocado", "Feta"],
    nutrition: { kcal: 380, protein: 35, carbs: 35, fat: 11 },
    steps_en: [
      "Mix protein (tuna/chicken/eggs) with Greek yogurt or skyr, lemon, salt and pepper.",
      "Slice vegetables: cucumber, tomatoes, peppers, onion. Shred lettuce or spinach.",
      "Warm wrap briefly in a dry pan or microwave 15 seconds.",
      "Spread protein mixture down center, layer vegetables.",
      "Roll tightly and slice in half."
    ],
    steps_sr: [
      "Pomešaj protein (tunjevina/pile/jaja) sa grčkim jogurtom ili skyr-om, limunom, soli i biberom.",
      "Iseckaj povrće: krastavac, paradajz, papriku, luk. Iseckaj salatu ili spanać.",
      "Zagrej tortilju u suvom tiganju ili mikrotalasnoj 15 sekundi.",
      "Premaži protein po sredini, slaži povrće.",
      "Zarolaj čvrsto i preseci na pola."
    ]
  },
  {
    id: "bowl",
    name_en: "Power grain bowl", name_sr: "Proteinska činija",
    emoji: "🍱", minutes: 15,
    requires: ["Brown rice", "Quinoa", "Rice", "Couscous", "Bulgur"],
    uses: ["Brown rice", "Quinoa", "Rice", "Couscous", "Bulgur", "Chicken breast", "Tuna in water (can)", "Tofu", "Tempeh", "Eggs", "Chickpeas", "Black beans", "Edamame (frozen)", "Cherry tomatoes", "Cucumber", "Spinach", "Avocado", "Bell pepper", "Carrots", "Lemon", "Soy sauce", "Olive oil", "Fresh parsley"],
    nutrition: { kcal: 510, protein: 42, carbs: 55, fat: 13 },
    steps_en: [
      "Cook grain (rice/quinoa/couscous) according to package — usually 12-15 minutes.",
      "Prep protein: cube chicken/tofu and pan-sear, OR drain canned protein, OR boil eggs.",
      "Slice vegetables: cucumber, tomatoes, avocado. Quickly steam or sauté any greens.",
      "Build bowl: grain at base, protein on top, veggies arranged around.",
      "Drizzle with olive oil + lemon, or soy sauce. Sprinkle herbs."
    ],
    steps_sr: [
      "Skuvaj žitaricu (pirinač/kvinoja/kus-kus) prema uputstvu — obično 12-15 min.",
      "Pripremi protein: iseci pile/tofu na kockice i propržiti, ILI iscedi konzerve, ILI skuvaj jaja.",
      "Iseckaj povrće: krastavac, paradajz, avokado. Brzo prepari zelenje.",
      "Sastavi činiju: žitarica na dnu, protein gore, povrće okolo.",
      "Polij maslinovim uljem i limunom, ili soja sosom. Pospi začinima."
    ]
  },
  {
    id: "skyr-bowl",
    name_en: "High-protein yogurt bowl", name_sr: "Proteinska jogurt činija",
    emoji: "🥣", minutes: 5,
    requires: ["Skyr (0% fat)", "Greek yogurt", "Quark (low-fat)"],
    uses: ["Skyr (0% fat)", "Greek yogurt", "Quark (low-fat)", "Oats", "Eggs"],
    nutrition: { kcal: 360, protein: 38, carbs: 40, fat: 5 },
    steps_en: [
      "Spoon 250g of skyr/Greek yogurt/quark into a bowl.",
      "Top with 30g rolled oats for crunch.",
      "Add berries (frozen are great), a drizzle of honey or stevia.",
      "Sprinkle cinnamon. Eat cold — perfect post-workout meal."
    ],
    steps_sr: [
      "Sipaj 250g skyr/grčkog jogurta/kvarka u činiju.",
      "Dodaj 30g ovsenih pahuljica za hrskavost.",
      "Dodaj bobičasto voće (smrznuto savršeno odgovara), kap meda ili stevije.",
      "Pospi cimetom. Jedi hladno — savršen obrok posle treninga."
    ]
  }
];

const scoreTemplate = (template, leftoverNames) => {
  const hasRequired = template.requires.some(req => leftoverNames.includes(req));
  if (!hasRequired) return -1;
  let score = 0;
  leftoverNames.forEach(name => { if (template.uses.includes(name)) score++; });
  return score;
};

export function LeftoversSection({ leftovers, t, lang, people, onAddBonusRecipe, onView }) {
  const [generating, setGenerating] = useState(false);
  const [bonusRecipe, setBonusRecipe] = useState(null);
  const [error, setError] = useState("");

  const generateBonusRecipe = () => {
    setGenerating(true); setError(""); setBonusRecipe(null);

    setTimeout(() => {
      try {
        if (!leftovers || leftovers.length === 0) {
          throw new Error(lang === "sr" ? "Nema ostataka." : "No leftovers.");
        }

        const leftoverNames = leftovers.map(l => l.name);
        const scored = BONUS_TEMPLATES
          .map(tpl => ({ tpl, score: scoreTemplate(tpl, leftoverNames) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score);

        if (scored.length === 0) {
          throw new Error(lang === "sr"
            ? "Tvoji ostaci nisu pogodni za bonus recept. Pokušaj sa više različitih namirnica."
            : "Your leftovers aren't suitable. Try with more variety.");
        }

        const topN = Math.min(3, scored.length);
        const pickFrom = scored.slice(0, topN);
        const picked = pickFrom[Math.floor(Math.random() * pickFrom.length)].tpl;

        const matchedLeftovers = leftovers.filter(l => picked.uses.includes(l.name));

        const ingredients = matchedLeftovers.map(l => {
          const db = INGREDIENT_DB.find(i => i.name === l.name);
          if (!db) return null;
          let qty;
          const u = (l.unit || "").toLowerCase();
          const du = db.unit.toLowerCase();
          if (u === "g" && du === "kg") qty = l.amount / 1000;
          else if (u === "g" && du.includes("g") && du !== "kg") {
            const packG = parseInt(du.match(/\d+/)?.[0] || "100");
            qty = l.amount / packG;
          } else if (u === "ml" && (du === "liter" || du === "l")) qty = l.amount / 1000;
          else if (u === "ml" && du.includes("ml")) {
            const packMl = parseInt(du.match(/\d+/)?.[0] || "100");
            qty = l.amount / packMl;
          } else {
            if (typeof l.amount === "string" && l.amount.includes("/")) {
              const [a, b] = l.amount.split("/").map(parseFloat);
              qty = b ? a / b : 1;
            } else {
              qty = parseFloat(l.amount) || 1;
            }
          }
          return { name: db.name, unit: db.unit, price: db.price, quantity: Math.max(0.05, Math.round(qty * 100) / 100) };
        }).filter(Boolean);

        setBonusRecipe({
          id: `bonus-preview-${Date.now()}`,
          name: lang === "sr" ? picked.name_sr : picked.name_en,
          emoji: picked.emoji,
          people,
          minutes: picked.minutes,
          tags: ["high-protein", "lean", "quick"],
          nutrition: picked.nutrition,
          ingredients,
          steps: lang === "sr" ? picked.steps_sr : picked.steps_en,
        });
      } catch (err) {
        console.error("Bonus recipe error:", err);
        setError(err.message || (lang === "sr" ? "Greška" : "Error"));
      }
      setGenerating(false);
    }, 400);
  };

  return (
    <div className="ios-card p-5" style={{ background: "linear-gradient(135deg, #FFF8E7 0%, #FFE8D9 100%)", border: `1px solid ${C.orange}33` }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.orange + "22" }}>
          <Sparkles size={18} style={{ color: C.orange }} strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base">{t.leftovers}</h3>
          <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>{t.leftoversHint}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {leftovers.slice(0, 8).map((lo, i) => (
          <div key={i} className="flex items-baseline gap-1.5 text-xs">
            <span className="font-bold tabular-nums whitespace-nowrap" style={{ color: C.orange }}>
              {formatLeftover(lo, lang)}
            </span>
            <span className="truncate" style={{ color: C.text }}>{tIng(lo.name, lang)}</span>
          </div>
        ))}
      </div>
      {leftovers.length > 8 && (
        <p className="text-[11px] mb-3 text-center" style={{ color: C.textTertiary }}>
          +{leftovers.length - 8} {lang === "sr" ? "još" : "more"}
        </p>
      )}

      {!bonusRecipe ? (
        <button onClick={generateBonusRecipe} disabled={generating}
          className="ios-btn w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-white disabled:opacity-50"
          style={{ background: C.orange }}>
          {generating
            ? <><Loader2 size={16} className="animate-spin" /> {t.suggesting}</>
            : <><Sparkles size={16} strokeWidth={2.4} /> {t.suggestRecipe}</>
          }
        </button>
      ) : (
        <div className="mt-2 space-y-2">
          <button onClick={() => onView(bonusRecipe)} className="ios-btn w-full ios-card p-4 flex items-center gap-3 text-left" style={{ background: C.card }}>
            <div className="text-4xl flex-shrink-0">{bonusRecipe.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{bonusRecipe.name}</div>
              <div className="text-xs flex items-center gap-2 flex-wrap mt-0.5" style={{ color: C.textSecondary }}>
                <span className="flex items-center gap-1"><Clock size={11} />{bonusRecipe.minutes}m</span>
                {bonusRecipe.nutrition && (<>
                  <span>·</span>
                  <span className="font-bold" style={{ color: C.green }}>{bonusRecipe.nutrition.protein}g {t.protein}</span>
                  <span>·</span>
                  <span>{bonusRecipe.nutrition.kcal} {t.kcal}</span>
                </>)}
              </div>
              <div className="text-[11px] mt-1 font-semibold" style={{ color: C.blue }}>
                {lang === "sr" ? "Dodirni za pun recept →" : "Tap for full recipe →"}
              </div>
            </div>
            <ChevronRight size={20} style={{ color: C.textTertiary }} />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setBonusRecipe(null); generateBonusRecipe(); }}
              className="ios-btn py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
              style={{ background: C.card, color: C.text, border: `1px solid ${C.separator}` }}>
              <Shuffle size={14} /> {t.regenerate}
            </button>
            <button onClick={() => { onAddBonusRecipe(bonusRecipe); setBonusRecipe(null); }}
              className="ios-btn py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-1.5"
              style={{ background: C.green }}>
              <Plus size={14} strokeWidth={2.4} /> {t.addBonusRecipe}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs mt-2 text-center" style={{ color: C.red }}>{error}</p>}
    </div>
  );
}
