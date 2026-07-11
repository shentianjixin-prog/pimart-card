import Image from "next/image";

type Props = {
  height?: number;
  className?: string;
  /** mark=网站圆标 | brand=企业字标 | lockup=圆标+字标 */
  variant?: "mark" | "brand" | "lockup" | "full" | "compact" | "wordmark";
  tone?: "dark" | "light";
};

/**
 * V4 方案：
 * - mark：左边圆形网站 logo
 * - brand：右边企业品牌字标
 * - lockup：两者并列（顶栏默认）
 */
export function PimartLogo({
  height = 36,
  className = "",
  variant = "lockup",
  tone = "dark",
}: Props) {
  const mode =
    variant === "full" || variant === "compact"
      ? "mark"
      : variant === "wordmark"
        ? "brand"
        : variant;

  const invert = tone === "light" ? "brightness-0 invert" : "";

  if (mode === "brand") {
    const width = Math.round(height * (280 / 72));
    return (
      <span className={`inline-flex items-center ${className}`} role="img" aria-label="PIMART CARD">
        <Image
          src="/logo-brand.svg"
          alt="PIMART CARD"
          width={width}
          height={height}
          className={`h-auto w-auto ${invert}`}
          style={{ height, width: "auto" }}
          unoptimized
          priority
        />
      </span>
    );
  }

  if (mode === "mark") {
    return (
      <span className={`inline-flex items-center ${className}`} role="img" aria-label="PIMART">
        <Image
          src="/logo-icon.svg"
          alt="PIMART"
          width={height}
          height={height}
          className={`h-auto w-auto ${invert}`}
          style={{ height, width: height }}
          unoptimized
          priority
        />
      </span>
    );
  }

  // lockup：网站圆标 + 企业字标
  const markSize = height;
  const brandH = Math.round(height * 0.72);
  const brandW = Math.round(brandH * (280 / 72));

  return (
    <span
      className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}
      role="img"
      aria-label="PIMART CARD"
    >
      <Image
        src="/logo-icon.svg"
        alt=""
        width={markSize}
        height={markSize}
        className={`shrink-0 ${invert}`}
        style={{ height: markSize, width: markSize }}
        unoptimized
        priority
      />
      <Image
        src="/logo-brand.svg"
        alt=""
        width={brandW}
        height={brandH}
        className={`hidden min-[380px]:block ${invert}`}
        style={{ height: brandH, width: "auto" }}
        unoptimized
        priority
      />
    </span>
  );
}
