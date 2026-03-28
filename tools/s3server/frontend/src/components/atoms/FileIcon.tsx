'use client';

import InsertDriveFileIcon
  from '@mui/icons-material/InsertDriveFile';
import ImageIcon
  from '@mui/icons-material/Image';
import CodeIcon
  from '@mui/icons-material/Code';
import ArchiveIcon
  from '@mui/icons-material/Archive';
import DescriptionIcon
  from '@mui/icons-material/Description';

/** @brief Props for FileIcon atom. */
export interface FileIconProps {
  /** Filename to infer icon from. */
  filename: string;
  /** Test ID for automation. */
  testId?: string;
}

const IMAGE_EXT = /\.(png|jpg|jpeg|gif|svg|webp)$/i;
const CODE_EXT = /\.(ts|tsx|js|json|cpp|h|py|rs)$/i;
const ARCHIVE_EXT = /\.(zip|tar|gz|bz2|7z|rar)$/i;
const DOC_EXT = /\.(pdf|doc|docx|txt|md|csv)$/i;

/**
 * @brief Icon matching file extension type.
 * @param props - FileIcon properties.
 */
export default function FileIcon({
  filename,
  testId = 'file-icon',
}: FileIconProps) {
  const sx = { fontSize: 20, color: 'text.secondary' };
  const props = {
    'data-testid': testId,
    'aria-label': `File type for ${filename}`,
    sx,
  };

  if (IMAGE_EXT.test(filename))
    return <ImageIcon {...props} />;
  if (CODE_EXT.test(filename))
    return <CodeIcon {...props} />;
  if (ARCHIVE_EXT.test(filename))
    return <ArchiveIcon {...props} />;
  if (DOC_EXT.test(filename))
    return <DescriptionIcon {...props} />;
  return <InsertDriveFileIcon {...props} />;
}
