/**
 * Template filtering and search logic
 */

import type {
  ProjectTemplate, TemplateFilters,
} from '../types/template';

/** Sort by featured, then rating */
export function sortByFeatured(
  a: ProjectTemplate, b: ProjectTemplate
) {
  if (
    a.metadata.featured !== b.metadata.featured
  ) {
    return (b.metadata.featured ? 1 : 0) -
      (a.metadata.featured ? 1 : 0);
  }
  return (b.metadata.rating || 0) -
    (a.metadata.rating || 0);
}

/** Search templates with filters */
export function searchTemplates(
  templates: ProjectTemplate[],
  filters: TemplateFilters
): ProjectTemplate[] {
  let results = [...templates];
  if (filters.category) {
    const cats = Array.isArray(filters.category)
      ? filters.category : [filters.category];
    results = results.filter(
      (t) => cats.includes(t.category)
    );
  }
  if (filters.difficulty) {
    results = results.filter(
      (t) => t.difficulty === filters.difficulty
    );
  }
  if (filters.featured) {
    results = results.filter(
      (t) => t.metadata.featured
    );
  }
  if (filters.searchQuery?.length) {
    const q = filters.searchQuery.toLowerCase();
    results = results.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tg) =>
        tg.toLowerCase().includes(q)));
  }
  if (filters.tags?.length) {
    results = results.filter((t) =>
      filters.tags!.some(
        (tag) => t.tags.includes(tag)
      )
    );
  }
  return results.sort(sortByFeatured);
}
