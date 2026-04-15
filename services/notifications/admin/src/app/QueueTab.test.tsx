const retry = jest.fn();
jest.mock('@/hooks/useNotifQueue', () => ({
  useNotifQueue: () => ({
    items: [
      {
        id: 1, user_id: 'u', channel: 'email',
        template: 't', status: 'failed',
        attempts: 2, sent_at: '', error: 'e',
        created_at: '',
      },
    ],
    retry,
    refresh: jest.fn(),
  }),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueueTab } from './QueueTab';

describe('QueueTab', () => {
  it('retries failed row', async () => {
    render(<QueueTab />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Retry' }),
    );
    expect(retry).toHaveBeenCalledWith(1);
  });
});
