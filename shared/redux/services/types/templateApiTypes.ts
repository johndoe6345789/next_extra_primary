/**
 * Template API and Stats Types
 * Filter, request, and statistics types
 * for templates.
 */

import type { TemplateCategory } from './templateEntities'

/** @brief Template filter options */
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

/** @brief Create project from template */
export interface CreateProjectFromTemplateRequest {
  templateId: string;
  projectName: string;
  projectDescription?: string;
  workspaceId: string;
  customizeWorkflows?: boolean;
}

/** @brief Template usage statistics */
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

/** @brief Category with metadata */
export interface TemplateCategoryInfo {
  id: TemplateCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}
