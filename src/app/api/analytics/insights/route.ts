import { NextResponse } from 'next/server';
import { UserSegmentation } from '@/lib/analytics/segmentation';
import { AnalyticsVisualization } from '@/lib/analytics/visualization';
import { logger } from '@/lib/monitoring/logger';

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface InteractionData {
  [key: string]: number;
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const projectId = searchParams.get('projectId');

    const segments = await UserSegmentation.generateSegments();
    const timeSeriesData: TimeSeriesDataPoint[] = [];
    const interactionData: InteractionData = {};

    const visualizations = {
      timeSeriesChart: AnalyticsVisualization.generateTimeSeriesChart(timeSeriesData),
      engagementChart: AnalyticsVisualization.generateHeatmap(interactionData)
    };

    return NextResponse.json({ segments, visualizations });
  } catch (error) {
    logger.error('Error generating insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
} 