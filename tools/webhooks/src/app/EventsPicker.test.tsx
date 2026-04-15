import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsPicker } from './EventsPicker';

describe('EventsPicker', () => {
  it('toggles events on click', async () => {
    const onToggle = jest.fn();
    render(
      <EventsPicker
        events={[
          { event_type: 'a', description: '' },
          { event_type: 'b', description: '' },
        ]}
        picked={['a']}
        onToggle={onToggle}
      />,
    );
    const boxes = screen.getAllByRole('checkbox');
    expect(
      (boxes[0] as HTMLInputElement).checked,
    ).toBe(true);
    await userEvent.click(boxes[1]);
    expect(onToggle).toHaveBeenCalledWith('b');
  });
});
