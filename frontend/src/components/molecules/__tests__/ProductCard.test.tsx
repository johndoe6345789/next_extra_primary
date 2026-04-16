import React from 'react';
import { render, screen, fireEvent }
  from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import type { Product } from '@/types/shop';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => <img alt={alt} src={src} />,
}));

jest.mock('@shared/m3/surfaces/Card', () => ({
  Card: ({
    children,
    ...p
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...p}>{children}</div>
  ),
}));

jest.mock(
  '@shared/m3/surfaces/CardContent',
  () => ({
    CardContent: ({
      children,
    }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }),
);

jest.mock('@shared/m3/Typography', () => ({
  Typography: ({
    children,
  }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

jest.mock('@shared/m3/Button', () => ({
  Button: ({
    children,
    onClick,
    ...p
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button onClick={onClick} {...p}>{children}</button>,
}));

const product: Product = {
  id: 'p1',
  slug: 'widget',
  name: 'Widget',
  description: 'A great widget.',
  price_cents: 999,
  price_display: '$9.99',
  image_url: '/img/widget.jpg',
  stock: 10,
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(
      <ProductCard
        product={product}
        onAddToCart={jest.fn()}
      />,
    );
    expect(
      screen.getByText('Widget'),
    ).toBeInTheDocument();
  });

  it('renders price', () => {
    render(
      <ProductCard
        product={product}
        onAddToCart={jest.fn()}
      />,
    );
    expect(
      screen.getByText('$9.99'),
    ).toBeInTheDocument();
  });

  it('calls onAddToCart with product id', () => {
    const onAddToCart = jest.fn();
    render(
      <ProductCard
        product={product}
        onAddToCart={onAddToCart}
        testId="pc"
      />,
    );
    fireEvent.click(screen.getByTestId('pc-add'));
    expect(onAddToCart).toHaveBeenCalledWith('p1');
  });
});
