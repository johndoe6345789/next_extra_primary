const hide = jest.fn().mockResolvedValue(undefined);
const unhide = jest.fn().mockResolvedValue(undefined);
const clearFlags = jest.fn()
  .mockResolvedValue(undefined);

jest.mock('@/hooks/useModerate', () => ({
  useModerate: () => ({
    hide, unhide, clearFlags, busy: false,
  }),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModerationActions } from
  './ModerationActions';

describe('ModerationActions', () => {
  beforeEach(() => {
    hide.mockClear();
    unhide.mockClear();
    clearFlags.mockClear();
  });

  it('fires hide then onDone', async () => {
    const onDone = jest.fn();
    render(
      <ModerationActions
        commentId={5}
        onDone={onDone}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Hide' }),
    );
    expect(hide).toHaveBeenCalledWith(5);
    expect(onDone).toHaveBeenCalled();
  });

  it('fires unhide and clearFlags', async () => {
    const onDone = jest.fn();
    render(
      <ModerationActions
        commentId={9}
        onDone={onDone}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Unhide' }),
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Clear flags',
      }),
    );
    expect(unhide).toHaveBeenCalledWith(9);
    expect(clearFlags).toHaveBeenCalledWith(9);
  });
});
