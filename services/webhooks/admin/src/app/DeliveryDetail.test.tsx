import { render, screen } from
  '@testing-library/react';
import { DeliveryDetail } from './DeliveryDetail';

describe('DeliveryDetail', () => {
  it('renders fields and em-dashes blanks', () => {
    render(
      <DeliveryDetail
        row={{
          id: 3, endpoint_id: 2, event_type: 'e',
          status: 'dead', attempts: 5,
          next_retry_at: '2026-01-01',
          last_status_code: 500,
          last_error: '',
          delivered_at: '', created_at: '',
        }}
      />,
    );
    expect(
      screen.getByText('Delivery #3'),
    ).toBeTruthy();
    expect(screen.getByText('dead')).toBeTruthy();
    expect(screen.getAllByText('—').length)
      .toBeGreaterThan(0);
  });
});
