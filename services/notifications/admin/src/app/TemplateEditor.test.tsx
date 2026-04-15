import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateEditor } from './TemplateEditor';

const value = {
  key: 'welcome', channel: 'email',
  subject: 'hi', body: 'body',
};

describe('TemplateEditor', () => {
  it('fires onSave with form value', async () => {
    const onSave = jest.fn();
    render(
      <TemplateEditor
        value={value}
        onSave={onSave}
        onClose={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save' }),
    );
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'welcome' }),
    );
  });

  it('fires onClose on cancel', async () => {
    const onClose = jest.fn();
    render(
      <TemplateEditor
        value={value}
        onSave={jest.fn()}
        onClose={onClose}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Cancel' }),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
