'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer
  from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { S3Object } from '@/types';
import ObjectRow from './ObjectRow';
import labels from '@/constants/ui-labels.json';

/** @brief Props for ObjectDataTable molecule. */
export interface ObjectDataTableProps {
  objects: S3Object[];
  onDownload: (key: string) => void;
  onDelete: (key: string) => void;
}

/**
 * @brief Table displaying S3 objects.
 * @param props - ObjectDataTable properties.
 */
export default function ObjectDataTable({
  objects,
  onDownload,
  onDelete,
}: ObjectDataTableProps) {
  if (objects.length === 0) {
    return (
      <Typography color="text.secondary">
        {labels.objects.empty}
      </Typography>
    );
  }

  return (
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
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
