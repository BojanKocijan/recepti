import React, { useState } from "react";
import { Check } from "lucide-react";
import { C } from "../../constants/tokens";
import { STORE_MULTIPLIERS } from "../../constants/config";
import { Section } from "../shared/Section";
import { SettingsRow } from "../shared/SettingsRow";

export function PrefsModal({ prefs, setPrefs, store, setStore, people, setPeople, lang, setLang, onClose, t }) {
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onClose();
    }, 800);
  };

  const Pill = ({ active, onClick, children }) => (
    <button onClick={onClick} className="ios-btn px-3.5 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5"
      style={{ background: active ? C.blue : C.card, color: active ? "#fff" : C.text, border: active ? "none" : `1px solid ${C.separator}` }}>
      {active && <Check size={12} strokeWidth={3} />}{children}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end fade-in" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div className="w-full max-w-3xl mx-auto max-h-[92vh] flex flex-col rounded-t-3xl slide-up overflow-hidden" style={{ background: C.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 px-4 pt-3 pb-2" style={{ background: C.card, borderBottom: `0.5px solid ${C.separator}` }}>
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: C.separator }} />
          <div className="flex items-center justify-between pb-2">
            <button onClick={onClose} className="ios-btn px-3 py-1 text-sm font-semibold" style={{ color: C.textSecondary }}>{t.cancel}</button>
            <h2 className="text-xl font-bold">{t.preferences}</h2>
            <button onClick={handleSave} className="ios-btn px-3 py-1 rounded-full text-sm font-bold" style={{ color: C.blue }}>{t.saveBtn}</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
          <Section title={t.language}>
            <div className="flex gap-2">
              <Pill active={lang === "en"} onClick={() => setLang("en")}>🇬🇧 {t.english}</Pill>
              <Pill active={lang === "sr"} onClick={() => setLang("sr")}>🇷🇸 {t.serbian}</Pill>
            </div>
          </Section>

          <div className="ios-card overflow-hidden">
            <SettingsRow label={t.store} value={STORE_MULTIPLIERS[store].name}>
              <select value={store} onChange={(e) => setStore(e.target.value)} className="bg-transparent outline-none font-medium text-[15px]" style={{ color: C.blue }}>
                {Object.entries(STORE_MULTIPLIERS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </SettingsRow>
            <SettingsRow label={t.people} last>
              <select value={people} onChange={(e) => setPeople(Number(e.target.value))} className="bg-transparent outline-none font-medium text-[15px]" style={{ color: C.blue }}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </SettingsRow>
          </div>

          <Section title={t.diet}>
            <div className="flex flex-wrap gap-2">
              {[{ k: "any", l: t.anything }, { k: "pescatarian", l: t.pescatarian }, { k: "vegetarian", l: t.vegetarian }, { k: "vegan", l: t.vegan }].map(({k,l}) => (
                <Pill key={k} active={prefs.diet === k} onClick={() => setPrefs({ ...prefs, diet: k })}>{l}</Pill>
              ))}
            </div>
          </Section>

          {prefs.diet === "any" && (
            <Section title={t.includeProteins}>
              <div className="flex flex-wrap gap-2">
                {Object.entries({ meat: t.meat, fish: t.fish, vegetarian: t.vegetarianP, vegan: t.veganP }).map(([k,l]) => (
                  <Pill key={k} active={prefs.proteins[k]} onClick={() => setPrefs({ ...prefs, proteins: { ...prefs.proteins, [k]: !prefs.proteins[k] } })}>{l}</Pill>
                ))}
              </div>
            </Section>
          )}

          <Section title={t.style}>
            <div className="flex flex-wrap gap-2">
              {Object.entries({ quick: t.quickFilter, "high-protein": t.highProtein, lean: t.lean, "no-cook": t.noCook }).map(([k,l]) => (
                <Pill key={k} active={prefs.cuisines[k]} onClick={() => setPrefs({ ...prefs, cuisines: { ...prefs.cuisines, [k]: !prefs.cuisines[k] } })}>{l}</Pill>
              ))}
            </div>
          </Section>

          <Section title={`${t.mealsPerWeekTitle} · ${prefs.mealsPerWeek}`}>
            <input type="range" min="3" max="7" value={prefs.mealsPerWeek} onChange={(e) => setPrefs({ ...prefs, mealsPerWeek: Number(e.target.value) })}
              className="w-full" style={{ accentColor: C.blue }} />
          </Section>

          <Section title={`${t.maxCookingTime} · ${prefs.maxMinutes} ${t.min}`}>
            <input type="range" min="15" max="90" step="5" value={prefs.maxMinutes} onChange={(e) => setPrefs({ ...prefs, maxMinutes: Number(e.target.value) })}
              className="w-full" style={{ accentColor: C.blue }} />
          </Section>
        </div>

        <div className="flex-shrink-0 px-4 pt-3 pb-6" style={{ background: C.card, borderTop: `0.5px solid ${C.separator}` }}>
          <button onClick={handleSave} className="ios-btn w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-base"
            style={{ background: C.blue, boxShadow: "0 4px 14px rgba(0,122,255,0.3)" }}>
            <Check size={18} strokeWidth={2.6} /> {t.saveBtn}
          </button>
        </div>

        {showSaved && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="px-5 py-3 rounded-2xl flex items-center gap-2 fade-in shadow-2xl"
              style={{ background: C.green, color: "#fff" }}>
              <Check size={18} strokeWidth={3} />
              <span className="font-semibold">{t.settingsSaved}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
