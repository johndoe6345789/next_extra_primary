/**
 * API Middleware Configuration Types
 */

/** @brief Config for the API middleware */
export interface ApiMiddlewareConfig {
  workflowService: {
    saveWorkflow: (
      workflow: any
    ) => Promise<any>
    syncToBackend: (
      workflow: any
    ) => Promise<any>
    getWorkflow: (
      id: string,
      tenantId: string
    ) => Promise<any>
    fetchFromBackend: (
      id: string,
      tenantId: string
    ) => Promise<any>
    createWorkflow: (config: {
      name: string
      description?: string
      tenantId: string
    }) => Promise<any>
    deleteWorkflow: (
      id: string
    ) => Promise<void>
  }
  executionService: {
    executeWorkflow: (
      id: string,
      config: {
        nodes: any[]
        connections: any[]
      }
    ) => Promise<any>
  }
  actions: {
    setSaving: (saving: boolean) => any
    setSaveError: (error: string) => any
    saveWorkflow: (workflow: any) => any
    startExecution: (execution: any) => any
    endExecution: (result: any) => any
    loadWorkflow: (workflow: any) => any
    setNotification: (notification: {
      id: string
      type:
        | 'success'
        | 'error'
        | 'warning'
        | 'info'
      message: string
      duration: number
    }) => any
  }
}
