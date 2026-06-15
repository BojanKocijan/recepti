import React from "react";

export function NutritionStat({ value, label, highlight }) {
  return (
    <div className={`text-center py-2 rounded-xl ${highlight ? "bg-c-green-soft" : "bg-c-bg"}`}>
      <div className={`text-xl font-bold tabular-nums ${highlight ? "text-c-green" : "text-c-text"}`}>{value}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5 text-c-text-tertiary">{label}</div>
    </div>
  );
}
