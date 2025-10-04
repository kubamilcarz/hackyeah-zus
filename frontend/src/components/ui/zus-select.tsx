"use client";

import React from "react";
import clsx from "clsx";

type Option = { value: string | number; label: string };

type Props = {
    id?: string;
    label?: string;
    value: string | number;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
    hintText?: string;
};

export function ZusSelect({ id, label, value, onChange, options, className, hintText }: Props) {
    return (
        <div className={clsx(className)}>
            <label htmlFor={id} className="block text-[14px] font-medium text-neutral-700">
                {label}
            </label>
            <div className="mt-2 relative">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 rounded-md border border-[#2E6AA2] focus:ring-2 focus:ring-[#2E6AA2] focus:outline-none px-3 pr-2 text-[15px]"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {hintText && (
                <p className="mt-1 text-[13px] font-medium text-neutral-600 text-right">
                    {hintText}
                </p>
            )}
        </div>
    );
}