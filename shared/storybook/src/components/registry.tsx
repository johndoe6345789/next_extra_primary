/**
 * Component Registry
 * Maps JSON component type names to React
 * components.
 */

export type { ComponentProps, AnyComponent }
  from './registryTypes'
export {
  Box, Stack, Flex, Grid, Container,
  ScrollArea, ComponentRef,
} from './layoutComponents'
export {
  Card, CardHeader, CardContent,
  CardActions, CardDescription, Paper,
} from './surfaceComponents'
export { Typography } from './typographyComponent'
export { Button } from './buttonComponent'
export {
  Icon, Divider, Avatar, Badge, Chip,
} from './displayComponents'
export {
  TextField, Select, Label, Textarea,
} from './inputComponents'
export {
  Alert, Progress, CircularProgress, Skeleton,
} from './feedbackComponents'
export {
  Tabs, Tab, TabPanel,
  AppBar, Toolbar, Link, Breadcrumbs,
} from './navigationComponents'
export {
  IconButton, Switch, FormField,
  ConditionalRender,
} from './interactiveComponents'
export {
  Dialog, DialogTitle,
  DialogContent, DialogActions,
} from './dialogComponents'
export {
  Menu, MenuItem, List, ListItem,
  ListItemIcon, ListItemText,
  ListItemButton, Collapse,
  Accordion, AccordionSummary,
  AccordionDetails,
} from './listComponents'
export {
  Image, Iframe, Table, Pagination,
} from './mediaComponents'
export {
  Level4Header, IntroSection,
  AppHeader, AppFooter, Sidebar,
} from './appComponents'
export { componentRegistry } from './registryMap'
export {
  getComponent, registerComponent,
  hasComponent,
} from './registryHelpers'
