# Shared Library Inventory

Full inventory of reusable packages in `shared/`.

---

## Directory Overview

| Directory      | Package Scope        | Purpose                          |
|----------------|----------------------|----------------------------------|
| `components/`  | `@metabuilder/*`     | React component library (M3)    |
| `redux/`       | `@metabuilder/*`     | Redux Toolkit state management   |
| `hooks/`       | `@metabuilder/hooks` | React hooks (UI, storage, sync)  |
| `icons/`       | `@metabuilder/icons` | Icon fonts + React icon comps    |
| `interfaces/`  | `@metabuilder/*`     | Shared TS types and contracts    |
| `scss/`        | `@metabuilder/scss`  | Material Design 3 SCSS system    |
| `schemas/`     | -                    | YAML/JSON schema definitions     |
| `e2e/`         | -                    | Playwright test infrastructure   |
| `storybook/`   | -                    | Component visual documentation   |

---

## Components (`@metabuilder/components`)

### Sub-libraries

| Export Path   | Description                              |
|---------------|------------------------------------------|
| `./m3`        | Full M3 component library (standalone)   |
| `./vanilla`   | Pure CSS components (no framework deps)  |
| `./radix`     | Radix UI primitive wrappers              |
| `./cards`     | Card layout components                   |
| `./forms`     | Form builders and field components       |
| `./layout`    | Layout primitives                        |
| `./navigation`| Navigation components                   |

### M3 (`@metabuilder/m3`)

**Official Google M3 SCSS implementation.** Built directly
on `@material/` SCSS tokens from Angular Material — the
same design system Google uses. Not a MUI clone; it goes
straight to the source. MUI-compatible API surface for
easy migration but backed by Google's M3 token system.

Dependencies: `classnames`, `clsx`
Peers: `react ^18 || ^19`, `react-dom ^18 || ^19`

#### Inputs (25+)

Button, ButtonGroup, IconButton, Fab, Input, Textarea,
Select, NativeSelect, Checkbox, Radio, RadioGroup, Switch,
Slider, TextField, Autocomplete, Rating, ToggleButton,
ToggleButtonGroup, DatePicker, TimePicker, ColorPicker,
FileUpload, FormControl, FormGroup, FormLabel,
FormHelperText, FormControlLabel, InputLabel,
ButtonBase, InputBase, FilledInput, OutlinedInput

#### Surfaces (8)

Paper, Card (+ Header/Content/Actions/ActionArea/Media),
Accordion (+ Summary/Details/Actions), AppBar, Toolbar,
Drawer

#### Layout (6)

Box, Container, Grid, Stack, Flex,
ImageList (+ Item/ItemBar)

#### Data Display (13)

Typography, Avatar, AvatarGroup, Badge, Chip, Divider,
List (+ Item/Button/Text/Icon/Avatar/Subheader),
Table (+ Head/Body/Footer/Row/Cell/Container/
Pagination/SortLabel), Tooltip, Markdown, Separator

#### Feedback (11)

Alert (+ Title/Description), Backdrop, Spinner,
CircularProgress, LinearProgress, Progress, Skeleton,
Snackbar (+ Content), Dialog, toast/Toaster,
NotificationContainer, ErrorDisplay, LoadingContent

#### Navigation (13)

Breadcrumbs, Link, Menu (+ Item/List),
Tabs (+ Tab/Panel), Pagination (+ Item),
Stepper (+ Step/Label/Button/Content/Connector/Icon),
BottomNavigation (+ Action),
SpeedDial (+ Action/Icon)

#### Utilities

Modal, Popover, Popper, Portal, ClickAwayListener,
CssBaseline, GlobalStyles, NoSsr, TextareaAutosize,
Transitions: Fade, Grow, Slide, Zoom, Collapse

#### Media Query Hooks

useMediaQuery, useMediaQueryUp, useMediaQueryDown,
useMediaQueryBetween

#### Lab (Experimental)

LoadingButton, Masonry, Timeline (+ all sub-components),
TreeItem

#### X (Advanced)

DataGrid, DataGridPro, DataGridPremium,
DatePicker, TimePicker, DateTimePicker,
DesktopDatePicker, MobileDatePicker, StaticDatePicker,
CalendarPicker, ClockPicker

#### Domain-Specific

- **Email:** 22 composition/display components
- **Database:** 10 admin components (DataGrid, dialogs)
- **Code:** MonacoEditor, CodePreview, SplitView
- **Terminal:** Terminal, TerminalHeader/Output/Input
- **Canvas:** Canvas rendering components
- **Workflows:** Workflow builder components
- **Settings:** Configuration components

---

## SCSS (`@metabuilder/scss`)

Material You 3 styling system using official Google
M3 SCSS tokens from Angular Material.

### Token System

```
--mat-sys-primary, --mat-sys-secondary, --mat-sys-tertiary
--mat-sys-error, --mat-sys-surface, --mat-sys-on-*
--mat-sys-surface-container-{low,medium,high,highest}
--mat-sys-corner-{none,extra-small,small,medium,large,
  extra-large,full}
--mat-sys-level{1-4}  (elevation/shadows)
--mat-sys-*-font, --mat-sys-*-size  (type scale)
```

### Color Palettes

- Primary: Violet (customizable)
- Tertiary: Cyan
- Light and dark theme token sets
- Extended semantic: success, warning, info, search

### State Layers

hover 8%, focus 12%, pressed 12%, dragged 16%

### SCSS Atoms (78+ modules)

Scoped component styles in `scss/atoms/`:
accordion, alert, appBar, avatar, breadcrumbs,
code-block, code-inline, code-preview, dashboard,
docs, editor, empty-state, error-state, form, grid,
help, highlight, icon-button, and 60+ more.

---

## Redux (`@metabuilder/redux-*`) - 19 Packages

### Core

| Package         | Contents                              |
|-----------------|---------------------------------------|
| `core`          | authSlice, projectSlice,              |
|                 | workspaceSlice, workflowSlice,        |
|                 | nodesSlice, asyncDataSlice,           |
|                 | store factory, middleware config       |
| `slices`        | canvasSlice, canvasItemsSlice,        |
|                 | editorSlice + selectors               |
| `email`         | emailListSlice, emailDetailSlice,     |
|                 | emailComposeSlice, emailFiltersSlice  |
| `middleware`    | API, auth, custom middleware          |
| `persist`       | Redux-persist with IndexedDB storage  |

### Hooks

| Package         | Contents                              |
|-----------------|---------------------------------------|
| `hooks`         | Canvas zoom/pan, editor clipboard,    |
|                 | UI modals                             |
| `hooks-async`   | useReduxAsyncData, useReduxMutation   |
| `hooks-auth`    | useLoginLogic, useRegisterLogic,      |
|                 | usePasswordValidation                 |
| `hooks-canvas`  | useCanvasItems, operations            |
| `hooks-data`    | useProject, useWorkflow,              |
|                 | useWorkspace, useExecution            |
| `hooks-forms`   | useFormBuilder                        |
| `hooks-utils`   | useDebounced, useThrottled,           |
|                 | useLocalStorage, useTableState,       |
|                 | useMediaQuery, useWindowSize          |
| `core-hooks`    | useDialog, useTabs, useSelection,     |
|                 | useAccordion, useToggle,              |
|                 | useFocusState, useCopyState,          |
|                 | useConfirmDialog, useListOperations,  |
|                 | usePasswordVisibility                 |

### Services & Adapters

| Package         | Contents                              |
|-----------------|---------------------------------------|
| `adapters`      | DefaultAdapters, MockAdapters,        |
|                 | ServiceContext                        |
| `api-clients`   | useAsyncData, useGitHubFetcher        |
| `services`      | Service layer abstraction             |
| `timing-utils`  | Debounce, throttle utilities          |

---

## Hooks (`@metabuilder/hooks`)

### UI Hooks (13)

useDialogState, useMultipleDialogs, useFocusState,
useCopyState, useIsMobile, usePasswordVisibility,
usePopoverState, useTabNavigation, useAccordion,
useLastSaved, useFormatValue, useImageState,
useActiveSelection

### Storage Hooks (5)

useBlobStorage, useKVStore, useIndexedDB,
useOfflineSync, useSyncQueue

### Exported Types

AsyncState, DBALClientConfig, SyncStatus,
OfflineSyncState, BaseEntity, SoftDeletableEntity,
TenantScopedEntity, ApiResponse, BlobMetadata,
ListResult, DBALError, DBALErrorCode

---

## Icons (`@metabuilder/icons`)

### Font Assets

- `material-icons/` - Material Design icon font
- `material-symbols/` - Material Symbols variable font

### React Components (68+)

| Category   | Icons                                   |
|------------|-----------------------------------------|
| Navigation | Menu, ArrowBack, ArrowForward,          |
|            | ChevronLeft, ChevronRight, Close        |
| Actions    | Add, Remove, Delete, Edit, Save, Copy,  |
|            | Search, Refresh, Settings, Download,    |
|            | Upload, Send, Share, Print, Filter      |
| Status     | Check, Error, Warning, Info, Help,      |
|            | Notifications, Star, Trophy, Timer,     |
|            | Node, Folder, FolderOpen                |
| Media      | Play, Pause, Stop, ZoomIn, ZoomOut,     |
|            | Fullscreen, LightMode, DarkMode         |
| Workflow   | AccountTree, Code, DataObject, Sparkles |

---

## Interfaces (`@metabuilder/interfaces`)

### Request/Response Contracts

- CreateProjectRequest, UpdateProjectRequest
- CreateWorkspaceRequest, UpdateWorkspaceRequest

### Re-exported Type Modules

Workflow, Project, Template, Dashboard, Workspace,
Request types

---

## Schemas

YAML and JSON schema definitions for packages and
configuration validation.

---

## E2E Testing (`shared/e2e/`)

- Playwright config and global setup/teardown
- JSON test runner for data-driven tests
- Deployment smoke tests
- Screenshot pastebin and settings debug specs
- Auto-fix test utilities

---

## Storybook (`shared/storybook/`)

Component documentation and visual testing.
