/**
 * Table filter and search logic
 */

import type { Filter, FilterOperator } from
  './tableTypes';

/** Normalize value for case-insensitive cmp */
function normalize(
  val: unknown, sensitive: boolean
) {
  if (typeof val === 'string' && !sensitive)
    return val.toLowerCase();
  return val;
}

/** Apply a single filter operator */
function applyOp(
  fieldVal: unknown,
  op: FilterOperator,
  value: unknown,
  sensitive: boolean
): boolean {
  const nv = normalize(value, sensitive);
  const nf = normalize(fieldVal, sensitive);
  switch (op) {
    case 'eq': return nf === nv;
    case 'contains':
      return String(nf).includes(String(nv));
    case 'startsWith':
      return String(nf).startsWith(String(nv));
    case 'endsWith':
      return String(nf).endsWith(String(nv));
    case 'gt': return (fieldVal as number) >
      (value as number);
    case 'gte': return (fieldVal as number) >=
      (value as number);
    case 'lt': return (fieldVal as number) <
      (value as number);
    case 'lte': return (fieldVal as number) <=
      (value as number);
    case 'in': return Array.isArray(value) &&
      value.includes(nf);
    case 'nin': return !Array.isArray(value) ||
      !value.includes(nf);
    default: return true;
  }
}

/** Apply filters and search to items */
export function applyFiltersAndSearch<
  T extends Record<string, unknown>
>(
  items: T[],
  filters: Filter<T>[],
  search: string,
  searchFields: (keyof T)[]
): T[] {
  let result = [...items];
  for (const f of filters) {
    result = result.filter((item) => applyOp(
      item[f.field], f.operator,
      f.value, f.caseSensitive ?? false
    ));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((item) =>
      searchFields.some((field) =>
        String(item[field] || '')
          .toLowerCase().includes(q)));
  }
  return result;
}
