import type { ReactNode } from "react";

type LegalCalloutProps = {
  children: ReactNode;
  tone?: "default" | "warn" | "info";
};

export function LegalCallout({ children, tone = "default" }: LegalCalloutProps) {
  return <aside className={`legal-callout legal-callout--${tone}`}>{children}</aside>;
}
