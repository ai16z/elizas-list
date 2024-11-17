import { NextResponse } from 'next/server';
import { CacheManager } from '@/lib/cache';
import { RateLimiter } from '@/lib/rateLimit';
import { Analytics } from '@/lib/analytics';
import { ProjectScorer } from '@/lib/scoring';
import { headers } from 'next/headers';
import { logger } from '@/lib/monitoring/logger';
import projects from '@/data/projects.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const clientIp = headers().get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `ratelimit:related:${clientIp}`;
    const isAllowed = await RateLimiter.checkLimit(rateLimitKey);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      );
    }

    // Check cache
    const cacheKey = `related:${params.id}`;
    const cached = await CacheManager.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const currentProject = projects.projects.find(p => p.id === params.id);
    if (!currentProject) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Track view
    await Analytics.trackProjectView(params.id);

    // Score and sort projects
    const otherProjects = projects.projects.filter(p => p.id !== params.id);
    const scoredProjects = await Promise.all(
      otherProjects.map(async project => ({
        ...project,
        score: await ProjectScorer.calculateScore(currentProject, project)
      }))
    );

    const relatedProjects = scoredProjects
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ score, ...project }) => project);

    // Cache results
    await CacheManager.set(cacheKey, relatedProjects);

    return NextResponse.json(relatedProjects);

  } catch (err) {
    logger.error('Error fetching related projects:', err);
    
    const error = err as Error;
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
} 