import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlbumGrid } from './AlbumGrid';

const g = {
  id: 2, slug: 's', title: 'Trip',
  description: '', cover_asset_id: null,
  item_count: 5,
  created_at: '', updated_at: '',
};

describe('AlbumGrid', () => {
  it('shows empty text', () => {
    render(
      <AlbumGrid
        galleries={[]}
        onOpen={jest.fn()}
      />,
    );
    expect(
      screen.getByText(/No galleries yet/),
    ).toBeInTheDocument();
  });

  it('fires onOpen when card clicked', async () => {
    const cb = jest.fn();
    render(
      <AlbumGrid galleries={[g]} onOpen={cb} />,
    );
    await userEvent.click(
      screen.getByLabelText('Open Trip'),
    );
    expect(cb).toHaveBeenCalledWith(2);
  });
});
