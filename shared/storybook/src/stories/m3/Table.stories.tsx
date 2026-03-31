import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table, TableHead, TableBody, TableRow,
  TableCell, TableContainer, TablePagination,
  TableSortLabel,
} from '@metabuilder/m3';

const meta: Meta<typeof Table> = {
  title: 'M3/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Editor' },
  { id: 3, name: 'Carol', role: 'Viewer' },
];

const TH = (cols: string[]) => (
  <TableHead><TableRow>
    {cols.map((c) => <TableCell header key={c}>{c}</TableCell>)}
  </TableRow></TableHead>
);

const body = (fields: (keyof typeof rows[0])[]) => (
  <TableBody>
    {rows.map((r) => (
      <TableRow key={r.id}>
        {fields.map((f) => <TableCell key={f}>{r[f]}</TableCell>)}
      </TableRow>
    ))}
  </TableBody>
);

/** Basic data table */
export const Basic: Story = {
  render: () => (
    <TableContainer>
      <Table>{TH(['ID', 'Name', 'Role'])}{body(['id', 'name', 'role'])}</Table>
    </TableContainer>
  ),
};

/** Striped and bordered */
export const StripedBordered: Story = {
  render: () => (
    <TableContainer>
      <Table striped bordered>{TH(['ID', 'Name'])}{body(['id', 'name'])}</Table>
    </TableContainer>
  ),
};

/** With sortable column header */
export const Sortable: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHead><TableRow>
          <TableCell header>
            <TableSortLabel active direction="asc">Name</TableSortLabel>
          </TableCell>
          <TableCell header>Role</TableCell>
        </TableRow></TableHead>
        {body(['name', 'role'])}
      </Table>
    </TableContainer>
  ),
};

/** With pagination controls */
export const WithPagination: Story = {
  render: () => (<div>
    <TableContainer>
      <Table size="small">{TH(['Name', 'Role'])}{body(['name', 'role'])}</Table>
    </TableContainer>
    <TablePagination count={30} page={0} rowsPerPage={10} />
  </div>),
};
