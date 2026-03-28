'use client';

import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer
  from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UploadIcon
  from '@mui/icons-material/Upload';
import RefreshIcon
  from '@mui/icons-material/Refresh';
import type { S3Object } from '@/types';
import {
  ObjectRow,
  UploadDialog,
  ConfirmDialog,
} from '../molecules';
import labels from '@/constants/ui-labels.json';

/** @brief Props for ObjectTable organism. */
export interface ObjectTableProps {
  objects: S3Object[];
  bucketName: string;
  prefix: string;
  onPrefixChange: (p: string) => void;
  onUpload: (key: string, file: File) => void;
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
  onRefresh: () => void;
}

/**
 * @brief Object listing table with toolbar.
 * @param props - ObjectTable properties.
 */
export default function ObjectTable({
  objects,
  bucketName,
  prefix,
  onPrefixChange,
  onUpload,
  onDownload,
  onDelete,
  onRefresh,
}: ObjectTableProps) {
  const [uploadOpen, setUploadOpen] =
    useState(false);
  const [delTarget, setDelTarget] =
    useState<string | null>(null);

  return (
    <div data-testid="object-table">
      <Stack direction="row" spacing={2}
        alignItems="center" sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder={labels.objects.filterPrefix}
          value={prefix}
          onChange={(e) =>
            onPrefixChange(e.target.value)}
          aria-label={labels.objects.filterPrefix}
        />
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadOpen(true)}
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

      {objects.length === 0 ? (
        <Typography color="text.secondary">
          {labels.objects.empty}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  {labels.objects.key}
                </TableCell>
                <TableCell>
                  {labels.objects.size}
                </TableCell>
                <TableCell>
                  {labels.objects.lastModified}
                </TableCell>
                <TableCell align="right">
                  {labels.objects.actions}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objects.map((o) => (
                <ObjectRow
                  key={o.key}
                  object={o}
                  onDownload={onDownload}
                  onDelete={setDelTarget}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={onUpload}
        prefix={prefix}
      />

      <ConfirmDialog
        open={!!delTarget}
        title={labels.objects.delete}
        message={labels.dialogs.deleteObject
          .replace('{key}', delTarget ?? '')}
        onConfirm={() => {
          if (delTarget) onDelete(delTarget);
          setDelTarget(null);
        }}
        onCancel={() => setDelTarget(null)}
      />
    </div>
  );
}
