jest.mock('./ModerationActions', () => ({
  ModerationActions: (p: { commentId: number }) =>
    <div data-testid={`mod-${p.commentId}`} />,
}));

import { render, screen } from
  '@testing-library/react';
import { ThreadView } from './ThreadView';

describe('ThreadView', () => {
  it('renders header and mod actions', () => {
    render(
      <ThreadView commentId={11} onChange={jest.fn()} />,
    );
    expect(
      screen.getByText(/#11/),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('mod-11'),
    ).toBeInTheDocument();
  });
});
