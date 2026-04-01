/** @file page.tsx - Main API docs page. */
'use client';

import { useState } from 'react';
import {
  Typography, Tabs, Tab, CircularProgress,
} from '@shared/m3';
import { useOpenApiSpec } from '@/hooks/useOpenApiSpec';
import { useSearch } from '@/hooks/useSearch';
import SearchBar from '@/components/SearchBar';
import EndpointGroup from '@/components/EndpointGroup';
import InfoPanel from '@/components/InfoPanel';
import SchemasPanel from '@/components/SchemasPanel';

/** @brief Root page rendering the API docs. */
export default function ApiDocsPage() {
  const { spec, groups, loading, error } =
    useOpenApiSpec();
  const { query, setQuery, filtered } =
    useSearch(groups);
  const [tab, setTab] = useState(0);

  if (loading) {
    return (
      <div className="apidocs-main">
        <CircularProgress
          data-testid="loading"
          aria-label="Loading API spec"
        />
      </div>
    );
  }

  if (error || !spec) {
    return (
      <div className="apidocs-main">
        <Typography color="error">
          {error ?? 'Failed to load spec'}
        </Typography>
      </div>
    );
  }

  const schemas = spec.components?.schemas ?? {};

  return (
    <>
      <header className="apidocs-header">
        <Typography variant="h5">
          {spec.info.title} API Docs
        </Typography>
      </header>
      <main className="apidocs-main">
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          data-testid="main-tabs"
          aria-label="Documentation sections"
        >
          <Tab label="Endpoints" />
          <Tab label="Schemas" />
          <Tab label="Info" />
        </Tabs>
        {tab === 0 && (
          <>
            <SearchBar
              value={query}
              onChange={setQuery}
            />
            {filtered.map((g) => (
              <EndpointGroup
                key={g.tag}
                group={g}
              />
            ))}
          </>
        )}
        {tab === 1 && (
          <SchemasPanel schemas={schemas} />
        )}
        {tab === 2 && (
          <InfoPanel spec={spec} />
        )}
      </main>
    </>
  );
}
