import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsTab from './ProductsTab';

const items = [
  {
    id: 1, sku: 'A', name: 'Alpha',
    description: '', price_cents: 100,
    currency: 'USD', stock: 5, active: true,
  },
];

describe('ProductsTab', () => {
  it('renders rows and opens editor on New',
    async () => {
    const reload = jest.fn();
    render(
      <ProductsTab items={items} reload={reload} />,
    );
    expect(screen.getByText('Alpha')).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', {
        name: 'New product',
      }),
    );
    expect(
      screen.getByRole('dialog', {
        name: 'Edit product',
      }),
    ).toBeTruthy();
  });

  it('opens editor for existing row', async () => {
    render(
      <ProductsTab items={items} reload={jest.fn()} />,
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Edit Alpha',
      }),
    );
    expect(
      screen.getByRole('dialog', {
        name: 'Edit product',
      }),
    ).toBeTruthy();
  });
});
