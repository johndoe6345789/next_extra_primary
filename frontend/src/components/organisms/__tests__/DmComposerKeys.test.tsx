import React from 'react';
import { render, screen, fireEvent }
  from '@testing-library/react';
import { DmComposer } from '../DmComposer';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
jest.mock('@shared/m3', () => ({
  Box: ({
    children, component, ...rest
  }: {
    children?: React.ReactNode; component?: string;
    [key: string]: unknown;
  }) => {
    const Tag =
      (component ?? 'div') as keyof JSX.IntrinsicElements;
    return <Tag {...rest}>{children}</Tag>;
  },
}));
jest.mock('@shared/m3/Button', () => ({
  Button: ({
    children, onClick, disabled,
    'aria-label': ariaLabel, testId,
  }: {
    children: React.ReactNode; onClick?: () => void;
    disabled?: boolean; 'aria-label'?: string;
    testId?: string;
  }) => (
    <button aria-label={ariaLabel} data-testid={testId}
      disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));
jest.mock('../../atoms', () => ({
  TextField: ({
    label, value, onChange, testId, disabled,
  }: {
    label: string; value: string;
    onChange: React.ChangeEventHandler;
    testId?: string; disabled?: boolean;
  }) => (
    <input aria-label={label} value={value}
      onChange={onChange} data-testid={testId}
      disabled={disabled} />
  ),
}));

describe('DmComposer keyboard/submit', () => {
  it('send button is disabled when input is empty', () => {
    render(<DmComposer onSend={jest.fn()} />);
    expect(
      screen.getByTestId('dm-composer-send'),
    ).toBeDisabled();
  });

  it('calls onSend with input value', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    render(<DmComposer onSend={onSend} />);
    fireEvent.change(
      screen.getByTestId('dm-composer-input'),
      { target: { value: 'hello' } },
    );
    fireEvent.click(
      screen.getByTestId('dm-composer-send'),
    );
    await Promise.resolve();
    expect(onSend).toHaveBeenCalledWith('hello');
  });
});
