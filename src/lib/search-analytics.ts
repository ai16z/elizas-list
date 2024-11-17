import prisma from './prisma';

export async function trackSearch(query: string, userId?: string) {
  await prisma.searchQuery.create({
    data: {
      query,
      userId,
      timestamp: new Date(),
    },
  });
}

export async function getPopularSearches(limit = 10) {
  const searches = await prisma.searchQuery.groupBy({
    by: ['query'],
    _count: {
      query: true,
    },
    orderBy: {
      _count: {
        query: 'desc',
      },
    },
    take: limit,
  });

  return searches;
} 