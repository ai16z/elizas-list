import { IconType } from 'react-icons';

export interface TagMetadata {
  icon?: IconType;
  color?: string;
  trending?: boolean;
  description?: string;
  popularity?: number; // 0-100
  category: string;
  relatedTags?: string[];
}

export interface TagAnalytics {
  usageCount: number;
  trendingScore: number;
  projectCount: number;
  recentGrowth: number; // percentage
  averageStars: number;
}

export interface TagCategory {
  id: string;
  name: string;
  description: string;
  icon?: IconType;
  color?: string;
  tags: string[];
} 