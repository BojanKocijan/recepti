import React from "react";

export function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider px-2 mb-2 text-c-text-secondary">{title}</h3>
      <div className="ios-card p-3">{children}</div>
    </div>
  );
}
