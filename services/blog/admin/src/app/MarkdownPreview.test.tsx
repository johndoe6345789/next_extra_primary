import { render, screen } from
  '@testing-library/react';
import { MarkdownPreview } from './MarkdownPreview';

describe('MarkdownPreview', () => {
  it('renders headings', () => {
    render(<MarkdownPreview source="# Hello" />);
    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toHaveTextContent('Hello');
  });

  it('renders list items', () => {
    render(<MarkdownPreview source="- one" />);
    expect(screen.getByRole('listitem')).toHaveTextContent(
      'one',
    );
  });

  it('renders paragraphs for plain lines', () => {
    render(<MarkdownPreview source="hi there" />);
    expect(
      screen.getByText('hi there'),
    ).toBeInTheDocument();
  });
});
