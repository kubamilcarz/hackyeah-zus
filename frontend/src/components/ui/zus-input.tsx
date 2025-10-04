"use client";

"use client";

import React from "react";
import clsx from "clsx";

type BaseProps = {
  label: string;
  hintAction?: { label: string; onClick?: (e: React.MouseEvent) => void; href?: string };
  id: string;
};

export function ZusInput({
  label,
  hintAction,
  id,
  className,
  value,
  onChange,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={clsx(className)}>
      <label htmlFor={id} className="block text-[14px] font-medium text-neutral-700">
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          value={value}
          onChange={onChange}
          className="w-full h-11 rounded-md border border-[#2E6AA2] focus:ring-2 focus:ring-[#2E6AA2] focus:outline-none px-3 text-[15px]"
          {...props}
        />
        {hintAction ? (
          <a
            href={hintAction.href ?? "#"}
            className="absolute -right-1 -bottom-6 text-[13px] font-medium text-neutral-600"
            style={{ color: "rgb(var(--zus-blue))" }}
            onClick={(e) => {
              if (!hintAction.href) e.preventDefault();
              hintAction.onClick?.(e);
            }}
          >
            {hintAction.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function ZusPasswordInput({
  label,
  hintAction,
  id,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-medium text-neutral-800">
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="w-full h-11 rounded-md border border-[#2E6AA2] focus:ring-2 focus:ring-[#2E6AA2] focus:outline-none px-3 pr-10 text-[15px]"
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 text-[#2E6AA2]"
          aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
          onClick={() => setShow((v) => !v)}
        >
          <EyeIcon open={show} />
        </button>

        {hintAction ? (
          <a
            href={hintAction.href ?? "#"}
            className="absolute -right-1 -bottom-6 text-[13px] font-medium"
            style={{ color: "rgb(var(--zus-blue))" }}
            onClick={(e) => {
              if (!hintAction.href) e.preventDefault();
              hintAction.onClick?.(e);
            }}
          >
            {hintAction.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

/* small inline icon to avoid cross-imports */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" />
      <path d="m3 21 18-18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}