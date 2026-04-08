/**
 * Template related and tag queries
 */

import type { ProjectTemplate } from
  '../types/template';

/** Get all unique tags */
export function getAllTags(
  templates: ProjectTemplate[]
): string[] {
  const tagSet = new Set<string>();
  templates.forEach(
    (t) => t.tags.forEach(
      (tag) => tagSet.add(tag)
    )
  );
  return Array.from(tagSet).sort();
}

/** Get templates with a specific tag */
export function getWithTag(
  templates: ProjectTemplate[], tag: string
): ProjectTemplate[] {
  return templates
    .filter((t) => t.tags.includes(tag))
    .sort((a, b) =>
      (b.metadata.rating || 0) -
      (a.metadata.rating || 0)
    );
}

/** Get related templates */
export function getRelated(
  templates: ProjectTemplate[],
  templateId: string,
  limit = 4
): ProjectTemplate[] {
  const tmpl = templates.find(
    (t) => t.id === templateId
  );
  if (!tmpl) return [];
  return templates
    .filter((t) =>
      t.id !== templateId &&
      t.category === tmpl.category
    )
    .sort((a, b) =>
      (b.metadata.rating || 0) -
      (a.metadata.rating || 0)
    )
    .slice(0, limit);
}
