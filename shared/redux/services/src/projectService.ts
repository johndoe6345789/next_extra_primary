/**
 * Project Service - barrel re-export
 */

import {
  listProjects, getProject, createProject,
  updateProject, deleteProject,
} from './projectOperations';
import {
  getCanvasItems, createCanvasItem,
  updateCanvasItem, deleteCanvasItem,
  bulkUpdateCanvasItems,
} from './canvasOperations';

/** Project service with CRUD + canvas ops */
export const projectService = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCanvasItems,
  createCanvasItem,
  updateCanvasItem,
  deleteCanvasItem,
  bulkUpdateCanvasItems,
};

export default projectService;
