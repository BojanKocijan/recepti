import React from "react";
import { C } from "../../../constants/tokens";

export function NutritionStat({ value, label, color, highlight }) {
  return (
    <div className="text-center py-2 rounded-xl" style={{ background: highlight ? C.greenSoft : C.bg }}>
      <div className="text-xl font-bold tabular-nums" style={{ color: highlight ? C.green : color }}>{value}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color: C.textTertiary }}>{label}</div>
    </div>
  );
}
