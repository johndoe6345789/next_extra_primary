import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndpointEditor } from './EndpointEditor';

describe('EndpointEditor', () => {
  it('calls onSave with form values', async () => {
    const onSave = jest.fn().mockResolvedValue(
      undefined,
    );
    render(
      <EndpointEditor
        events={[{
          event_type: 'user.created',
          description: '',
        }]}
        onSave={onSave}
        onCancel={jest.fn()}
      />,
    );
    await userEvent.type(
      screen.getByLabelText('Target URL'),
      'http://x',
    );
    await userEvent.type(
      screen.getByLabelText('Shared secret'),
      'sss',
    );
    await userEvent.click(
      screen.getByRole('checkbox'),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save' }),
    );
    expect(onSave).toHaveBeenCalledWith({
      url: 'http://x',
      secret: 'sss',
      events: ['user.created'],
      active: true,
    });
  });
});
