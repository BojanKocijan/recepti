import React from "react";

export function SettingsRow({ label, value, children, last }) {
  return (
    <div className={`px-4 py-3 flex items-center justify-between ${last ? "" : "separator-b"}`}>
      <span className="text-[15px]">{label}</span>
      <div className="text-[15px] text-c-text-secondary">{children || value}</div>
    </div>
  );
}
