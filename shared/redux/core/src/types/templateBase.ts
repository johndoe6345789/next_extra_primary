/**
 * Core template type definitions
 * Template workflows and project templates
 */

/**
 * Template workflow - minimal workflow for templates
 */
export interface TemplateWorkflow {
  name: string;
  description: string;
  nodes: Array<{
    id: string;
    type: string;
    label?: string;
  }>;
  connections?: Array<{
    source: string;
    target: string;
  }>;
}

/**
 * Template Category - classification for templates
 */
export type TemplateCategory =
  | 'automation'
  | 'data-processing'
  | 'integration'
  | 'monitoring'
  | 'reporting'
  | 'communication'
  | 'content'
  | 'ecommerce'
  | 'finance'
  | 'crm'
  | 'hr'
  | 'custom';

/**
 * Project Template - reusable project blueprint
 */
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: TemplateCategory;
  icon: string;
  color: string;
  difficulty:
    | 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  workflows: TemplateWorkflow[];
  metadata: {
    author: string;
    version: string;
    createdAt: number;
    updatedAt: number;
    downloads?: number;
    rating?: number;
    featured?: boolean;
  };
  preview?: {
    thumbnail?: string;
    banner?: string;
    description: string;
  };
}
