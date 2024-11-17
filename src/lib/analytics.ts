import { prisma } from './prisma';
import { headers } from 'next/headers';

export class Analytics {
  static async trackProjectView(projectId: string, userId?: string) {
    await prisma.projectView.create({
      data: {
        projectId,
        userId,
        timestamp: new Date(),
        userAgent: headers().get('user-agent') || 'unknown',
        ipAddress: headers().get('x-forwarded-for') || 'unknown'
      }
    });
  }

  static async trackRelatedProjectClick(
    sourceProjectId: string,
    targetProjectId: string,
    userId?: string
  ) {
    await prisma.projectInteraction.create({
      data: {
        sourceProjectId,
        targetProjectId,
        userId,
        type: 'RELATED_CLICK',
        timestamp: new Date()
      }
    });
  }
} 