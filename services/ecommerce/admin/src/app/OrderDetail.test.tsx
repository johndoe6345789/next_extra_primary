import { render, screen } from
  '@testing-library/react';
import OrderDetail from './OrderDetail';

const order = {
  id: 7,
  user_id: 42,
  status: 'paid',
  total_cents: 12_50,
  currency: 'USD',
  stripe_pi: 'pi_abc',
  lines: [
    { product_id: 3, qty: 2, price_cents: 625 },
  ],
};

describe('OrderDetail', () => {
  it('renders order metadata and lines', () => {
    render(<OrderDetail order={order} />);
    expect(screen.getByText('Order #7')).toBeTruthy();
    expect(screen.getByText('paid')).toBeTruthy();
    expect(screen.getByText('pi_abc')).toBeTruthy();
    expect(
      screen.getByText(/Product 3 × 2/),
    ).toBeTruthy();
  });

  it('shows em-dash when no Stripe PI', () => {
    render(
      <OrderDetail
        order={{ ...order, stripe_pi: '' }}
      />,
    );
    expect(screen.getByText('—')).toBeTruthy();
  });
});
