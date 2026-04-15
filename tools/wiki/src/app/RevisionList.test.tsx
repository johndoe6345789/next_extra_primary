import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RevisionList from './RevisionList';

const revs = [
  { pageId: 1, rev: 1, title: '', at: 't1',
    authorId: '' },
  { pageId: 1, rev: 2, title: '', at: 't2',
    authorId: '' },
];

describe('RevisionList', () => {
  it('calls onDiff after two picks', async () => {
    const onDiff = jest.fn();
    render(
      <RevisionList
        revisions={revs}
        onDiff={onDiff}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Rev 2' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Rev 1' }),
    );
    expect(onDiff).toHaveBeenCalledWith(1, 2);
  });
});
