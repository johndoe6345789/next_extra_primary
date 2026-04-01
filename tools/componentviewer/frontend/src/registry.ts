/**
 * Maps component definition names to actual
 * M3 React component references.
 * @module registry
 */
import type { ComponentType } from 'react';
import {
  Button, TextField, Card, Typography,
  Alert, Chip, Dialog, Table, Tabs, Tab,
  Accordion, AccordionSummary,
  AccordionDetails, CardContent, CardHeader,
  CardActions, TableHead, TableBody,
  TableRow, TableCell, TableContainer,
  DialogTitle, DialogContent,
  DialogContentText, DialogActions,
  TabPanel,
} from '@shared/m3';

/** Map of name to component for previews. */
const REGISTRY: Record<
  string,
  ComponentType<Record<string, unknown>>
> = {
  Button: Button as ComponentType<
    Record<string, unknown>
  >,
  TextField: TextField as ComponentType<
    Record<string, unknown>
  >,
  Card: Card as ComponentType<
    Record<string, unknown>
  >,
  Typography: Typography as ComponentType<
    Record<string, unknown>
  >,
  Alert: Alert as ComponentType<
    Record<string, unknown>
  >,
  Chip: Chip as ComponentType<
    Record<string, unknown>
  >,
  Dialog: Dialog as ComponentType<
    Record<string, unknown>
  >,
  Table: Table as ComponentType<
    Record<string, unknown>
  >,
  Tabs: Tabs as ComponentType<
    Record<string, unknown>
  >,
  Accordion: Accordion as ComponentType<
    Record<string, unknown>
  >,
};

/**
 * @brief Looks up a component by name.
 * @param name - The component name string.
 * @returns The React component or undefined.
 */
export function getComponent(
  name: string,
): ComponentType<Record<string, unknown>> | undefined {
  return REGISTRY[name];
}
