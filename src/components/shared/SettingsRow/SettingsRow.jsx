import React from "react";
import { C } from "../../../constants/tokens";

export function SettingsRow({ label, value, children, last }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: last ? "none" : `0.5px solid ${C.separator}` }}>
      <span className="text-[15px]">{label}</span>
      <div className="text-[15px]" style={{ color: C.textSecondary }}>{children || value}</div>
    </div>
  );
}
