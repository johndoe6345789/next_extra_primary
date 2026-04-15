'use client'

/**
 * Core exports: icons, inputs, surfaces, layout, data-display.
 * Split from index.ts to keep each barrel under 100 LOC.
 */

export * from '../../icons/react/m3'

export {
  Button,
  ButtonGroup,
  IconButton,
  Fab,
  Input,
  Textarea,
  Select,
  NativeSelect,
  Checkbox,
  Radio,
  RadioGroup,
  useRadioGroup,
  Switch,
  Slider,
  FormControl,
  useFormControl,
  FormGroup,
  FormLabel,
  FormHelperText,
  InputLabel,
  FormControlLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Rating,
  ButtonBase,
  InputBase,
  FilledInput,
  OutlinedInput,
  FormField,
  DatePicker,
  TimePicker,
  ColorPicker,
  FileUpload,
} from './inputs'

export type { RadioProps, RadioColor, RadioSize } from './inputs'
export type { SelectChangeEvent } from './inputs/Select'

export {
  Paper,
  type PaperProps,
  Card,
  type CardProps,
  CardHeader,
  type CardHeaderProps,
  CardContent,
  type CardContentProps,
  CardActions,
  type CardActionsProps,
  CardActionArea,
  CardMedia,
  type CardMediaProps,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  AppBar,
  type AppBarProps,
  Toolbar,
  type ToolbarProps,
  Drawer,
  type DrawerProps,
} from './surfaces'

export {
  Box,
  type BoxProps,
  Container,
  type ContainerProps,
  Grid,
  type GridProps,
  Stack,
  type StackProps,
  Flex,
  type FlexProps,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from './layout'
