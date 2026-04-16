import React from 'react';
import { render, screen, fireEvent }
  from '@testing-library/react';
import { CartButton } from '../CartButton';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => false,
}));

jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({ itemCount: 3 }),
}));

jest.mock('@/store/slices/cartSlice', () => ({
  openCart: () => ({ type: 'cart/openCart' }),
}));

jest.mock('../../atoms/IconButton', () => ({
  IconButton: ({
    ariaLabel,
    onClick,
    testId,
  }: {
    ariaLabel: string;
    onClick?: () => void;
    testId?: string;
  }) => (
    <button
      aria-label={ariaLabel}
      data-testid={testId}
      onClick={onClick}
    />
  ),
}));

jest.mock(
  '@shared/icons/react/m3/ShoppingCart',
  () => ({
    __esModule: true,
    default: () => <svg data-testid="cart-icon" />,
  }),
);

jest.mock('../NotificationBadge', () => ({
  __esModule: true,
  default: ({ count }: { count: number }) => (
    <span data-testid="cart-badge">{count}</span>
  ),
}));

describe('CartButton', () => {
  beforeEach(() => mockDispatch.mockClear());

  it('renders with testid', () => {
    render(<CartButton />);
    expect(
      screen.getByTestId('cart-button'),
    ).toBeInTheDocument();
  });

  it('shows badge when itemCount > 0', () => {
    render(<CartButton />);
    expect(
      screen.getByTestId('cart-badge'),
    ).toHaveTextContent('3');
  });

  it('dispatches openCart on click', () => {
    render(<CartButton />);
    fireEvent.click(
      screen.getByTestId('cart-button-icon'),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      { type: 'cart/openCart' },
    );
  });
});
