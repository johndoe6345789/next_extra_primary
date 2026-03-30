import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  AccordionGroup, ExpandMoreIcon,
} from '@metabuilder/m3';

const meta: Meta<typeof Accordion> = {
  title: 'M3/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

const icon = <ExpandMoreIcon />;

/** Single uncontrolled accordion */
export const Single: Story = {
  render: () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={icon}>Section Title</AccordionSummary>
      <AccordionDetails>Content for this section.</AccordionDetails>
    </Accordion>
  ),
};

/** Multiple accordions in a group */
export const MultipleGroup: Story = {
  render: () => (
    <AccordionGroup>
      {['General', 'Privacy', 'Notifications'].map((t) => (
        <Accordion key={t}>
          <AccordionSummary expandIcon={icon}>{t}</AccordionSummary>
          <AccordionDetails>Settings for {t.toLowerCase()}.</AccordionDetails>
        </Accordion>
      ))}
    </AccordionGroup>
  ),
};

/** Controlled single-expand behavior */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState<string | null>(null);
    return (
      <AccordionGroup>
        {['First', 'Second', 'Third'].map((item) => (
          <Accordion
            key={item}
            expanded={open === item}
            onChange={() => setOpen(open === item ? null : item)}
          >
            <AccordionSummary expandIcon={icon}>{item} Panel</AccordionSummary>
            <AccordionDetails>
              Content for {item.toLowerCase()}.
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionGroup>
    );
  },
};

/** Outlined variant */
export const OutlinedVariant: Story = {
  render: () => (
    <Accordion variant="outlined" defaultExpanded>
      <AccordionSummary expandIcon={icon}>Outlined</AccordionSummary>
      <AccordionDetails>Outlined variant content.</AccordionDetails>
    </Accordion>
  ),
};

/** Disabled accordion */
export const Disabled: Story = {
  render: () => (
    <Accordion disabled>
      <AccordionSummary expandIcon={icon}>Disabled</AccordionSummary>
      <AccordionDetails>Unreachable content.</AccordionDetails>
    </Accordion>
  ),
};
