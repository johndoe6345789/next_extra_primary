import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetricGrid } from './MetricGrid';

const metrics = [
  {
    key: 'a', label: 'A', icon: '', total: 1,
    missing: false,
  },
  {
    key: 'b', label: 'B', icon: '', total: 2,
    missing: false,
  },
];

describe('MetricGrid', () => {
  it('renders a card per metric', () => {
    render(
      <MetricGrid
        metrics={metrics}
        selectedKey="a"
        onSelect={jest.fn()}
      />,
    );
    expect(
      screen.getByLabelText('A metric'),
    ).toBeTruthy();
    expect(
      screen.getByLabelText('B metric'),
    ).toBeTruthy();
  });

  it('bubbles up selection', async () => {
    const onSelect = jest.fn();
    render(
      <MetricGrid
        metrics={metrics}
        selectedKey="a"
        onSelect={onSelect}
      />,
    );
    await userEvent.click(
      screen.getByLabelText('B metric'),
    );
    expect(onSelect).toHaveBeenCalledWith('b');
  });
});
