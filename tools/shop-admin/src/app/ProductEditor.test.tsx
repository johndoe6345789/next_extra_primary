import { render, screen } from
  '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductEditor from './ProductEditor';

const blank = {
  id: 0, sku: '', name: '', description: '',
  price_cents: 0, currency: 'USD', stock: 0,
  active: true,
};

describe('ProductEditor', () => {
  let fm: jest.Mock<Promise<Response>>;
  beforeEach(() => {
    fm = jest.fn().mockResolvedValue(
      { ok: true, status: 200 } as Response,
    );
    global.fetch = fm as unknown as typeof fetch;
  });

  it('POSTs new products', async () => {
    const onClose = jest.fn();
    render(
      <ProductEditor value={blank} onClose={onClose} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save' }),
    );
    const [url, init] = fm.mock.calls[0];
    expect(url).toBe('/api/shop/products');
    expect((init as RequestInit).method).toBe('POST');
    expect(onClose).toHaveBeenCalled();
  });

  it('PUTs existing product', async () => {
    const onClose = jest.fn();
    render(
      <ProductEditor
        value={{ ...blank, id: 9 }}
        onClose={onClose}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Save' }),
    );
    expect(
      String(fm.mock.calls[0][0]),
    ).toContain('/api/shop/products/9');
    expect(
      (fm.mock.calls[0][1] as RequestInit).method,
    ).toBe('PUT');
  });
});
