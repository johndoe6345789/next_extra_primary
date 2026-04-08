/**
 * Template Service - barrel re-export
 */

import type {
  ProjectTemplate, TemplateCategory,
  TemplateCategoryInfo,
} from '../types/template';
import templateData from '../data/templates.json';
import {
  getAllTemplates, getTemplate,
  searchTemplates, getByCategory, getFeatured,
} from './templateQueries';
import {
  getPopular, getTopRated, getByDifficulty,
  getAllTags, getWithTag, getRelated, getStats,
} from './templateStats';

const tmpls = (templateData as Record<
  string, unknown>
).templates as ProjectTemplate[];
const cats = (templateData as Record<
  string, unknown>
).categories as TemplateCategoryInfo[];

export const templateService = {
  getAllTemplates: () => getAllTemplates(tmpls),
  getTemplate: (id: string) =>
    getTemplate(tmpls, id),
  searchTemplates: (f: Parameters<
    typeof searchTemplates
  >[1]) => searchTemplates(tmpls, f),
  getTemplatesByCategory: (
    c: TemplateCategory
  ) => getByCategory(tmpls, c),
  getFeaturedTemplates: (l?: number) =>
    getFeatured(tmpls, l),
  getPopularTemplates: (l?: number) =>
    getPopular(tmpls, l),
  getTopRatedTemplates: (l?: number) =>
    getTopRated(tmpls, l),
  getTemplatesByDifficulty: (d: string) =>
    getByDifficulty(tmpls, d),
  getCategories: () => cats.map((c) => ({
    ...c,
    templateCount: tmpls.filter(
      (t) => t.category === c.id
    ).length,
  })),
  getCategory: (id: TemplateCategory) => {
    const c = cats.find((x) => x.id === id);
    if (!c) return undefined;
    return {
      ...c,
      templateCount: tmpls.filter(
        (t) => t.category === id
      ).length,
    };
  },
  getAllTags: () => getAllTags(tmpls),
  getTemplatesWithTag: (tag: string) =>
    getWithTag(tmpls, tag),
  getRelatedTemplates: (
    id: string, l?: number
  ) => getRelated(tmpls, id, l),
  getStats: () => getStats(tmpls, cats),
};
