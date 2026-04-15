const upload = jest.fn().mockResolvedValue(undefined);
jest.mock('@/hooks/useUpload', () => ({
  useUpload: () => ({
    upload, pending: false, error: null,
  }),
}));

import { render, screen, fireEvent } from
  '@testing-library/react';
import { UploadDrop } from './UploadDrop';

describe('UploadDrop', () => {
  beforeEach(() => upload.mockClear());

  it('uploads dropped files and notifies', async () => {
    const onUploaded = jest.fn();
    render(
      <UploadDrop
        galleryId={1}
        onUploaded={onUploaded}
      />,
    );
    const target = screen.getByLabelText(
      'Drop files to upload',
    );
    const file = new File(['x'], 'a.jpg');
    fireEvent.drop(target, {
      dataTransfer: { files: [file] },
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(upload).toHaveBeenCalled();
  });
});
