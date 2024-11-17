import { Project } from '@/types/project';
import { prisma } from '@/lib/prisma';

export class RecommendationEngine {
  static async getRelatedProjects(projectId: string, limit = 4): Promise<Project[]> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { tags: true }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Get projects with similar tags
    const relatedByTags = await prisma.project.findMany({
      where: {
        AND: [
          { id: { not: projectId } },
          {
            tags: {
              some: {
                name: {
                  in: project.tags.map(t => t.name)
                }
              }
            }
          }
        ]
      },
      include: {
        author: true,
        tags: true,
        metrics: true
      },
      take: limit * 2 // Get more than needed for scoring
    });

    // Get user behavior data
    const userBehavior = await prisma.userBehavior.findMany({
      where: {
        OR: [
          { projectId },
          { projectId: { in: relatedByTags.map(p => p.id) } }
        ]
      }
    });

    // Score projects based on multiple factors
    const scoredProjects = relatedByTags.map(project => {
      let score = 0;

      // Tag similarity score
      const commonTags = project.tags.filter(tag => 
        project.tags.some(t => t.name === tag.name)
      ).length;
      score += commonTags * 2;

      // User behavior score
      const projectInteractions = userBehavior.filter(b => b.projectId === project.id).length;
      score += projectInteractions;

      // Popularity score
      score += (project.metrics?.stars || 0) * 0.01;
      score += (project.metrics?.forks || 0) * 0.02;

      return {
        ...project,
        score
      };
    });

    // Sort by score and return top results
    return scoredProjects
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...project }) => project);
  }

  static async updateUserBehavior(userId: string, projectId: string, action: 'view' | 'like' | 'share') {
    await prisma.userBehavior.create({
      data: {
        userId,
        projectId,
        action,
        timestamp: new Date()
      }
    });
  }
} 