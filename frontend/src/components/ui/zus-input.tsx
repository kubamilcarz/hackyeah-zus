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
      <label 
        htmlFor={id} 
        className="block text-sm font-medium"
        style={{ 
          fontSize: `calc(0.875rem * var(--font-scale))`,
          color: `rgb(var(--color-text))`
        }}
      >
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          value={value}
          onChange={onChange}
          className="w-full h-11 rounded-md border focus:ring-2 focus:outline-none px-3"
          style={{ 
            fontSize: `calc(0.9375rem * var(--font-scale))`,
            borderColor: `rgb(var(--color-accent))`,
            backgroundColor: `rgb(var(--color-card))`,
            color: `rgb(var(--color-text))`
          }}
          {...props}
        />
        {hintAction ? (
          <a
            href={hintAction.href ?? "#"}
            className="absolute -right-1 -bottom-6 text-sm font-medium text-neutral-600"
            style={{ 
              color: "rgb(var(--zus-blue))",
              fontSize: `calc(0.8125rem * var(--font-scale))` 
            }}
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
      <label 
        htmlFor={id} 
        className="block text-sm font-medium"
        style={{ 
          fontSize: `calc(0.875rem * var(--font-scale))`,
          color: `rgb(var(--color-text))`
        }}
      >
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="w-full h-11 rounded-md border focus:ring-2 focus:outline-none px-3 pr-10"
          style={{ 
            fontSize: `calc(0.9375rem * var(--font-scale))`,
            borderColor: `rgb(var(--color-accent))`,
            backgroundColor: `rgb(var(--color-card))`,
            color: `rgb(var(--color-text))`
          }}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3"
          style={{ color: `rgb(var(--color-accent))` }}
          aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
          onClick={() => setShow((v) => !v)}
        >
          <EyeIcon open={show} />
        </button>

        {hintAction ? (
          <a
            href={hintAction.href ?? "#"}
            className="absolute -right-1 -bottom-6 text-sm font-medium"
            style={{ 
              color: "rgb(var(--zus-blue))",
              fontSize: `calc(0.8125rem * var(--font-scale))` 
            }}
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