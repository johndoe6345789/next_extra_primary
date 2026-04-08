/**
 * DefaultProjectServiceAdapter
 * HTTP-based project CRUD and canvas operations.
 */

import type {
  IProjectServiceAdapter,
} from '../types'
import {
  listProjects, getProject,
  createProject,
} from './ProjectCrudQueries'
import {
  updateProject, deleteProject,
} from './ProjectMutationQueries'
import {
  getCanvasItems, createCanvasItem,
  updateCanvasItem,
} from './ProjectCanvasQueries'
import {
  deleteCanvasItem, bulkUpdateCanvasItems,
} from './ProjectCanvasBulkOps'

/** @brief HTTP adapter for project CRUD */
export class DefaultProjectServiceAdapter
  implements IProjectServiceAdapter {
  constructor(
    private apiBaseUrl: string = '/api'
  ) {}

  listProjects = listProjects
  getProject = getProject
  createProject = createProject
  updateProject = updateProject
  deleteProject = deleteProject
  getCanvasItems = getCanvasItems
  createCanvasItem = createCanvasItem
  updateCanvasItem = updateCanvasItem
  deleteCanvasItem = deleteCanvasItem
  bulkUpdateCanvasItems = bulkUpdateCanvasItems
}
