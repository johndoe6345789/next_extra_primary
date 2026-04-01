import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@shared/m3';

const meta: Meta<typeof Card> = {
  title: 'M3/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Card>;

/** Basic card with text content */
export const Basic: Story = {
  render: () => (
    <Card>
      <CardContent>
        <Typography>
          A simple card with text content.
        </Typography>
      </CardContent>
    </Card>
  ),
};

/** Card with header, content, and actions */
export const WithHeaderAndActions: Story = {
  render: () => (
    <Card>
      <CardHeader
        title="Card Title"
        subheader="Secondary text"
      />
      <CardContent>
        <Typography>
          Card body content goes here.
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="text">Cancel</Button>
        <Button variant="filled">Submit</Button>
      </CardActions>
    </Card>
  ),
};

/** Outlined variant */
export const Outlined: Story = {
  args: { variant: 'outlined' },
  render: (args) => (
    <Card {...args}>
      <CardContent>
        <Typography>Outlined card variant.</Typography>
      </CardContent>
    </Card>
  ),
};

/** Filled variant */
export const Filled: Story = {
  args: { variant: 'filled' },
  render: (args) => (
    <Card {...args}>
      <CardContent>
        <Typography>Filled card variant.</Typography>
      </CardContent>
    </Card>
  ),
};

/** Clickable card */
export const Clickable: Story = {
  render: () => (
    <Card clickable>
      <CardContent>
        <Typography>
          Click this card to interact.
        </Typography>
      </CardContent>
    </Card>
  ),
};

/** Raised card */
export const Raised: Story = {
  render: () => (
    <Card raised>
      <CardContent>
        <Typography>
          Raised card with extra shadow.
        </Typography>
      </CardContent>
    </Card>
  ),
};
