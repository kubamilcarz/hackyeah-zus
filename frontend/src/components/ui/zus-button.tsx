"use client";

import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
};

export function ZusButton({ variant = "primary", size = "md", className, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2";
  
  // Scale-aware sizing
  const sizeCls = size === "sm" 
    ? "h-9 px-3" 
    : "h-11 px-5";
  
  // Contrast-aware variants
  const variantCls = {
    primary: "zus-btn-primary text-white bg-[#2E6AA2] hover:bg-[#295F90] focus-visible:ring-[#2E6AA2]",
    secondary: "zus-btn-secondary text-[rgb(var(--color-text))] bg-[rgb(var(--color-bg))] hover:bg-[rgb(var(--color-text)/0.1)] focus-visible:ring-[rgb(var(--color-accent))]",
    ghost: "zus-btn-ghost text-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent)/0.1)] focus-visible:ring-[rgb(var(--color-accent))]"
  }[variant];
  
  // Font size styling with scale support
  const fontSizeStyle = {
    fontSize: `calc(${size === "sm" ? "0.875rem" : "0.9375rem"} * var(--font-scale))`
  };

  return (
    <button 
      className={clsx(base, sizeCls, variantCls, className)} 
      style={fontSizeStyle}
      {...props} 
    />
  );
}