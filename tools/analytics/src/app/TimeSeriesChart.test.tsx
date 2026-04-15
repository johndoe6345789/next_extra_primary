const useTimeSeries = jest.fn();
jest.mock('@/hooks/useTimeSeries', () => ({
  useTimeSeries: (...a: unknown[]) =>
    useTimeSeries(...a),
}));

import { render, screen } from
  '@testing-library/react';
import { TimeSeriesChart } from './TimeSeriesChart';

describe('TimeSeriesChart', () => {
  it('shows loading state when empty + loading',
    () => {
    useTimeSeries.mockReturnValue({
      points: [], loading: true, error: null,
    });
    render(
      <TimeSeriesChart metricKey="u" label="Users" />,
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders svg path when points present', () => {
    useTimeSeries.mockReturnValue({
      points: [
        { day: 'a', count: 1 },
        { day: 'b', count: 5 },
      ],
      loading: false,
      error: null,
    });
    render(
      <TimeSeriesChart metricKey="u" label="Users" />,
    );
    expect(
      screen.getByText(/Users — last 30 days/),
    ).toBeTruthy();
    expect(
      screen.getByRole('img', { name: 'chart' }),
    ).toBeTruthy();
  });
});
