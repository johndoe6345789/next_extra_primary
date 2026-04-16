import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => false,
}));

jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: [],
    itemCount: 0,
    updateItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

jest.mock('@/hooks/useCheckout', () => ({
  useCheckout: () => ({
    startCheckout: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/hooks/useScrollLock', () => ({
  useScrollLock: jest.fn(),
}));

jest.mock('@/store/slices/cartSlice', () => ({
  closeCart: () => ({ type: 'cart/closeCart' }),
}));

jest.mock(
  '@shared/m3/surfaces/Drawer',
  () => ({
    Drawer: ({
      children,
      open,
      testId,
    }: {
      children: React.ReactNode;
      open?: boolean;
      testId?: string;
    }) =>
      open
        ? <div data-testid={testId}>{children}</div>
        : null,
  }),
);

describe('CartDrawer', () => {
  it('renders nothing when closed', () => {
    render(<CartDrawer />);
    expect(
      screen.queryByTestId('cart-drawer'),
    ).toBeNull();
  });
});
