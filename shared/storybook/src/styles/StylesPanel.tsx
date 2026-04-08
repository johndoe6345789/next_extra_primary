/** Storybook Addon: Styles Panel. */

import React, { useState, useEffect } from 'react';
import { loadPackageStyles } from './compilerLoader';
import {
  VersionBadge, ViewToggle,
  CSSView, SchemaView,
} from './StylesPanelViews';

/** Props for the StylesPanel component. */
interface StylesPanelProps {
  /** Package ID to load styles for. */
  packageId?: string;
}

/** Styles debugging panel for Storybook. */
export const StylesPanel: React.FC<
  StylesPanelProps
> = ({ packageId = 'ui_home' }) => {
  const [css, setCSS] = useState('');
  const [schema, setSchema] =
    useState<Record<string, unknown> | null>(null);
  const [view, setView] =
    useState<'css' | 'schema'>('css');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStyles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/packages/${packageId}/seed/styles.json`,
        );
        const data = await response.json();
        setSchema(data);
        const compiled =
          await loadPackageStyles(packageId);
        setCSS(compiled);
      } catch (error) {
        console.error(
          'Failed to load styles:', error,
        );
      } finally {
        setLoading(false);
      }
    };
    loadStyles();
  }, [packageId]);

  if (loading) {
    return (
      <div style={{ padding: '1rem' }}>
        Loading styles...
      </div>
    );
  }

  const isV2 = schema
    && (schema.schema_version || schema.package);

  return (
    <div style={{
      padding: '1rem',
      fontFamily: 'monospace',
      fontSize: '12px',
    }}>
      <div style={{
        marginBottom: '1rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}>
        <h3 style={{ margin: 0 }}>
          Styles: {packageId}
          <VersionBadge isV2={!!isV2} />
        </h3>
        <ViewToggle view={view} setView={setView} />
      </div>
      {view === 'css'
        ? <CSSView css={css} />
        : <SchemaView
            schema={schema}
            isV2={!!isV2}
          />}
    </div>
  );
};
