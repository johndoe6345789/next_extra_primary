/**
 * Main page: sidebar with component list,
 * main area with preview, props, variants,
 * and code snippet panels.
 * @module app/page
 */
'use client';

import { Box, Typography } from '@metabuilder/m3';
import { useComponentDefs } from
  '@/hooks/useComponentDefs';
import { useSelectedComponent } from
  '@/hooks/useSelectedComponent';
import { usePropState } from
  '@/hooks/usePropState';
import ComponentSidebar from
  '@/components/ComponentSidebar';
import ComponentPreview from
  '@/components/ComponentPreview';
import PropEditor from '@/components/PropEditor';
import VariantGrid from '@/components/VariantGrid';
import CodeSnippet from '@/components/CodeSnippet';

/** @brief Root page for the component viewer. */
export default function ViewerPage() {
  const { grouped } = useComponentDefs();
  const { selected, select } =
    useSelectedComponent();
  const { values, update } = usePropState(selected);

  return (
    <Box
      data-testid="viewer-root"
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <ComponentSidebar
        grouped={grouped}
        selectedName={selected?.name ?? null}
        onSelect={select}
      />
      <Box
        component="main"
        style={{
          flex: 1,
          padding: 24,
          overflowY: 'auto',
        }}
      >
        {!selected ? (
          <Typography
            variant="h5"
            color="textSecondary"
          >
            Select a component from the sidebar.
          </Typography>
        ) : (
          <>
            <ComponentPreview
              def={selected}
              values={values}
            />
            <PropEditor
              propDefs={selected.props}
              values={values}
              onChange={update}
            />
            <VariantGrid def={selected} />
            <CodeSnippet
              def={selected}
              values={values}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
