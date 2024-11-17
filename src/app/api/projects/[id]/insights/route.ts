import { NextResponse } from 'next/server';
import { EnhancedAnalytics } from '@/lib/analytics/enhanced';
import { AnalyticsVisualization } from '@/lib/analytics/visualization';
import { ABTestingService } from '@/lib/ab-testing/experiments';
import { redis } from '@/lib/redis';
import { logger } from '@/lib/monitoring/logger';

interface InsightsResponse {
  insights: {
    views: any;
    interactions: any;
    trends: {
      timeSeriesData: any[];
    };
  };
  abTestResults: any;
  realtimeStats: Record<string, string>;
  visualizations: {
    timeSeriesChart: any;
    engagementHeatmap: any;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [
      insights,
      abTestResults,
      realtimeStats
    ] = await Promise.all([
      EnhancedAnalytics.getProjectInsights(params.id),
      ABTestingService.getResults('project-layout-test'),
      redis.hgetall(`realtime:${params.id}`)
    ]);

    const visualizations = {
      timeSeriesChart: AnalyticsVisualization.generateTimeSeriesChart(
        insights.trends.timeSeriesData
      ),
      engagementHeatmap: AnalyticsVisualization.generateHeatmap(
        insights.interactions.hourlyData
      )
    };

    return NextResponse.json({
      insights,
      abTestResults,
      realtimeStats,
      visualizations
    } as InsightsResponse);

  } catch (error) {
    logger.error('Error generating insights', {
      error,
      projectId: params.id
    });

    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 