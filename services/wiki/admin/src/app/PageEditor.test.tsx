import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageEditor from './PageEditor';

const page = {
  id: 1, parentId: null, slug: 's',
  title: 'T', bodyMd: 'b', path: '/s',
  depth: 0, updatedAt: '',
};

describe('PageEditor', () => {
  it('shows empty state when no page', () => {
    render(
      <PageEditor page={null} onSave={jest.fn()} />,
    );
    expect(
      screen.getByText(/Select a page from the tree/),
    ).toBeTruthy();
  });

  it('calls onSave with updated values',
    async () => {
    const onSave = jest.fn().mockResolvedValue(
      undefined,
    );
    render(<PageEditor page={page} onSave={onSave} />);
    await userEvent.clear(
      screen.getByLabelText('Page title'),
    );
    await userEvent.type(
      screen.getByLabelText('Page title'),
      'New',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save page' }),
    );
    expect(onSave).toHaveBeenCalledWith('New', 'b');
  });
});
