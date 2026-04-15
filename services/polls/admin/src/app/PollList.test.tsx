import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PollList } from './PollList';

const p = {
  id: 1, tenant_id: 't', creator_id: 'c',
  question: 'Fav?', kind: 'single' as const,
  opens_at: '', closes_at: 'soon',
  public: true, options: [],
};

describe('PollList', () => {
  it('shows empty state', () => {
    render(
      <PollList
        rows={[]}
        selected={null}
        onSelect={jest.fn()}
      />,
    );
    expect(
      screen.getByLabelText('No polls'),
    ).toBeInTheDocument();
  });

  it('selects a poll by click', async () => {
    const cb = jest.fn();
    render(
      <PollList
        rows={[p]}
        selected={null}
        onSelect={cb}
      />,
    );
    await userEvent.click(
      screen.getByText('Fav?'),
    );
    expect(cb).toHaveBeenCalledWith(1);
  });
});
