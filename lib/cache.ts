// This is a simple in-memory cache to simulate Redis for local development.
// In a real production environment, you would use a Redis client here (e.g., @upstash/redis).

class LocalCache {
  private cache = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.cache.set(key, value);
  }

  // Simulate a rate limiter (simplified)
  // Maps IP -> count
  private rateLimits = new Map<string, { count: number; expiresAt: number }>();

  async checkRateLimit(ip: string): Promise<boolean> {
    const now = Date.now();
    const WINDOW_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 10; // 10 requests per minute

    let record = this.rateLimits.get(ip);
    
    // If no record or expired, create new
    if (!record || record.expiresAt < now) {
      record = { count: 0, expiresAt: now + WINDOW_MS };
    }

    record.count++;
    this.rateLimits.set(ip, record);

    return record.count <= MAX_REQUESTS;
  }
}

export const cache = new LocalCache();
