import { NextResponse } from 'next/server';
import { EnhancedAnalytics } from '@/lib/analytics/enhanced';
import { logger } from '@/lib/monitoring/logger';
import { MetricsService } from '@/lib/monitoring/metrics';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  
  try {
    const insights = await EnhancedAnalytics.getProjectInsights(params.id);
    
    // Record API latency
    const latency = Date.now() - startTime;
    await MetricsService.recordApiLatency('/api/projects/analytics', latency);

    return NextResponse.json(insights);
  } catch (error) {
    logger.error('Error fetching project analytics', {
      error,
      projectId: params.id
    });

    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 