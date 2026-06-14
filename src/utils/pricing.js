import { tUnit } from "../data/ingredientDb";

export const fmt = (n) => `€${n.toFixed(2)}`;

export const printHTML = (html) => {
  try {
    const win = window.open("", "_blank");
    if (win && win.document) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        try { win.focus(); win.print(); } catch (e) { console.warn("popup print failed", e); }
      }, 300);
      return;
    }
  } catch (e) {
    console.warn("window.open blocked, falling back to iframe", e);
  }
  try {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    iframe.srcdoc = html;
    iframe.onload = () => {
      try {
        const w = iframe.contentWindow;
        if (w) { w.focus(); w.print(); }
      } catch (e) {
        console.error("iframe print failed", e);
        alert("Print failed. Try saving the page or using browser's File > Print.");
      }
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 60000);
    };
  } catch (e) {
    console.error("Both print methods failed", e);
    alert("Couldn't open print dialog. Please use your browser's print menu (Cmd/Ctrl+P).");
  }
};

export const getPackInfo = (unit) => {
  const u = (unit || "").toLowerCase().trim();
  if (u === "kg")                             return { packAmount: 0.5, packLabel: "500g pack",    divisible: false };
  if (u === "liter" || u === "l")             return { packAmount: 1,   packLabel: "1L carton",    divisible: false };
  if (u.includes("g") && u !== "kg")          return { packAmount: 1,   packLabel: u + " pack",    divisible: true  };
  if (u.includes("ml"))                       return { packAmount: 1,   packLabel: u + " bottle",  divisible: true  };
  if (u === "each" || u === "stuk")           return { packAmount: 1,   packLabel: "each",         divisible: false };
  if (u.includes("pcs"))                      return { packAmount: 1,   packLabel: u + " pack",    divisible: false };
  if (["bunch","bulb","head","whole","pot","can","bottle"].includes(u))
                                              return { packAmount: 1,   packLabel: u,              divisible: false };
  if (["pinch","tsp","tbsp"].includes(u))     return { packAmount: 1,   packLabel: u,              divisible: true  };
  return { packAmount: 1, packLabel: unit, divisible: false };
};

export const calcPackages = (ingredient, scaledQty, adjustedPrice) => {
  const pack = getPackInfo(ingredient.unit);
  const needed = scaledQty;
  if (pack.divisible) {
    const packsToBuy = Math.ceil(needed);
    return {
      packsNeeded: packsToBuy,
      packLabel: pack.packLabel,
      proRatedCost: adjustedPrice(ingredient.price) * needed,
      fullPackCost: adjustedPrice(ingredient.price) * packsToBuy,
      isPartial: needed < 1,
      actualUsed: needed,
    };
  } else {
    const packsToBuy = Math.max(1, Math.ceil(needed / pack.packAmount));
    return {
      packsNeeded: packsToBuy,
      packLabel: pack.packLabel,
      proRatedCost: adjustedPrice(ingredient.price) * needed,
      fullPackCost: adjustedPrice(ingredient.price) * pack.packAmount * packsToBuy,
      isPartial: false,
      actualUsed: needed,
    };
  }
};

export const humanizeAmount = (quantity, unit, lang) => {
  const u = (unit || "").toLowerCase().trim();
  if (u === "kg") {
    const grams = quantity * 1000;
    if (grams >= 1000) return { amount: (grams/1000).toFixed(grams % 1000 === 0 ? 0 : 1), unit: "kg" };
    return { amount: Math.round(grams), unit: "g" };
  }
  if (u === "liter" || u === "l") {
    const ml = quantity * 1000;
    if (ml >= 1000) return { amount: (ml/1000).toFixed(ml % 1000 === 0 ? 0 : 1), unit: "L" };
    return { amount: Math.round(ml), unit: "ml" };
  }
  const gMatch = u.match(/^(\d+)\s*g$/);
  if (gMatch) {
    const g = parseInt(gMatch[1]) * quantity;
    if (g >= 1000) return { amount: (g/1000).toFixed(g % 1000 === 0 ? 0 : 1), unit: "kg" };
    return { amount: Math.round(g), unit: "g" };
  }
  const mlMatch = u.match(/^(\d+)\s*ml$/);
  if (mlMatch) {
    const ml = parseInt(mlMatch[1]) * quantity;
    if (ml >= 1000) return { amount: (ml/1000).toFixed(ml % 1000 === 0 ? 0 : 1), unit: "L" };
    return { amount: Math.round(ml), unit: "ml" };
  }
  const pcsMatch = u.match(/^(\d+)\s*pcs$/);
  if (pcsMatch) {
    const pcs = Math.round(parseInt(pcsMatch[1]) * quantity);
    return { amount: pcs, unit: lang === "sr" ? "kom" : "pcs" };
  }
  if (["each", "stuk", "bunch", "bulb", "head", "whole", "pot", "can", "bottle"].includes(u)) {
    const n = quantity;
    let amount;
    if (n < 1) {
      if      (Math.abs(n - 0.5 ) < 0.05) amount = "1/2";
      else if (Math.abs(n - 0.25) < 0.05) amount = "1/4";
      else if (Math.abs(n - 0.75) < 0.05) amount = "3/4";
      else if (Math.abs(n - 0.33) < 0.05) amount = "1/3";
      else amount = n.toFixed(2).replace(/\.?0+$/, "");
    } else {
      amount = n % 1 === 0 ? n.toString() : n.toFixed(1).replace(/\.0$/, "");
    }
    return { amount, unit: tUnit(unit, lang) };
  }
  if (["tsp", "tbsp", "pinch"].includes(u)) {
    const n = quantity;
    return { amount: n % 1 === 0 ? n.toString() : n.toFixed(1).replace(/\.0$/, ""), unit: tUnit(unit, lang) };
  }
  return { amount: quantity.toFixed(2).replace(/\.?0+$/, ""), unit: tUnit(unit, lang) };
};

export const formatLeftover = (leftover, lang) => {
  if (!leftover) return "";
  const u = leftover.unit;
  let unit = u;
  if (lang === "sr") {
    if (u === "each" || u === "stuk") unit = "kom";
    else if (u === "bulb")   unit = "glavica";
    else if (u === "bunch")  unit = "veza";
    else if (u === "pot")    unit = "saksija";
    else if (u === "can")    unit = "konzerva";
    else if (u === "bottle") unit = "flaša";
    else if (u === "head")   unit = "glavica";
    else if (u === "whole")  unit = "ceo";
    else if (u === "pcs")    unit = "kom";
  }
  return `${leftover.amount} ${unit}`;
};

export const calcLeftover = (ingredient, scaledQty) => {
  const pack = getPackInfo(ingredient.unit);
  const u = (ingredient.unit || "").toLowerCase().trim();

  if (pack.divisible) {
    const packsToBuy = Math.ceil(scaledQty);
    const leftoverFraction = packsToBuy - scaledQty;
    if (leftoverFraction <= 0.01) return null;
    return humanizeAmount(leftoverFraction, ingredient.unit, "en");
  }

  if (u === "kg") {
    const gNeeded = scaledQty * 1000;
    const packsToBuy = Math.max(1, Math.ceil(gNeeded / 500));
    const leftoverG = packsToBuy * 500 - gNeeded;
    if (leftoverG <= 5) return null;
    if (leftoverG >= 1000) return { amount: (leftoverG/1000).toFixed(1), unit: "kg" };
    return { amount: Math.round(leftoverG), unit: "g" };
  }
  if (u === "liter" || u === "l") {
    const mlNeeded = scaledQty * 1000;
    const packsToBuy = Math.max(1, Math.ceil(mlNeeded / 1000));
    const leftoverMl = packsToBuy * 1000 - mlNeeded;
    if (leftoverMl <= 10) return null;
    return { amount: Math.round(leftoverMl), unit: "ml" };
  }

  const packsToBuy = Math.max(1, Math.ceil(scaledQty));
  const leftoverUnits = packsToBuy - scaledQty;
  if (leftoverUnits <= 0.05) return null;
  return humanizeAmount(leftoverUnits, ingredient.unit, "en");
};
