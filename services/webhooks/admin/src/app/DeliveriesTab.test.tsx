const useDeliveries = jest.fn();
jest.mock('@/hooks/useDeliveries', () => ({
  useDeliveries: (...a: unknown[]) =>
    useDeliveries(...a),
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveriesTab } from './DeliveriesTab';

describe('DeliveriesTab', () => {
  beforeEach(() => {
    useDeliveries.mockReturnValue({
      items: [{
        id: 1, endpoint_id: 1,
        event_type: 'x', status: 'dead',
        attempts: 3, next_retry_at: '',
        last_status_code: 500, last_error: '',
        delivered_at: '', created_at: '',
      }],
      refresh: jest.fn(),
    });
  });

  it('shows status filter and reacts to change',
    async () => {
    render(
      <DeliveriesTab onReplay={jest.fn()} />,
    );
    await userEvent.selectOptions(
      screen.getByLabelText('Filter status'),
      'dead',
    );
    expect(useDeliveries).toHaveBeenLastCalledWith(
      'dead',
    );
  });
});
