/**
 * Component registry map.
 * Maps JSON type names to React components.
 */

import type { AnyComponent } from './registryTypes'
import * as L from './layoutComponents'
import * as S from './surfaceComponents'
import * as T from './typographyComponent'
import * as B from './buttonComponent'
import * as D from './displayComponents'
import * as I from './inputComponents'
import * as F from './feedbackComponents'
import * as N from './navigationComponents'
import * as X from './interactiveComponents'
import * as DL from './dialogComponents'
import * as LS from './listComponents'
import * as M from './mediaComponents'
import * as A from './appComponents'

/** Component Registry - maps JSON type names. */
export const componentRegistry: Record<
  string, AnyComponent
> = {
  Box: L.Box, Stack: L.Stack, Flex: L.Flex,
  Grid: L.Grid, Container: L.Container,
  ScrollArea: L.ScrollArea,
  ComponentRef: L.ComponentRef,
  Card: S.Card, CardHeader: S.CardHeader,
  CardContent: S.CardContent,
  CardActions: S.CardActions,
  CardDescription: S.CardDescription,
  CardTitle: S.CardHeader,
  CardFooter: S.CardActions, Paper: S.Paper,
  Typography: T.Typography, Text: T.Typography,
  Heading: T.Typography, Button: B.Button,
  TextField: I.TextField, Select: I.Select,
  Label: I.Label, Textarea: I.Textarea,
  Switch: X.Switch, FormField: X.FormField,
  Image: M.Image, Iframe: M.Iframe,
  ConditionalRender: X.ConditionalRender,
  Icon: D.Icon, Avatar: D.Avatar,
  Badge: D.Badge, Chip: D.Chip,
  Divider: D.Divider, Separator: D.Divider,
  Alert: F.Alert, Progress: F.Progress,
  LinearProgress: F.Progress,
  CircularProgress: F.CircularProgress,
  Skeleton: F.Skeleton,
  Tabs: N.Tabs, Tab: N.Tab,
  TabPanel: N.TabPanel,
  AppBar: N.AppBar, Toolbar: N.Toolbar,
  Link: N.Link, Breadcrumbs: N.Breadcrumbs,
  List: LS.List, ListItem: LS.ListItem,
  ListItemButton: LS.ListItemButton,
  ListItemIcon: LS.ListItemIcon,
  ListItemText: LS.ListItemText,
  IconButton: X.IconButton,
  Menu: LS.Menu, MenuItem: LS.MenuItem,
  Collapse: LS.Collapse,
  Accordion: LS.Accordion,
  AccordionSummary: LS.AccordionSummary,
  AccordionDetails: LS.AccordionDetails,
  Table: M.Table, Pagination: M.Pagination,
  Dialog: DL.Dialog,
  DialogTitle: DL.DialogTitle,
  DialogContent: DL.DialogContent,
  DialogActions: DL.DialogActions,
  Level4Header: A.Level4Header,
  IntroSection: A.IntroSection,
  AppHeader: A.AppHeader,
  AppFooter: A.AppFooter,
  Sidebar: A.Sidebar,
}
