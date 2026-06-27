import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 仅 dev 模式需要；生产模式分享不受此限制
  allowedDevOrigins: [
    "192.168.0.49",
    "192.168.0.136",
    "*.loca.lt",
    "*.trycloudflare.com",
  ],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
