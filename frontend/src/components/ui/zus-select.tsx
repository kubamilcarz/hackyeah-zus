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
            {label && (
                <label 
                    htmlFor={id} 
                    className="block font-medium"
                    style={{ 
                        fontSize: `calc(0.875rem * var(--font-scale))`,
                        color: `rgb(var(--color-text))`
                    }}
                >
                    {label}
                </label>
            )}
            <div className="mt-2 relative">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 rounded-md border focus:ring-2 focus:outline-none px-3 pr-2"
                    style={{
                        fontSize: `calc(0.9375rem * var(--font-scale))`,
                        borderColor: `rgb(var(--color-accent))`,
                        backgroundColor: `rgb(var(--color-card))`,
                        color: `rgb(var(--color-text))`
                    }}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {hintText && (
                <p 
                    className="mt-1 font-medium text-right"
                    style={{ 
                        fontSize: `calc(0.8125rem * var(--font-scale))`,
                        color: `rgb(var(--color-text) / 0.7)`
                    }}
                >
                    {hintText}
                </p>
            )}
        </div>
    );
}