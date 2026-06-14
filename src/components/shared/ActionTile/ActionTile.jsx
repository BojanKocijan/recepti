import React from "react";
import { C } from "../../../constants/tokens";

export function ActionTile({ icon: Icon, label, onClick, color }) {
  return (
    <button onClick={onClick} className="ios-btn ios-card p-3 flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: color + "1A" }}>
        <Icon size={20} style={{ color }} strokeWidth={2.2} />
      </div>
      <div className="text-xs font-semibold">{label}</div>
    </button>
  );
}
