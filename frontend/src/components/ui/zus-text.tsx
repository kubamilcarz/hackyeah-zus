"use client";

import React from "react";
import clsx from "clsx";

/** Simple text helper with scaling and contrast support. */
export function ZusText({
  as: Comp = "p",
  className,
  style,
  ...props
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: React.ComponentProps<any> & { as?: React.ElementType }) {
  const scaleStyle = {
    fontSize: `calc(0.9375rem * var(--font-scale))`,
    color: `rgb(var(--color-text))`,
    ...style
  };
  
  return (
    <Comp 
      className={clsx("leading-6", className)} 
      style={scaleStyle}
      {...props} 
    />
  );
}