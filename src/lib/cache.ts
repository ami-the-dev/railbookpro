interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 300_000;

export async function cacheGet<T>(key: string): Promise<T | null> {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function cacheSet<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL): Promise<void> {
  memoryStore.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export async function cacheDelete(key: string): Promise<void> {
  memoryStore.delete(key);
}

export async function cacheClear(pattern?: string): Promise<void> {
  if (pattern) {
    const regex = new RegExp(pattern.replace("*", ".*"));
    for (const key of memoryStore.keys()) {
      if (regex.test(key)) memoryStore.delete(key);
    }
  } else {
    memoryStore.clear();
  }
}

export function getCacheStats() {
  return { size: memoryStore.size, keys: Array.from(memoryStore.keys()) };
}

export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(":")}`;
}
