import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@metabuilder/m3';

const meta: Meta<typeof Typography> = {
  title: 'M3/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Typography>;

export const H1: Story = {
  args: { variant: 'h1', children: 'Heading 1' },
};

export const H2: Story = {
  args: { variant: 'h2', children: 'Heading 2' },
};

export const H3: Story = {
  args: { variant: 'h3', children: 'Heading 3' },
};

export const H4: Story = {
  args: { variant: 'h4', children: 'Heading 4' },
};

export const H5: Story = {
  args: { variant: 'h5', children: 'Heading 5' },
};

export const H6: Story = {
  args: { variant: 'h6', children: 'Heading 6' },
};

/** Body 1 - default paragraph */
export const Body1: Story = {
  args: { variant: 'body1', children: 'Body 1 text' },
};

/** Body 2 - smaller paragraph */
export const Body2: Story = {
  args: { variant: 'body2', children: 'Body 2 text' },
};

export const Subtitle1: Story = {
  args: { variant: 'subtitle1', children: 'Subtitle 1' },
};

export const Subtitle2: Story = {
  args: { variant: 'subtitle2', children: 'Subtitle 2' },
};

export const Caption: Story = {
  args: { variant: 'caption', children: 'Caption text' },
};

export const Overline: Story = {
  args: { variant: 'overline', children: 'Overline text' },
};

/** Centered alignment */
export const Centered: Story = {
  args: { variant: 'h4', align: 'center', children: 'Centered' },
};

/** With gutter bottom */
export const GutterBottom: Story = {
  args: { variant: 'h3', gutterBottom: true, children: 'Guttered' },
};

/** No wrap (truncated) */
export const NoWrap: Story = {
  args: { variant: 'body1', noWrap: true, children: 'Long text truncates.' },
  decorators: [
    (Story) => (
      <div style={{ width: 120 }}><Story /></div>
    ),
  ],
};
