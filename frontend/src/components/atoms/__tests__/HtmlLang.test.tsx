import React from 'react';
import { render } from '@testing-library/react';
import { HtmlLang } from '../HtmlLang';

describe('HtmlLang', () => {
  afterEach(() => {
    document.documentElement.lang = '';
  });

  it('sets lang attribute on mount', () => {
    render(<HtmlLang locale="ja" />);
    expect(document.documentElement.lang).toBe('ja');
  });

  it('updates lang when locale changes', () => {
    const { rerender } = render(
      <HtmlLang locale="en" />,
    );
    expect(document.documentElement.lang).toBe('en');

    rerender(<HtmlLang locale="fr" />);
    expect(document.documentElement.lang).toBe('fr');
  });

  it('renders nothing visible', () => {
    const { container } = render(
      <HtmlLang locale="de" />,
    );
    expect(container.innerHTML).toBe('');
  });
});
