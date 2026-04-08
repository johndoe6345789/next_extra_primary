'use client';

import Typography from '@shared/m3/Typography';
import { Icon } from '@shared/m3/data-display/Icon';

/** Props for the Stat pill component. */
export interface StatProps {
  /** Material icon name. */
  icon: string;
  /** Numeric or text value to display. */
  value: string;
  /** Descriptive label below the value. */
  label: string;
}

/** Style for each stat pill. */
const statStyle: React.CSSProperties = {
  textAlign: 'center', minWidth: 64,
};

/** Stat pill shown in the profile header. */
export default function ProfileHeaderStat({
  icon, value, label,
}: StatProps) {
  return (
    <div style={statStyle}>
      <Icon size="sm" color="primary">
        {icon}
      </Icon>
      <Typography variant="h6">
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
      >
        {label}
      </Typography>
    </div>
  );
}
