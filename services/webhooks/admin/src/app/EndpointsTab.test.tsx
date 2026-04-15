import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndpointsTab } from './EndpointsTab';

describe('EndpointsTab', () => {
  it('renders rows, fires onNew and onDelete',
    async () => {
    const onNew = jest.fn();
    const onDelete = jest.fn();
    render(
      <EndpointsTab
        items={[{
          id: 1, url: 'http://x', events: 'a',
          active: true, failure_streak: 0,
          created_at: '',
        }]}
        onNew={onNew}
        onDelete={onDelete}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: '+ New endpoint',
      }),
    );
    expect(onNew).toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete 1' }),
    );
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
