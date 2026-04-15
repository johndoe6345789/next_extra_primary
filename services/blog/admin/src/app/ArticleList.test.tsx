import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@shared/m3', () => ({
  M3Button: (p: {
    children: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <button
      onClick={p.onClick}
      aria-label={p['aria-label']}
    >
      {p.children}
    </button>
  ),
  M3List: (p: { children: React.ReactNode }) => (
    <ul>{p.children}</ul>
  ),
  M3ListItem: (p: {
    children: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <li>
      <button
        onClick={p.onClick}
        aria-label={p['aria-label']}
      >
        {p.children}
      </button>
    </li>
  ),
}));

import { ArticleList } from './ArticleList';

const a = {
  id: 1, tenant_id: 't', author_id: 'u',
  slug: 's', title: 'Hi', body_md: '',
  body_html: '', hero_image: '',
  status: 'draft', published_at: '',
  scheduled_at: '', created_at: '',
  updated_at: '',
};

describe('ArticleList', () => {
  it('selects a row', async () => {
    const cb = jest.fn();
    render(
      <ArticleList
        rows={[a]}
        activeId={null}
        onSelect={cb}
        onCreate={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByLabelText('Open Hi'),
    );
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('fires onCreate', async () => {
    const cb = jest.fn();
    render(
      <ArticleList
        rows={[]}
        activeId={null}
        onSelect={jest.fn()}
        onCreate={cb}
      />,
    );
    await userEvent.click(
      screen.getByLabelText('Create new draft'),
    );
    expect(cb).toHaveBeenCalled();
  });
});
