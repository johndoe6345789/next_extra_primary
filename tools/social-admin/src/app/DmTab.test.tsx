const useDms = jest.fn();
jest.mock('@/hooks/useDms', () => ({
  useDms: (...a: unknown[]) => useDms(...a),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DmTab } from './DmTab';

describe('DmTab', () => {
  beforeEach(() => {
    useDms.mockReturnValue({
      threads: [
        { id: 1, a: 'abcdefgh', b: 'zzzzzzzz', at: '' },
      ],
      messages: [],
      error: null,
    });
  });

  it('renders threads and opens selected one',
    async () => {
    render(<DmTab />);
    expect(screen.getByText(/Threads \(1\)/))
      .toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Open thread 1',
      }),
    );
    expect(
      screen.getByText(/Messages in #1/),
    ).toBeTruthy();
  });
});
