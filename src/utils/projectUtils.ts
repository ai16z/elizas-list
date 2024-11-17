import { Project } from '@/types/project';

export const sortProjects = (projects: Project[], sortBy: 'date' | 'name') => {
  return [...projects].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime();
    }
    return a.name.localeCompare(b.name);
  });
};

export const generateProjectId = () => {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateProject = (project: Partial<Project>): string[] => {
  const errors: string[] = [];

  if (!project.name?.trim()) errors.push('Project name is required');
  if (!project.description?.trim()) errors.push('Description is required');
  if (!project.github?.trim()) errors.push('GitHub URL is required');
  if (!project.image?.trim()) errors.push('Image is required');
  if (!project.author?.name?.trim()) errors.push('Author name is required');
  if (!project.author?.github?.trim()) errors.push('Author GitHub is required');
  if (!project.tags?.length) errors.push('At least one tag is required');

  return errors;
}; 