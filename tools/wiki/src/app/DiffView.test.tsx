import { render, screen } from
  '@testing-library/react';
import DiffView from './DiffView';

describe('DiffView', () => {
  it('shows empty prompt when no diff', () => {
    render(<DiffView diff={[]} />);
    expect(
      screen.getByText(/Pick two revisions/),
    ).toBeTruthy();
  });

  it('renders diff ops', () => {
    render(
      <DiffView
        diff={[
          { op: '+', line: 'added' },
          { op: '-', line: 'gone' },
        ]}
      />,
    );
    expect(screen.getByText(/\+ added/)).toBeTruthy();
    expect(screen.getByText(/- gone/)).toBeTruthy();
  });
});
