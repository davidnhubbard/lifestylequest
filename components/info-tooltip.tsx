"use client";

import { useEffect, useRef, useState } from "react";

type InfoTooltipProps = {
  label: string;
  content: string;
};

export function InfoTooltip({ label, content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const target = event.target as Node;
      if (!containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{label}</span>
      <button
        type="button"
        aria-label={`More info about ${label}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[11px] font-semibold text-zinc-500 transition-colors hover:text-zinc-700"
      >
        ⓘ
      </button>
      <span
        className={`pointer-events-none absolute left-0 top-full z-20 mt-2 w-[250px] max-w-[80vw] rounded-lg bg-zinc-800 p-3 text-xs leading-5 text-white shadow-lg transition-all duration-150 ${
          open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
        role="tooltip"
      >
        <span className="whitespace-pre-line">{content}</span>
      </span>
    </span>
  );
}
