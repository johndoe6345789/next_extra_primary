'use client';

import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OpenInNew,
  Home,
  Email,
  Storage,
  Package,
  CloudQueue,
} from '@shared/m3';

/** Map of icon name to M3 icon component. */
const iconMap: Record<string, React.ReactNode> = {
  Home: <Home />,
  Email: <Email />,
  Storage: <Storage />,
  Inventory: <Package />,
  CloudQueue: <CloudQueue />,
};

/** Site link shape from the JSON constants file. */
export interface SiteLink {
  label: string;
  url: string;
  icon: string;
  current?: boolean;
}

/** Props for SiteDrawerItem. */
interface SiteDrawerItemProps {
  link: SiteLink;
}

/** Single navigation item in the site drawer. */
export default function SiteDrawerItem(
  { link }: SiteDrawerItemProps,
) {
  return (
    <ListItemButton
      component="a"
      href={link.url}
      target={
        link.current ? undefined : '_blank'
      }
      rel="noopener noreferrer"
      selected={!!link.current}
    >
      <ListItemIcon>
        {iconMap[link.icon]}
      </ListItemIcon>
      <ListItemText primary={link.label} />
      {!link.current && (
        <OpenInNew fontSize="small" />
      )}
    </ListItemButton>
  );
}
