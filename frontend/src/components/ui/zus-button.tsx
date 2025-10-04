"use client";

import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
};

export function ZusButton({ variant = "primary", size = "md", className, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2";
  const sizeCls = size === "sm" ? "h-9 px-3 text-[14px]" : "h-11 px-5 text-[15px]";
  const variantCls = {
    primary: "text-white bg-[#2E6AA2] hover:bg-[#295F90] focus-visible:ring-[#2E6AA2]",
    secondary: "text-neutral-900 bg-neutral-100 hover:bg-neutral-200 focus-visible:ring-neutral-400",
    ghost: "text-[#2E6AA2] hover:bg-[#EBF2F9] focus-visible:ring-[#2E6AA2]"
  }[variant];

  return <button className={clsx(base, sizeCls, variantCls, className)} {...props} />;
}