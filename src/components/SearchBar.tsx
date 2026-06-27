"use client";

import { useT } from "@/lib/lang-context";

type Props = {
  className?: string;
  defaultValue?: string;
  large?: boolean;
};

export function SearchBar({ className = "", defaultValue = "", large = false }: Props) {
  const T = useT();

  return (
    <form action="/" className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca3af]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={T("nav_search_products")}
        className={`input-field w-full pl-12 ${large ? "py-3.5 text-base" : "py-2.5 text-sm"}`}
      />
    </form>
  );
}
