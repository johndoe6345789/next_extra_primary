/**
 * Template statistics and rating queries
 */

import type {
  ProjectTemplate,
  TemplateCategoryInfo,
} from '../types/template';

export {
  getAllTags, getWithTag, getRelated,
} from './templateRelated';

/** Get popular templates by downloads */
export function getPopular(
  templates: ProjectTemplate[], limit = 6
): ProjectTemplate[] {
  return [...templates]
    .sort((a, b) =>
      (b.metadata.downloads || 0) -
      (a.metadata.downloads || 0)
    )
    .slice(0, limit);
}

/** Get top-rated templates */
export function getTopRated(
  templates: ProjectTemplate[], limit = 6
): ProjectTemplate[] {
  return templates
    .filter(
      (t) => (t.metadata.rating || 0) >= 4.5
    )
    .sort((a, b) =>
      (b.metadata.rating || 0) -
      (a.metadata.rating || 0)
    )
    .slice(0, limit);
}

/** Get templates by difficulty */
export function getByDifficulty(
  templates: ProjectTemplate[],
  difficulty: string
): ProjectTemplate[] {
  return templates
    .filter((t) => t.difficulty === difficulty)
    .sort((a, b) =>
      (b.metadata.rating || 0) -
      (a.metadata.rating || 0)
    );
}

/** Get template statistics */
export function getStats(
  templates: ProjectTemplate[],
  categories: TemplateCategoryInfo[]
) {
  const total = templates.length;
  const downloads = templates.reduce(
    (s, t) => s + (t.metadata.downloads || 0), 0
  );
  const avgRating = total > 0
    ? templates.reduce(
      (s, t) => s + (t.metadata.rating || 0), 0
    ) / total : 0;
  return {
    totalTemplates: total,
    totalDownloads: downloads,
    averageRating:
      Math.round(avgRating * 100) / 100,
    totalCategories: categories.length,
    difficultyBreakdown: {
      beginner: templates.filter(
        (t) => t.difficulty === 'beginner'
      ).length,
      intermediate: templates.filter(
        (t) => t.difficulty === 'intermediate'
      ).length,
      advanced: templates.filter(
        (t) => t.difficulty === 'advanced'
      ).length,
    },
  };
}
