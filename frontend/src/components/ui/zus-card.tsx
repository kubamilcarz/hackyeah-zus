"use client";

import React from "react";
import clsx from "clsx";

export function ZusCard({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const cardStyle = {
    backgroundColor: `rgb(var(--color-card))`,
    color: `rgb(var(--color-text))`,
    ...style
  };
  
  return (
    <div 
      className={clsx("rounded-lg", className)} 
      style={cardStyle}
      {...props} 
    />
  );
}

export function ZusCardHeader({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const headerStyle = {
    color: `rgb(var(--color-text))`,
    ...style
  };
  
  return (
    <div 
      className={clsx("p-0", className)} 
      style={headerStyle}
      {...props} 
    />
  );
}

export function ZusCardBody({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const bodyStyle = {
    color: `rgb(var(--color-text))`,
    ...style
  };
  
  return (
    <div 
      className={clsx("p-0", className)} 
      style={bodyStyle}
      {...props} 
    />
  );
}