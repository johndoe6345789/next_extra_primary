import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveriesTable } from './DeliveriesTable';

const rows = [{
  id: 42, endpoint_id: 1, event_type: 'x',
  status: 'dead', attempts: 3, next_retry_at: '',
  last_status_code: 500, last_error: '',
  delivered_at: '', created_at: '',
}];

describe('DeliveriesTable', () => {
  it('renders rows and fires replay', async () => {
    const onSelect = jest.fn();
    const onReplay = jest.fn().mockResolvedValue(true);
    render(
      <DeliveriesTable
        items={rows}
        onSelect={onSelect}
        onReplay={onReplay}
      />,
    );
    expect(screen.getByText('42')).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: 'Replay 42' }),
    );
    expect(onReplay).toHaveBeenCalledWith(42);
  });
});
