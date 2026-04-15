import { render, screen } from
  '@testing-library/react';
import { IngestInstructions } from
  './IngestInstructions';

describe('IngestInstructions', () => {
  it('renders ffmpeg cheat sheet', () => {
    render(<IngestInstructions />);
    expect(
      screen.getByLabelText('Ingest instructions'),
    ).toBeTruthy();
    expect(
      screen.getByText(/ffmpeg -re -i input\.mp4/),
    ).toBeTruthy();
  });
});
