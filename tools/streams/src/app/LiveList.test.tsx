import { render, screen } from
  '@testing-library/react';
import { LiveList } from './LiveList';

const row = {
  id: 1, slug: 's', title: 'T',
  ingest_key: 'k', status: 'live',
  started_at: '', ended_at: '', recording: '',
};

describe('LiveList', () => {
  const noop = () => undefined;
  it('renders empty state', () => {
    render(
      <LiveList
        rows={[]}
        onBlock={noop}
        onKick={noop}
        onRemove={noop}
      />,
    );
    expect(
      screen.getByText(/No streams yet/),
    ).toBeTruthy();
  });

  it('renders rows', () => {
    render(
      <LiveList
        rows={[row]}
        onBlock={noop}
        onKick={noop}
        onRemove={noop}
      />,
    );
    expect(screen.getByText('T')).toBeTruthy();
  });
});
