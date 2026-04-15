import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@shared/m3', () => ({
  M3Dialog: (p: { children: React.ReactNode }) => (
    <div role="dialog">{p.children}</div>
  ),
  M3Button: (p: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={p.onClick}>{p.children}</button>
  ),
  M3TextField: (p: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <label>
      {p.label}
      <input
        value={p.value}
        onChange={e => p.onChange(e.target.value)}
      />
    </label>
  ),
}));

import { ScheduleDialog } from './ScheduleDialog';

describe('ScheduleDialog', () => {
  it('confirms with typed value', async () => {
    const cb = jest.fn();
    render(
      <ScheduleDialog
        onCancel={jest.fn()}
        onConfirm={cb}
      />,
    );
    await userEvent.type(
      screen.getByLabelText(/Publish at/),
      '2030-01-01',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Schedule' }),
    );
    expect(cb).toHaveBeenCalledWith('2030-01-01');
  });

  it('cancels', async () => {
    const cb = jest.fn();
    render(
      <ScheduleDialog
        onCancel={cb}
        onConfirm={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Cancel' }),
    );
    expect(cb).toHaveBeenCalled();
  });
});
