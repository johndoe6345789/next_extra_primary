import { render, screen, fireEvent } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PollEditor } from './PollEditor';

describe('PollEditor', () => {
  it('submits parsed option lines', async () => {
    const onCreate = jest.fn().mockResolvedValue(true);
    render(<PollEditor onCreate={onCreate} />);
    fireEvent.change(
      screen.getByLabelText('Question'),
      { target: { value: 'Fav?' } },
    );
    fireEvent.change(
      screen.getByLabelText(/Options/),
      { target: { value: 'a\nb\n' } },
    );
    fireEvent.change(
      screen.getByLabelText(/Closes at/),
      { target: { value: '2030' } },
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Create poll',
      }),
    );
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        question: 'Fav?',
        options: ['a', 'b'],
        closes_at: '2030',
      }),
    );
  });
});
