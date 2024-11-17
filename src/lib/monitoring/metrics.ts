export class MetricsService {
  private static metrics: Record<string, number> = {};

  static async recordApiLatency(path: string, latency: number) {
    const key = `api_latency_${path}`;
    this.metrics[key] = (this.metrics[key] || 0) + latency;
  }

  static async recordProjectView(projectId: string, userId?: string) {
    const key = `project_views_${projectId}`;
    this.metrics[key] = (this.metrics[key] || 0) + 1;
  }

  static getMetrics() {
    return this.metrics;
  }
} 