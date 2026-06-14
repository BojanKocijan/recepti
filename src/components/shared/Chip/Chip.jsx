import React from "react";
import { C } from "../../../constants/tokens";

export function Chip({ label, onClick, active }) {
  return (
    <button onClick={onClick} className="ios-btn flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap"
      style={{ background: active ? C.blue : C.card, color: active ? "#fff" : C.text }}>
      {label}
    </button>
  );
}
