import React, { useState, useEffect } from "react";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import { C } from "../../constants/tokens";

export function CookMode({ recipe, shopping, onClose, onUpdateSteps, people, fmtQty, t, lang }) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const steps = recipe.steps || [];

  useEffect(() => {
    if (steps.length === 0 && !generating) {
      (async () => {
        setGenerating(true);
        const ingredientsText = recipe.ingredients.map(i => `${fmtQty(i.quantity)} ${i.unit} ${i.name}`).join(", ");
        const langInstr = lang === "sr" ? "Write in Serbian (latinica)." : "Write in English.";
        const prompt = `Write clear cooking instructions. Return ONLY JSON: {"steps": ["...", "..."]}. Recipe: ${recipe.name}, serves ${recipe.people || 2}, ingredients: ${ingredientsText}. 4-7 steps, action-oriented, with timing. ${langInstr}`;
        try {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerous-direct-browser-access": "true",
            },
            body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
          });
          const data = await res.json();
          const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
          const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
          if (parsed.steps) onUpdateSteps(recipe.id, parsed.steps);
        } catch (e) { console.error(e); }
        setGenerating(false);
      })();
    }
  }, [steps.length]);

  if (generating || steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: C.bg }}>
        <Loader2 className="animate-spin mb-4" size={32} style={{ color: C.blue }} />
        <p className="text-lg font-semibold">{t.preparingRecipe}</p>
        <p className="text-sm mt-1" style={{ color: C.textSecondary }}>{t.generatingSteps}</p>
      </div>
    );
  }

  const progress = ((step + 1) / steps.length) * 100;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col slide-up" style={{ background: C.bg }}>
      <header className="flex-shrink-0 px-4 pt-3 pb-2 flex items-center justify-between" style={{ background: C.card, borderBottom: `0.5px solid ${C.separator}` }}>
        <button onClick={onClose} className="ios-btn p-2 rounded-full" style={{ background: C.bg }}>
          <X size={20} style={{ color: C.text }} />
        </button>
        <div className="text-center">
          <div className="text-sm font-bold">{recipe.name}</div>
          <div className="text-[11px]" style={{ color: C.textSecondary }}>{t.step} {step + 1} {t.of} {steps.length}</div>
        </div>
        <div className="w-9" />
      </header>

      <div className="h-1 flex-shrink-0" style={{ background: C.separator }}>
        <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, background: C.blue }} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-6">{recipe.emoji || "👨‍🍳"}</div>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.blue }}>
          {t.step} {step + 1}
        </div>
        <p className="text-2xl leading-relaxed font-medium" style={{ color: C.text }}>
          {steps[step]}
        </p>
      </div>

      <div className="flex-shrink-0 p-4 pb-8 flex gap-3" style={{ background: C.card, borderTop: `0.5px solid ${C.separator}` }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          className="ios-btn px-5 py-3.5 rounded-2xl font-semibold disabled:opacity-30"
          style={{ background: C.bg, color: C.text }}>
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => isLast ? onClose() : setStep(step + 1)}
          className="ios-btn flex-1 py-3.5 rounded-2xl font-bold text-white"
          style={{ background: isLast ? C.green : C.blue }}>
          {isLast ? t.doneCooking : t.nextStep}
        </button>
      </div>
    </div>
  );
}
