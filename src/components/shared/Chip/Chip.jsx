import React from "react";

export function Chip({ label, onClick, active }) {
  return (
    <button onClick={onClick}
      className={`ios-btn flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap ${active ? "bg-c-blue text-white" : "bg-c-card text-c-text"}`}>
      {label}
    </button>
  );
}
