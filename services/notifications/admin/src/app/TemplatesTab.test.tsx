const save = jest.fn().mockResolvedValue(undefined);
const refresh = jest.fn();
jest.mock('@/hooks/useTemplates', () => ({
  useTemplates: () => ({
    items: [
      {
        key: 'welcome', channel: 'email',
        subject: 'hi', body: '',
      },
    ],
    save,
    refresh,
  }),
}));

jest.mock('./TemplateEditor', () => ({
  TemplateEditor: (p: {
    value: { key: string };
    onSave: (t: unknown) => void;
    onClose: () => void;
  }) => (
    <div>
      editor-{p.value.key}
      <button onClick={() => p.onSave(p.value)}>
        save
      </button>
    </div>
  ),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplatesTab } from './TemplatesTab';

describe('TemplatesTab', () => {
  it('opens editor on row click', async () => {
    render(<TemplatesTab />);
    await userEvent.click(
      screen.getByText('welcome'),
    );
    expect(
      screen.getByText('editor-welcome'),
    ).toBeInTheDocument();
  });

  it('opens blank editor via new', async () => {
    render(<TemplatesTab />);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'New template',
      }),
    );
    expect(
      screen.getByText(/editor-/),
    ).toBeInTheDocument();
  });
});
