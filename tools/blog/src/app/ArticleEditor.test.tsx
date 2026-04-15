import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@shared/m3', () => ({
  M3Button: (p: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={p.onClick}>{p.children}</button>
  ),
  M3TextField: (p: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <label>
      {p.label}
      <input
        value={p.value}
        onChange={e => p.onChange(e.target.value)}
      />
    </label>
  ),
  M3TextArea: (p: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <label>
      {p.label}
      <textarea
        value={p.value}
        onChange={e => p.onChange(e.target.value)}
      />
    </label>
  ),
}));

jest.mock('./MarkdownPreview', () => ({
  MarkdownPreview: () => <div data-testid="mp" />,
}));
jest.mock('./ScheduleDialog', () => ({
  ScheduleDialog: () => <div role="dialog" />,
}));

import { ArticleEditor } from './ArticleEditor';

const a = {
  id: 1, tenant_id: 't', author_id: 'u',
  slug: 's', title: 'T', body_md: '',
  body_html: '', hero_image: '',
  status: 'draft', published_at: '',
  scheduled_at: '', created_at: '',
  updated_at: '',
};

describe('ArticleEditor', () => {
  it('shows empty state with null', () => {
    render(
      <ArticleEditor
        article={null}
        onSave={jest.fn()}
        onPublish={jest.fn()}
        onSchedule={jest.fn()}
      />,
    );
    expect(
      screen.getByLabelText('No article selected'),
    ).toBeInTheDocument();
  });

  it('calls onSave with edited draft', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    render(
      <ArticleEditor
        article={a}
        onSave={onSave}
        onPublish={jest.fn()}
        onSchedule={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save draft' }),
    );
    expect(onSave).toHaveBeenCalled();
  });
});
