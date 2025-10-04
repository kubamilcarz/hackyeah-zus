"use client";

import Image from "next/image";

export function ZusBrandBar() {
  return (
    <div className="flex flex-row justify-stretch items-center gap-2">
      <Image src="/pue-logo.png" alt="PUE ZUS Logo" height={22} width={80} />
      <div className="w-px h-6 bg-gray-300"></div>
      <Image src="/ezus-logo.svg" alt="eZUS Logo" height={22} width={80} />
    </div>
  );
}