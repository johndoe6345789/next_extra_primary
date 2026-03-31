import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, Tab, TabPanel } from '@metabuilder/m3';

const meta: Meta<typeof Tabs> = {
  title: 'M3/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

/** Basic tab switching */
export const Basic: Story = {
  render: () => {
    const [val, setVal] = useState(0);
    return (<>
      <Tabs
        value={val}
        onChange={(_e, v) => setVal(v as number)}
      >
        <Tab label="Tab One" value={0} selected={val === 0}
          onClick={() => setVal(0)} />
        <Tab label="Tab Two" value={1} selected={val === 1}
          onClick={() => setVal(1)} />
        <Tab label="Tab Three" value={2} selected={val === 2}
          onClick={() => setVal(2)} />
      </Tabs>
      <TabPanel value={val} index={0}>
        Content for tab one.
      </TabPanel>
      <TabPanel value={val} index={1}>
        Content for tab two.
      </TabPanel>
      <TabPanel value={val} index={2}>
        Content for tab three.
      </TabPanel>
    </>);
  },
};

/** With icons on tabs */
export const WithIcons: Story = {
  render: () => {
    const [val, setVal] = useState(0);
    return (<>
      <Tabs value={val}>
        <Tab
          label="Home" icon={<span>&#8962;</span>}
          value={0} selected={val === 0}
          onClick={() => setVal(0)}
        />
        <Tab
          label="Settings" icon={<span>&#9881;</span>}
          value={1} selected={val === 1}
          onClick={() => setVal(1)}
        />
      </Tabs>
      <TabPanel value={val} index={0}>
        Home content.
      </TabPanel>
      <TabPanel value={val} index={1}>
        Settings content.
      </TabPanel>
    </>);
  },
};

/** Disabled tab */
export const WithDisabledTab: Story = {
  render: () => {
    const [val, setVal] = useState(0);
    return (
      <Tabs value={val}>
        <Tab label="Active" value={0} selected={val === 0}
          onClick={() => setVal(0)} />
        <Tab label="Disabled" value={1} disabled />
        <Tab label="Another" value={2} selected={val === 2}
          onClick={() => setVal(2)} />
      </Tabs>
    );
  },
};

/** Full width variant */
export const FullWidth: Story = {
  render: () => (
    <Tabs variant="fullWidth">
      <Tab label="One" selected />
      <Tab label="Two" />
      <Tab label="Three" />
    </Tabs>
  ),
};
