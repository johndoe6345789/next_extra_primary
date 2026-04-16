import React from 'react';
import { render, screen, fireEvent }
  from '@testing-library/react';
import { PhotoLightbox } from '../PhotoLightbox';
import type { Photo } from '@/types/content';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));
jest.mock('@/constants/content.json', () => ({
  gallery: { variantLightbox: 'large', variantGrid: 'medium' },
}));
jest.mock('@shared/m3', () => ({
  Dialog: ({
    open, children,
  }: { open: boolean; children: React.ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({
    children,
  }: { children: React.ReactNode }) => <div>{children}</div>,
  Box: ({ children }: React.PropsWithChildren) =>
    <div>{children}</div>,
  Typography: ({ children }: React.PropsWithChildren) =>
    <span>{children}</span>,
  IconButton: ({
    children, onClick, disabled,
    'aria-label': a, 'data-testid': tid,
  }: {
    children: React.ReactNode; onClick?: () => void;
    disabled?: boolean; 'aria-label'?: string;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} disabled={disabled}
      aria-label={a} data-testid={tid}>
      {children}
    </button>
  ),
}));

const PHOTOS: Photo[] = [
  {
    id: 'a', albumId: 'al1',
    variants: { large: '/a.jpg' }, caption: 'Alpha',
  },
  {
    id: 'b', albumId: 'al1',
    variants: { large: '/b.jpg' }, caption: 'Beta',
  },
];

describe('PhotoLightbox navigation', () => {
  it('calls onChangeIndex when next is clicked', () => {
    const onChange = jest.fn();
    render(
      <PhotoLightbox photos={PHOTOS} index={0}
        onChangeIndex={onChange} onClose={jest.fn()} />,
    );
    fireEvent.click(screen.getByTestId('lightbox-next'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables prev at first photo', () => {
    render(
      <PhotoLightbox photos={PHOTOS} index={0}
        onChangeIndex={jest.fn()} onClose={jest.fn()} />,
    );
    expect(
      screen.getByTestId('lightbox-prev'),
    ).toBeDisabled();
  });

  it('does not render when index is -1', () => {
    render(
      <PhotoLightbox photos={PHOTOS} index={-1}
        onChangeIndex={jest.fn()} onClose={jest.fn()} />,
    );
    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument();
  });
});
