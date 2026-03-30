'use client';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UploadIcon
  from '@mui/icons-material/Upload';
import RefreshIcon
  from '@mui/icons-material/Refresh';
import labels from '@/constants/ui-labels.json';

/** @brief Props for ObjectToolbar molecule. */
export interface ObjectToolbarProps {
  prefix: string;
  onPrefixChange: (p: string) => void;
  onUploadClick: () => void;
  onRefresh: () => void;
}

/**
 * @brief Toolbar with prefix filter and actions.
 * @param props - ObjectToolbar properties.
 */
export default function ObjectToolbar({
  prefix,
  onPrefixChange,
  onUploadClick,
  onRefresh,
}: ObjectToolbarProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ mb: 2 }}
    >
      <TextField
        size="small"
        placeholder={labels.objects.filterPrefix}
        value={prefix}
        onChange={(e) =>
          onPrefixChange(e.target.value)}
        aria-label={labels.objects.filterPrefix}
        data-testid="prefix-filter"
      />
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        onClick={onUploadClick}
        aria-label={labels.objects.upload}
      >
        {labels.objects.upload}
      </Button>
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        aria-label={labels.objects.refresh}
      >
        {labels.objects.refresh}
      </Button>
    </Stack>
  );
}
