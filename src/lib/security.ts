import "server-only";

const buckets = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = 0;

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    forwardedFor ||
    headers.get("x-forwarded-host") ||
    "unknown"
  );
}

export function rateLimitKey(headers: Headers, scope: string, subject?: string) {
  const ip = getClientIp(headers);
  return [scope, ip, subject?.trim().toLowerCase()].filter(Boolean).join(":");
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  if (now - lastCleanup > 60_000) {
    lastCleanup = now;
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

export function isHoneypotFilled(formData: FormData) {
  return String(formData.get("company") || "").trim().length > 0;
}