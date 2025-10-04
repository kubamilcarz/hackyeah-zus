"use client";

import React from "react";
import clsx from "clsx";

type Option = { value: string | number; label: string };

type Props = {
  id?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
};

export function ZusSelect({ id, value, onChange, options, className }: Props) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "zus-select w-full h-11 rounded-md border border-[#2E6AA2] focus:ring-2 focus:ring-[#2E6AA2] focus:outline-none px-3 text-[15px]",
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}