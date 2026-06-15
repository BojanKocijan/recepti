import React, { useState, useRef } from "react";
import { Sparkles, X, Loader2, Camera, Upload } from "lucide-react";
import { INGREDIENT_DB, matchIngredient } from "../../data/ingredientDb";

export function ScanModal({ onClose, onScanned, people, t }) {
  const [stage, setStage] = useState("pick");
  const [imageData, setImageData] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please pick an image"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target.result.split(",")[1]);
      setImageType(file.type);
      setStage("preview");
    };
    reader.readAsDataURL(file);
  };

  const scan = async () => {
    setStage("scanning"); setError("");
    const ingredientList = INGREDIENT_DB.map(i => i.name).join(", ");
    const prompt = `Extract recipe info from this image (Dutch or English). Return ONLY valid JSON, no markdown:

{
  "name": "Recipe name in English",
  "emoji": "single food emoji",
  "people": 2,
  "minutes": 30,
  "tags": ["meat" or "fish" or "vegetarian" or "vegan", optionally "quick", "high-protein", "lean"],
  "nutrition": {"kcal": 480, "protein": 45, "carbs": 40, "fat": 12},
  "ingredients": [{"name": "name in English", "amount": "200", "unit": "g"}],
  "steps": ["step 1", "step 2", "..."]
}

- Translate Dutch to English
- Match ingredient names to: ${ingredientList}
- For nutrition: use values shown on recipe if visible; otherwise estimate per portion based on ingredients (kcal, protein, carbs, fat in grams)
- Add "high-protein" tag if protein >= 30g; "lean" if kcal <= 500 AND fat <= 15g
- Include cooking steps if visible (otherwise omit "steps")
- Return ONLY JSON. If unreadable: {"error": "reason"}`;

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
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: imageType, data: imageData } },
            { type: "text", text: prompt },
          ]}],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.error) { setError(parsed.error); setStage("error"); return; }

      const ingredients = (parsed.ingredients || []).map((it) => {
        const matched = matchIngredient(it.name);
        const amount = parseFloat((it.amount || "1").toString().replace(",", ".")) || 1;
        if (matched) {
          let q = 1;
          const du = matched.unit.toLowerCase();
          const iu = (it.unit || "").toLowerCase();
          if (iu.includes("g") && !iu.includes("kg") && du.includes("kg")) q = amount / 1000;
          else if (iu.includes("ml") && (du === "liter" || du.includes("l"))) q = amount / 1000;
          else q = amount;
          return { name: matched.name, unit: matched.unit, price: matched.price, quantity: Math.max(0.1, Math.round(q * 10) / 10), _scanned: true };
        }
        return { name: it.name, unit: it.unit || "each", price: 1.00, quantity: amount, _custom: true, _scanned: true };
      });

      onScanned({
        name: parsed.name || "Scanned recipe",
        emoji: parsed.emoji || "🍽️",
        people: parsed.people || people,
        minutes: parsed.minutes || 30,
        tags: parsed.tags || ["meat"],
        nutrition: parsed.nutrition || null,
        ingredients,
        steps: parsed.steps || null,
      });
    } catch (err) {
      setError(err.message || "Failed to read recipe");
      setStage("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in overlay-dark" onClick={stage !== "scanning" ? onClose : undefined}>
      <div className="w-full max-w-3xl mx-auto rounded-t-3xl slide-up overflow-hidden bg-c-bg" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 pt-3 pb-3 bg-c-card separator-b">
          <div className="w-10 h-1 rounded-full mx-auto mb-3 bg-c-separator" />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-c-purple" /> {t.scanRecipe}
            </h2>
            {stage !== "scanning" && (
              <button onClick={onClose} className="ios-btn p-2 rounded-full bg-c-bg">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {stage === "pick" && (
            <>
              <p className="text-sm mb-4 text-center text-c-text-secondary">
                {t.scanHint}
              </p>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => cameraInputRef.current?.click()} className="ios-btn ios-card p-6 flex flex-col items-center gap-2 bg-c-blue text-white">
                  <Camera size={28} strokeWidth={2} />
                  <span className="text-sm font-semibold">{t.camera}</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="ios-btn ios-card p-6 flex flex-col items-center gap-2">
                  <Upload size={28} strokeWidth={2} className="text-c-blue" />
                  <span className="text-sm font-semibold">{t.upload}</span>
                </button>
              </div>
              {error && <p className="text-xs mt-3 text-center text-c-red">{error}</p>}
            </>
          )}

          {stage === "preview" && (
            <>
              <div className="rounded-2xl overflow-hidden mb-4 bg-c-card">
                <img src={`data:${imageType};base64,${imageData}`} alt="Recipe" className="w-full max-h-72 object-contain" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setStage("pick"); setImageData(null); }}
                  className="ios-btn flex-1 py-3 rounded-2xl font-semibold bg-c-card text-c-text border border-c-separator">
                  {t.retake}
                </button>
                <button onClick={scan} className="ios-btn flex-1 py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-1.5 bg-c-blue">
                  <Sparkles size={14} /> {t.extract}
                </button>
              </div>
            </>
          )}

          {stage === "scanning" && (
            <div className="py-12 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-3 text-c-blue" />
              <p className="font-semibold">{t.readingRecipe}</p>
              <p className="text-xs mt-1 text-c-text-secondary">{t.extractingHint}</p>
            </div>
          )}

          {stage === "error" && (
            <div className="py-6 text-center">
              <div className="text-3xl mb-2">😕</div>
              <p className="font-semibold mb-1">{t.didntWork}</p>
              <p className="text-xs mb-4 text-c-text-secondary">{error}</p>
              <button onClick={() => { setStage("pick"); setImageData(null); setError(""); }}
                className="ios-btn px-5 py-2 rounded-full font-semibold text-white bg-c-blue">
                {t.tryAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
