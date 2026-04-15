import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageTree from './PageTree';

const nodes = [{
  id: 1, parentId: null, slug: 'a', title: 'A',
  path: '/a', depth: 0,
  children: [{
    id: 2, parentId: 1, slug: 'b', title: 'B',
    path: '/a/b', depth: 1, children: [],
  }],
}];

describe('PageTree', () => {
  it('fires onSelect with node id', async () => {
    const onSelect = jest.fn();
    render(
      <PageTree
        nodes={nodes}
        activeId={null}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Open B' }),
    );
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
