"use client";

import React from "react";
import clsx from "clsx";

export function ZusCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("bg-white rounded-lg", className)} {...props} />;
}

export function ZusCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-0", className)} {...props} />;
}

export function ZusCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-0", className)} {...props} />;
}