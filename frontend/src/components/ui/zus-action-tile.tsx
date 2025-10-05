"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  title: string;
  desc: string;
  icon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ZusActionTile({ title, desc, icon, className, ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        "w-full rounded-lg transition-colors text-left px-4 py-4 flex items-center gap-4 border border-transparent",
        className
      )}
      style={{
        backgroundColor: `rgb(var(--color-bg))`,
        color: `rgb(var(--color-text))`
      }}
      {...props}
    >
      {icon ? (
        <span 
          className="shrink-0" 
          style={{ color: `rgb(var(--color-accent))` }}
        >
          {icon}
        </span>
      ) : null}
      <span className="flex-1">
        <div 
          className="font-semibold"
          style={{ 
            fontSize: `calc(0.9375rem * var(--font-scale))`,
            color: `rgb(var(--color-text))`
          }}
        >
          {title}
        </div>
        <div 
          style={{ 
            fontSize: `calc(0.875rem * var(--font-scale))`,
            color: `rgb(var(--color-text) / 0.8)`
          }}
        >
          {desc}
        </div>
      </span>
      <span 
        className="shrink-0" 
        style={{ color: `rgb(var(--color-accent))` }}
      >
        <ChevronRightIcon />
      </span>
    </button>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}