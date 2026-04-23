'use client'

/**
 * PollEditor — create-new-poll form.
 * Uses M3 TextField / Select / Button from
 * the shared library.  State lives locally;
 * submission is delegated via the onCreate
 * callback so the form stays presentational.
 */

import { useState } from 'react'
import { Button, TextField, Select, MenuItem } from '@shared/m3'
import type {
  PollKind,
} from '@/hooks/usePolls'
import type {
  CreatePollInput,
} from '@/hooks/usePollActions'

export interface PollEditorProps {
  onCreate: (
    input: CreatePollInput,
  ) => Promise<boolean>
}

const KINDS: PollKind[] = [
  'single', 'multi', 'rank', 'approval',
]

export function PollEditor({
  onCreate,
}: PollEditorProps) {
  const [question, setQuestion] = useState('')
  const [kind, setKind] =
    useState<PollKind>('single')
  const [options, setOptions] = useState('')
  const [closesAt, setClosesAt] = useState('')

  async function submit() {
    const labels = options
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
    const ok = await onCreate({
      question,
      kind,
      options: labels,
      closes_at: closesAt,
      tenant_id: '',
    })
    if (ok) {
      setQuestion('')
      setOptions('')
      setClosesAt('')
    }
  }

  return (
    <form
      className="polls-card"
      data-testid="poll-editor"
      aria-label="Create poll"
      onSubmit={e => {
        e.preventDefault()
        submit()
      }}
    >
      <TextField
        label="Question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      <Select
        value={kind}
        onChange={v => setKind(v.target.value as PollKind)}
      >
        {KINDS.map(k => (
          <MenuItem key={k} value={k}>{k}</MenuItem>
        ))}
      </Select>
      <TextField
        label="Options (one per line)"
        multiline
        value={options}
        onChange={e => setOptions(e.target.value)}
      />
      <TextField
        label="Closes at (ISO)"
        value={closesAt}
        onChange={e => setClosesAt(e.target.value)}
      />
      <Button type="submit" variant="filled">
        Create poll
      </Button>
    </form>
  )
}
