'use client';

import type { ComponentType } from 'react';
import Typography from '@shared/m3/Typography';
import { Icon } from '@shared/m3/data-display/Icon';
import type { WidgetId } from '@/types/dashboard';

/** Props for WidgetCard. */
export interface WidgetCardProps {
  /** Widget identifier. */
  id: WidgetId;
  /** Material icon name. */
  icon: string;
  /** Translated label. */
  label: string;
  /** Translated description. */
  desc: string;
  /** Whether the widget is visible. */
  on: boolean;
  /** Toggle callback. */
  onToggle: (id: WidgetId) => void;
  /** The widget component to preview. */
  Comp: ComponentType;
}

/** Pill toggle styles. */
const pillOn: React.CSSProperties = {
  padding: '2px 10px',
  borderRadius: 99,
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  background: 'var(--md-sys-color-primary)',
  color: 'var(--md-sys-color-on-primary)',
};
const pillOff: React.CSSProperties = {
  ...pillOn,
  background: 'var(--md-sys-color-surface-variant)',
  color: 'var(--md-sys-color-on-surface-variant)',
};

/** Scaled-down live preview of a widget. */
const previewBox: React.CSSProperties = {
  height: 100,
  overflow: 'hidden',
  borderRadius: 8,
  border: '1px solid var(--outline-variant)',
  transform: 'scale(0.55)',
  transformOrigin: 'top left',
  width: '182%',
  pointerEvents: 'none',
  marginBottom: -40,
};

/**
 * A card showing a mini live preview of a
 * dashboard widget with a pill on/off toggle.
 */
export default function WidgetCard({
  id, icon, label, desc,
  on, onToggle, Comp,
}: WidgetCardProps) {
  return (
    <div
      style={cardStyle}
      data-testid={`picker-${id}`}
      onClick={() => onToggle(id)}
    >
      <div style={headerStyle}>
        <Icon color="primary" size="sm">
          {icon}
        </Icon>
        <Typography
          variant="subtitle2"
          style={{ flex: 1 }}
        >
          {label}
        </Typography>
        <button
          type="button"
          style={on ? pillOn : pillOff}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(id);
          }}
          aria-label={`${label} ${on ? 'on' : 'off'}`}
          data-testid={`toggle-${id}`}
        >
          {on ? 'ON' : 'OFF'}
        </button>
      </div>
      <Typography
        variant="caption"
        color="textSecondary"
      >
        {desc}
      </Typography>
      <div style={previewBox}>
        <Comp />
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: '1px solid var(--outline-variant)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
