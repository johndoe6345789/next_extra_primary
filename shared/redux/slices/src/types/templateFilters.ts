/**
 * Template filter, request, and statistics types
 */

import type { TemplateCategory } from './template';

/**
 * Template Filter Options
 */
export interface TemplateFilters {
  category?: TemplateCategory | TemplateCategory[];
  difficulty?:
    | 'beginner'
    | 'intermediate'
    | 'advanced';
  featured?: boolean;
  searchQuery?: string;
  tags?: string[];
}

/**
 * Template Creation Request
 */
export interface CreateProjectFromTemplateRequest {
  templateId: string;
  projectName: string;
  projectDescription?: string;
  workspaceId: string;
  customizeWorkflows?: boolean;
}

/**
 * Template Usage Statistics
 */
export interface TemplateStats {
  templateId: string;
  totalCreated: number;
  averageCompletionTime?: number;
  userRatings?: {
    average: number;
    count: number;
  };
  tags: string[];
  lastUsed?: number;
}

/**
 * Template Category with metadata
 */
export interface TemplateCategoryInfo {
  id: TemplateCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}
