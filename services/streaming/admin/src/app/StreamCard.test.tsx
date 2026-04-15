import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StreamCard } from './StreamCard';

const row = {
  id: 7, slug: 's', title: 'Title',
  ingest_key: 'key', status: 'live',
  started_at: '', ended_at: '', recording: '',
};

describe('StreamCard', () => {
  it('fires action callbacks with row id',
    async () => {
    const block = jest.fn();
    const kick = jest.fn();
    const remove = jest.fn();
    render(
      <StreamCard
        row={row}
        onBlock={block}
        onKick={kick}
        onRemove={remove}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Kick publisher',
      }),
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Block stream',
      }),
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Delete stream',
      }),
    );
    expect(kick).toHaveBeenCalledWith(7);
    expect(block).toHaveBeenCalledWith(7);
    expect(remove).toHaveBeenCalledWith(7);
  });
});
