import React, { useState } from "react";
import { Flame, ListChecks, Loader2, Sparkles } from "lucide-react";
import { tIng } from "../../data/ingredientDb";
import { humanizeAmount, formatLeftover, calcLeftover } from "../../utils/pricing";

export function RecipeStepsTab({ recipe, shopping, fmtQty, onUpdateSteps, t, lang }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateSteps = async () => {
    setGenerating(true); setError("");
    const ingredientsText = recipe.ingredients.map(i => `${fmtQty(i.quantity)} ${i.unit} ${i.name}`).join(", ");
    const langInstr = lang === "sr" ? "Write in Serbian (latinica). Use Serbian cooking terminology." : "Write in plain English.";
    const prompt = `Write clear, friendly cooking instructions for this recipe. Return ONLY valid JSON, no markdown:

{"steps": ["step 1", "step 2", "step 3", "step 4", "step 5"]}

Recipe: ${recipe.name}
Serves: ${recipe.people || 2}
Ingredients: ${ingredientsText}
${recipe.minutes ? `Total time: ${recipe.minutes} minutes` : ""}

Rules:
- 4-7 steps, each 1-2 sentences
- ${langInstr}
- Action-oriented (Heat... Add... Cook for X minutes...)
- Include timing where relevant ("simmer 5 minutes")
- Don't repeat ingredient amounts in steps unless critical
- Group prep/cook tasks logically
Return ONLY the JSON.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.steps && parsed.steps.length > 0) {
        onUpdateSteps(recipe.id, parsed.steps);
      } else {
        setError(t.didntWork);
      }
    } catch (err) {
      setError(err.message || t.didntWork);
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div className="ios-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} className="text-c-orange" />
          <h3 className="font-bold">{t.ingredients}</h3>
        </div>
        <div className="space-y-2">
          {shopping.map((it, idx) => {
            const human = humanizeAmount(it.scaledQuantity, it.unit, lang);
            const leftover = calcLeftover(it, it.scaledQuantity);
            return (
              <div key={idx} className="flex items-baseline gap-3 text-sm">
                <span className="font-bold tabular-nums whitespace-nowrap text-c-blue min-w-[80px]">
                  {human.amount} {human.unit}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-c-text">{tIng(it.name, lang)}</div>
                  {leftover && (
                    <div className="text-[11px] mt-0.5 text-c-text-tertiary">
                      {lang === "sr" ? "ostaje" : "leftover"}: {formatLeftover(leftover, lang)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ios-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListChecks size={16} className="text-c-green" />
            <h3 className="font-bold">{t.instructions}</h3>
          </div>
          {recipe.steps && recipe.steps.length > 0 && (
            <button onClick={generateSteps} disabled={generating} className="ios-btn text-xs font-semibold px-2 py-1 rounded-full disabled:opacity-50 text-c-blue bg-c-blue-soft">
              {generating ? <Loader2 size={12} className="animate-spin inline" /> : t.regenerate}
            </button>
          )}
        </div>

        {!recipe.steps || recipe.steps.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm mb-3 text-c-text-secondary">
              {t.noInstructions}
            </p>
            <button onClick={generateSteps} disabled={generating} className="ios-btn px-4 py-2 rounded-full font-semibold text-sm text-white disabled:opacity-50 flex items-center gap-2 mx-auto bg-c-blue">
              {generating ? <><Loader2 size={14} className="animate-spin" /> {t.generating}</> : <><Sparkles size={14} /> {t.generateAI}</>}
            </button>
            {error && <p className="text-xs mt-2 text-c-red">{error}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-c-blue">
                  <span className="text-xs font-bold text-white">{idx + 1}</span>
                </div>
                <div className="flex-1 text-sm leading-relaxed text-c-text">{step}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
