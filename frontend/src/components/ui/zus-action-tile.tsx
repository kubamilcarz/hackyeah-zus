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
        "w-full rounded-lg bg-[#F3F6FA] hover:bg-[#EBF2F9] transition-colors text-left px-4 py-4 flex items-center gap-4 border border-transparent",
        className
      )}
      {...props}
    >
      {icon ? <span className="shrink-0 text-[#2E6AA2]">{icon}</span> : null}
      <span className="flex-1">
        <div className="text-[15px] font-semibold text-neutral-900">{title}</div>
        <div className="text-[14px] text-neutral-700">{desc}</div>
      </span>
      <span className="shrink-0 text-[#2E6AA2]">
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