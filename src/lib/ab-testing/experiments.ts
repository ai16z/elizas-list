import { Redis } from 'ioredis';
import { logger } from '../monitoring/logger';
import { MetricsService } from '../monitoring/metrics';

const redis = new Redis({
  url: process.env.REDIS_URL
});

interface Experiment {
  id: string;
  name: string;
  variants: {
    id: string;
    weight: number;
    config: any;
  }[];
  startDate: Date;
  endDate?: Date;
}

export class ABTestingService {
  static async assignVariant(experimentId: string, userId: string): Promise<string> {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) throw new Error('Experiment not found');

    // Check if user already has a variant
    const existingVariant = await redis.get(`ab:${experimentId}:${userId}`);
    if (existingVariant) return existingVariant;

    // Assign new variant based on weights
    const variant = this.selectVariant(experiment.variants);
    await redis.set(`ab:${experimentId}:${userId}`, variant.id);
    
    // Track assignment
    await this.trackAssignment(experimentId, userId, variant.id);
    
    return variant.id;
  }

  static async trackConversion(
    experimentId: string,
    userId: string,
    conversionType: string,
    value?: number
  ) {
    const variantId = await redis.get(`ab:${experimentId}:${userId}`);
    if (!variantId) return;

    await Promise.all([
      redis.hincrby(`ab:conversions:${experimentId}:${variantId}`, conversionType, 1),
      value && redis.hincrbyfloat(
        `ab:values:${experimentId}:${variantId}`,
        conversionType,
        value
      )
    ]);
  }

  static async getResults(experimentId: string) {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) throw new Error('Experiment not found');

    const results = await Promise.all(
      experiment.variants.map(async variant => {
        const [assignments, conversions, values] = await Promise.all([
          redis.get(`ab:assignments:${experimentId}:${variant.id}`),
          redis.hgetall(`ab:conversions:${experimentId}:${variant.id}`),
          redis.hgetall(`ab:values:${experimentId}:${variant.id}`)
        ]);

        return {
          variantId: variant.id,
          assignments: parseInt(assignments || '0'),
          conversions,
          values
        };
      })
    );

    return this.calculateStatistics(results);
  }

  private static calculateStatistics(results: any[]) {
    // Calculate confidence intervals, p-values, etc.
    return results.map(result => ({
      ...result,
      statistics: {
        conversionRate: result.conversions / result.assignments,
        confidenceInterval: this.calculateConfidenceInterval(
          result.conversions,
          result.assignments
        ),
        pValue: this.calculatePValue(results, result)
      }
    }));
  }
} 