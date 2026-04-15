import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlaggedList } from './FlaggedList';

const c = {
  id: 7, target_type: 'post',
  target_id: '1', author_id: 'u',
  body: 'hello', flag_count: 3,
  created_at: 'now',
};

describe('FlaggedList', () => {
  it('shows empty state', () => {
    render(
      <FlaggedList
        items={[]}
        selectedId={null}
        onSelect={jest.fn()}
      />,
    );
    expect(
      screen.getByText(/Nothing flagged/),
    ).toBeInTheDocument();
  });

  it('renders comment and fires select', async () => {
    const cb = jest.fn();
    render(
      <FlaggedList
        items={[c]}
        selectedId={null}
        onSelect={cb}
      />,
    );
    expect(
      screen.getByText('hello'),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByTestId('flagged-7'),
    );
    expect(cb).toHaveBeenCalledWith(7);
  });
});
