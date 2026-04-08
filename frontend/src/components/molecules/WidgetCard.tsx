'use client';

import type { ComponentType } from 'react';
import Typography from '@shared/m3/Typography';
import { Icon } from '@shared/m3/data-display/Icon';
import type { WidgetId } from '@/types/dashboard';
import {
  pillOn, pillOff, previewBox,
  cardStyle, headerStyle,
} from './widgetCardStyles';

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
          aria-label={
            `${label} ${on ? 'on' : 'off'}`
          }
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
