import { render, screen, fireEvent } from
  '@testing-library/react';
import { Lightbox } from './Lightbox';

const items = [
  {
    gallery_id: 1, asset_id: 5,
    position: 0, caption: 'cap',
  },
];

describe('Lightbox', () => {
  it('renders nothing when index null', () => {
    const { container } = render(
      <Lightbox
        items={items}
        index={null}
        onClose={jest.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('closes on escape', () => {
    const cb = jest.fn();
    render(
      <Lightbox
        items={items}
        index={0}
        onClose={cb}
      />,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(cb).toHaveBeenCalled();
  });

  it('renders image alt from caption', () => {
    render(
      <Lightbox
        items={items}
        index={0}
        onClose={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('img', { name: 'cap' }),
    ).toBeInTheDocument();
  });
});
