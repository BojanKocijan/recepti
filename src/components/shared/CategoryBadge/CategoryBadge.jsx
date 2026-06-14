import React from "react";
import { CATEGORY_CONFIG } from "../../../constants/config";

export function CategoryBadge({ category, lang }) {
  const cfg = CATEGORY_CONFIG[category ?? "dinner"];
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: cfg.color + "22", color: cfg.color }}>
      {cfg.emoji} {lang === "sr" ? cfg.labelSr : cfg.labelEn}
    </span>
  );
}
