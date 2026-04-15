import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactionsTab } from './ReactionsTab';

describe('ReactionsTab', () => {
  let fm: jest.Mock<Promise<Response>>;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({
        summary: [{ emoji: '👍', count: 3 }],
      }),
    } as Response);
    global.fetch = fm as unknown as typeof fetch;
  });

  it('fetches and renders counts on Load',
    async () => {
    render(<ReactionsTab />);
    await userEvent.type(
      screen.getByLabelText('Reaction target id'),
      '42',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Load' }),
    );
    expect(String(fm.mock.calls[0][0])).toContain(
      'target_type=comment',
    );
    expect(String(fm.mock.calls[0][0])).toContain(
      'target_id=42',
    );
    expect(
      await screen.findByText('👍: 3'),
    ).toBeTruthy();
  });
});
