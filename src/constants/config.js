export const STORE_MULTIPLIERS = {
  ah:       { name: "Albert Heijn", multiplier: 1.0 },
  jumbo:    { name: "Jumbo",        multiplier: 0.96 },
  plus:     { name: "Plus",         multiplier: 1.02 },
  lidl:     { name: "Lidl",         multiplier: 0.82 },
  aldi:     { name: "Aldi",         multiplier: 0.80 },
  ekoplaza: { name: "Ekoplaza",     multiplier: 1.35 },
};

export const HF_SHIPPING = 5.99;

export const getHFPricePerPortion = (people, meals) => {
  const total = people * meals;
  if (total <= 3)  return 11.33;
  if (total <= 6)  return 6.67;
  if (total <= 8)  return 6.13;
  if (total <= 12) return 5.45;
  if (total <= 16) return 5.12;
  if (total <= 20) return 4.94;
  if (total <= 24) return 4.77;
  return 4.30;
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DAYS_FULL_EN = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
  Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};
export const DAYS_FULL_SR = {
  Mon: "Ponedeljak", Tue: "Utorak", Wed: "Sreda", Thu: "Četvrtak",
  Fri: "Petak", Sat: "Subota", Sun: "Nedelja",
};
export const DAYS_SHORT_SR = {
  Mon: "Pon", Tue: "Uto", Wed: "Sre", Thu: "Čet",
  Fri: "Pet", Sat: "Sub", Sun: "Ned",
};

export const CATEGORY_CONFIG = {
  breakfast: { emoji: "🌅", labelEn: "Breakfast", labelSr: "Doručak",  color: "#f97316" },
  lunch:     { emoji: "☀️",  labelEn: "Lunch",     labelSr: "Ručak",    color: "#eab308" },
  dinner:    { emoji: "🌙", labelEn: "Dinner",    labelSr: "Večera",   color: "#6366f1" },
  dessert:   { emoji: "🍰", labelEn: "Dessert",   labelSr: "Desert",   color: "#ec4899" },
  soup:      { emoji: "🍲", labelEn: "Soup",      labelSr: "Supa",     color: "#64748b" },
  side:      { emoji: "🥗", labelEn: "Side",      labelSr: "Prilog",   color: "#22c55e" },
  snack:     { emoji: "🍎", labelEn: "Snack",     labelSr: "Užina",    color: "#8b5cf6" },
};

export const MAIN_CATS = ["breakfast", "lunch", "dinner", "dessert"];

export const catLabel = (cat, lang) => {
  const cfg = CATEGORY_CONFIG[cat];
  if (!cfg) return cat;
  return lang === "sr" ? cfg.labelSr : cfg.labelEn;
};

export const DEFAULT_PREFS = {
  diet: "any",
  proteins: { meat: true, fish: true, vegetarian: true, vegan: true },
  cuisines: { quick: true, "high-protein": true, lean: true, "no-cook": true },
  mealsPerWeek: 5,
  maxMinutes: 60,
};
