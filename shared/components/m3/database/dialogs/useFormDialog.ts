'use client';

import { useEffect, useState } from 'react';

/**
 * State hook for the FormDialog.
 * @param initialData - Pre-filled form values.
 * @param open - Whether dialog is open.
 * @returns Form state and handlers.
 */
export function useFormDialog(
  initialData: Record<string, unknown> | undefined,
  open: boolean
) {
  const [formData, setFormData] =
    useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData ?? {});
  }, [initialData, open]);

  /** Update a single form field. */
  const handleChange = (
    fieldName: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return {
    formData, setFormData,
    loading, setLoading,
    handleChange,
  };
}
