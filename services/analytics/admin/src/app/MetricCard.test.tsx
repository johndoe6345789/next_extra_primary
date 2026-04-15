import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetricCard } from './MetricCard';

const metric = {
  key: 'u', label: 'Users', icon: 'person',
  total: 1234, missing: false,
};

describe('MetricCard', () => {
  it('renders total and fires onSelect',
    async () => {
    const onSelect = jest.fn();
    render(
      <MetricCard
        metric={metric}
        selected={false}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText('1,234')).toBeTruthy();
    await userEvent.click(
      screen.getByLabelText('Users metric'),
    );
    expect(onSelect).toHaveBeenCalledWith('u');
  });

  it('shows em-dash when missing', () => {
    render(
      <MetricCard
        metric={{ ...metric, missing: true }}
        selected={true}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText('—')).toBeTruthy();
  });
});
