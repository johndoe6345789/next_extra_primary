import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersTab from './OrdersTab';

const items = [
  {
    id: 1, user_id: 1, status: 'paid',
    total_cents: 100, currency: 'USD',
    stripe_pi: 'pi', lines: [],
  },
  {
    id: 2, user_id: 2, status: 'pending',
    total_cents: 200, currency: 'USD',
    stripe_pi: '', lines: [],
  },
];

describe('OrdersTab', () => {
  it('renders list and selects on click',
    async () => {
    render(<OrdersTab items={items} />);
    expect(screen.getByText('#1')).toBeTruthy();
    expect(screen.getByText('#2')).toBeTruthy();
    await userEvent.click(screen.getByText('#2'));
    expect(
      screen.getByLabelText('Order 2 detail'),
    ).toBeTruthy();
  });
});
