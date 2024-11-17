import { PrismaClient } from '@prisma/client';
import { logger } from '../monitoring/logger';
import { MetricsService } from '../monitoring/metrics';

const prisma = new PrismaClient();

interface UserSession {
  userId?: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
}

export class EnhancedAnalytics {
  static async trackProjectView(
    projectId: string,
    session: UserSession,
    referrer?: string
  ) {
    try {
      const [view, sessionData] = await Promise.all([
        prisma.projectView.create({
          data: {
            projectId,
            userId: session.userId,
            sessionId: session.sessionId,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            referrer,
            timestamp: new Date()
          }
        }),
        this.updateSessionData(session)
      ]);

      await MetricsService.recordProjectView(projectId, session.userId);
      logger.info('Project view tracked', { projectId, sessionId: session.sessionId });

      return view;
    } catch (error) {
      logger.error('Error tracking project view', { error, projectId });
      throw error;
    }
  }

  static async trackUserBehavior(
    type: 'click' | 'scroll' | 'hover',
    data: Record<string, any>,
    session: UserSession
  ) {
    await prisma.userBehavior.create({
      data: {
        type,
        data,
        userId: session.userId,
        sessionId: session.sessionId,
        timestamp: new Date()
      }
    });
  }

  static async getProjectInsights(projectId: string) {
    const [views, interactions, trends] = await Promise.all([
      this.getViewStats(projectId),
      this.getInteractionStats(projectId),
      this.getTrendAnalysis(projectId)
    ]);

    return { views, interactions, trends };
  }

  private static async getViewStats(projectId: string) {
    const [total, unique, recent] = await Promise.all([
      prisma.projectView.count({ where: { projectId } }),
      prisma.projectView.groupBy({
        by: ['sessionId'],
        where: { projectId },
        _count: true
      }),
      prisma.projectView.groupBy({
        by: ['date'],
        where: {
          projectId,
          timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        },
        _count: true
      })
    ]);

    return { total, uniqueSessions: unique.length, recentTrend: recent };
  }

  private static async getTrendAnalysis(projectId: string) {
    // Complex trend analysis using time series data
    const timeSeriesData = await prisma.$queryRaw`
      SELECT 
        date_trunc('day', timestamp) as date,
        count(*) as views,
        count(distinct "sessionId") as unique_views
      FROM "ProjectView"
      WHERE "projectId" = ${projectId}
      GROUP BY date_trunc('day', timestamp)
      ORDER BY date_trunc('day', timestamp)
    `;

    return this.calculateTrends(timeSeriesData);
  }

  private static calculateTrends(timeSeriesData: any[]) {
    // Calculate moving averages and growth rates
    const movingAverage = this.calculateMovingAverage(timeSeriesData, 7);
    const growthRate = this.calculateGrowthRate(timeSeriesData);

    return {
      movingAverage,
      growthRate,
      seasonality: this.detectSeasonality(timeSeriesData)
    };
  }
} 