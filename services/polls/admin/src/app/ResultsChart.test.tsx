import { render, screen } from
  '@testing-library/react';
import { ResultsChart } from './ResultsChart';

describe('ResultsChart', () => {
  it('shows empty state', () => {
    render(<ResultsChart tally={null} />);
    expect(
      screen.getByLabelText('No poll selected'),
    ).toBeInTheDocument();
  });

  it('renders bar per option', () => {
    render(
      <ResultsChart
        tally={{
          poll_id: 9, kind: 'single',
          total_votes: 3,
          items: [
            {
              option_id: 1, label: 'A',
              score: 2, vote_count: 2,
            },
            {
              option_id: 2, label: 'B',
              score: 1, vote_count: 1,
            },
          ],
        }}
      />,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(
      screen.getByText(/3 vote/),
    ).toBeInTheDocument();
  });
});
