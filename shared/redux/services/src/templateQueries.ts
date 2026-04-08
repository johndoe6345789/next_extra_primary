/**
 * Template query functions
 */

import type {
  ProjectTemplate, TemplateCategory,
} from '../types/template';
import {
  sortByFeatured, searchTemplates,
} from './templateFilterQueries';

export { searchTemplates } from
  './templateFilterQueries';

/** Get all templates sorted by featured */
export function getAllTemplates(
  templates: ProjectTemplate[]
): ProjectTemplate[] {
  return [...templates].sort(sortByFeatured);
}

/** Get template by ID */
export function getTemplate(
  templates: ProjectTemplate[], id: string
): ProjectTemplate | undefined {
  return templates.find((t) => t.id === id);
}

/** Get templates by category */
export function getByCategory(
  templates: ProjectTemplate[],
  cat: TemplateCategory
): ProjectTemplate[] {
  return templates
    .filter((t) => t.category === cat)
    .sort((a, b) =>
      (b.metadata.rating || 0) -
      (a.metadata.rating || 0));
}

/** Get featured templates */
export function getFeatured(
  templates: ProjectTemplate[], limit = 6
): ProjectTemplate[] {
  return templates
    .filter((t) => t.metadata.featured)
    .sort((a, b) =>
      (b.metadata.rating || 0) -
      (a.metadata.rating || 0)
    )
    .slice(0, limit);
}
