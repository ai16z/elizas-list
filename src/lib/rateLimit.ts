import { Redis } from 'ioredis';

const rateLimitRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class RateLimiter {
  static async checkLimit(key: string, limit: number = 100, window: number = 3600): Promise<boolean> {
    const current = await rateLimitRedis.incr(key);
    if (current === 1) {
      await rateLimitRedis.expire(key, window);
    }
    return current <= limit;
  }

  static async getRemainingLimit(key: string): Promise<number> {
    const current = await rateLimitRedis.get(key);
    return 100 - (parseInt(current || '0'));
  }
} 