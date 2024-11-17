import { Project } from '@/types/project';
import { Analytics } from './analytics';

export class ProjectScorer {
  static async calculateScore(currentProject: Project, candidateProject: Project): Promise<number> {
    const scores = await Promise.all([
      this.calculateTagScore(currentProject, candidateProject),
      this.calculateMetricsScore(candidateProject),
      this.calculateRecencyScore(candidateProject),
      this.calculateUserBehaviorScore(currentProject.id, candidateProject.id),
      this.calculateAuthorScore(currentProject, candidateProject),
      this.calculateTechnologyStackScore(currentProject, candidateProject),
      this.calculatePopularityTrendScore(candidateProject)
    ]);

    // Weighted average of all scores
    const weights = [0.3, 0.15, 0.1, 0.15, 0.1, 0.1, 0.1];
    return scores.reduce((acc, score, i) => acc + score * weights[i], 0);
  }

  private static async calculateTagScore(current: Project, candidate: Project): Promise<number> {
    const intersection = current.tags.filter(tag => candidate.tags.includes(tag));
    const union = new Set([...current.tags, ...candidate.tags]);
    return intersection.length / union.size;
  }

  private static calculateMetricsScore(project: Project): number {
    const { stars = 0, forks = 0 } = project.metrics || {};
    const normalizedStars = Math.log10(stars + 1) / Math.log10(1000);
    const normalizedForks = Math.log10(forks + 1) / Math.log10(100);
    return (normalizedStars * 0.7 + normalizedForks * 0.3);
  }

  private static calculateRecencyScore(project: Project): number {
    const ageInDays = (Date.now() - new Date(project.addedOn).getTime()) / (1000 * 60 * 60 * 24);
    return Math.exp(-ageInDays / 365);
  }

  private static async calculateUserBehaviorScore(currentId: string, candidateId: string): Promise<number> {
    const interactions = await prisma.projectInteraction.count({
      where: {
        OR: [
          { sourceProjectId: currentId, targetProjectId: candidateId },
          { sourceProjectId: candidateId, targetProjectId: currentId }
        ]
      }
    });
    return Math.min(interactions / 10, 1);
  }

  private static async calculatePopularityTrendScore(project: Project): Promise<number> {
    // Calculate trend based on recent views and interactions
    const recentViews = await prisma.projectView.count({
      where: {
        projectId: project.id,
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });
    return Math.min(recentViews / 100, 1);
  }
} 