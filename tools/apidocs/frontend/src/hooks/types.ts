/**
 * @file types.ts
 * @brief OpenAPI 3.0 type definitions.
 */

/** @brief Single API parameter definition. */
export interface OApiParam {
  name: string;
  in: string;
  required?: boolean;
  schema?: OApiSchema;
  description?: string;
}

/** @brief JSON Schema subset for OpenAPI. */
export interface OApiSchema {
  type?: string;
  properties?: Record<string, OApiSchema>;
  required?: string[];
  items?: OApiSchema;
  enum?: string[];
  description?: string;
  format?: string;
  $ref?: string;
}

/** @brief Request body definition. */
export interface OApiRequestBody {
  required?: boolean;
  content?: Record<string, { schema: OApiSchema }>;
}

/** @brief Single operation on a path. */
export interface OApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: OApiParam[];
  requestBody?: OApiRequestBody;
  responses?: Record<
    string,
    { description?: string }
  >;
  security?: Record<string, string[]>[];
}

/** @brief HTTP methods as keys. */
export type HttpMethod =
  | 'get' | 'post' | 'put'
  | 'patch' | 'delete';

/** @brief Path item with operations. */
export type OApiPathItem =
  Partial<Record<HttpMethod, OApiOperation>>;

/** @brief Server definition. */
export interface OApiServer {
  url: string;
  description?: string;
}

/** @brief Top-level OpenAPI spec. */
export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: OApiServer[];
  paths: Record<string, OApiPathItem>;
  components?: {
    schemas?: Record<string, OApiSchema>;
    securitySchemes?: Record<
      string,
      Record<string, string>
    >;
  };
}

/** @brief Grouped endpoints by tag. */
export interface EndpointGroup {
  tag: string;
  endpoints: EndpointEntry[];
}

/** @brief Single endpoint entry. */
export interface EndpointEntry {
  path: string;
  method: HttpMethod;
  operation: OApiOperation;
}
