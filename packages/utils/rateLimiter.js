const rateLimitMap = new Map();

export function rateLimit(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, time: now };

  if (now - entry.time > windowMs) {
    rateLimitMap.set(key, { count: 1, time: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  rateLimitMap.set(key, entry);
  return true;
}
