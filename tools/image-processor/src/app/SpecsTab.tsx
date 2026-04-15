'use client'

/**
 * SpecsTab — JSON editor for the default variant
 * specs served by the backend.
 */

import { useState, useEffect } from 'react'
import {
  Button, TextField, Typography,
} from '@shared/m3'
import { useSpecs, type SpecRow } from '@/hooks/useSpecs'

export function SpecsTab() {
  const { specs, save } = useSpecs()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(JSON.stringify(specs, null, 2))
  }, [specs])

  const onSave = async () => {
    try {
      const next = JSON.parse(draft) as SpecRow[]
      await save(next)
      setError('')
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'invalid JSON',
      )
    }
  }

  return (
    <section
      data-testid="specs-editor"
      aria-label="Default variant specs"
    >
      <Typography variant="subtitle1">
        Default variant specs
      </Typography>
      <TextField
        multiline
        minRows={12}
        value={draft}
        onChange={(e) =>
          setDraft(e.target.value)
        }
        inputProps={{
          'data-testid': 'specs-json',
          'aria-label': 'Specs JSON editor',
        }}
      />
      {error && (
        <Typography
          variant="body2"
          data-testid="specs-error"
        >
          {error}
        </Typography>
      )}
      <Button
        variant="filled"
        onClick={onSave}
        data-testid="specs-save"
      >
        Save
      </Button>
    </section>
  )
}
