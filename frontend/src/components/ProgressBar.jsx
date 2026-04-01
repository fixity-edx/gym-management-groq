import React from "react";
export default function ProgressBar({ value=0 }){
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full bg-pink-500/80" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
