jest.mock('@/hooks/useAlbum', () => ({
  useAlbum: () => ({
    items: [
      {
        gallery_id: 1, asset_id: 7,
        position: 0, caption: '',
      },
    ],
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));
jest.mock('./UploadDrop', () => ({
  UploadDrop: () => <div data-testid="drop" />,
}));
jest.mock('./Lightbox', () => ({
  Lightbox: (p: { index: number | null }) =>
    p.index !== null ? (
      <div data-testid="lb" />
    ) : null,
}));

import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlbumDetail } from './AlbumDetail';

describe('AlbumDetail', () => {
  it('goes back when button clicked', async () => {
    const cb = jest.fn();
    render(
      <AlbumDetail galleryId={3} onBack={cb} />,
    );
    await userEvent.click(
      screen.getByLabelText('Back to gallery list'),
    );
    expect(cb).toHaveBeenCalled();
  });

  it('opens lightbox on item click', async () => {
    render(
      <AlbumDetail
        galleryId={3}
        onBack={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByLabelText('Open photo 7'),
    );
    expect(
      screen.getByTestId('lb'),
    ).toBeInTheDocument();
  });
});
