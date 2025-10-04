"use client";

import React from "react";
import clsx from "clsx";

/** Simple text helper. */
export function ZusText({
  as: Comp = "p",
  className,
  ...props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: React.ComponentProps<any> & { as?: React.ElementType }) {
  return <Comp className={clsx("text-[15px] leading-6 text-neutral-700", className)} {...props} />;
}