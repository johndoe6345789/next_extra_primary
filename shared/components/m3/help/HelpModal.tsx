/**
 * HelpModal - Main in-app help and
 * documentation modal.
 */

import React from 'react';
import { useDocumentation } from '../../hooks/useDocumentation';
import { testId } from '../../utils/accessibility';
import DocNavigation from './DocNavigation';
import DocContentRenderer from './DocContentRenderer';
import { HelpModalHeader } from './HelpModalHeader';
import { HelpSearchBar } from './HelpSearchBar';
import { HelpModalFooter } from './HelpModalFooter';

const MODAL_STYLE: React.CSSProperties = {
  position: 'fixed',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'var(--color-surface)',
  borderRadius: '8px',
  boxShadow: 'var(--shadow-xl)',
  zIndex: 1000,
  width: '90%', maxWidth: '1000px',
  maxHeight: '90vh',
  display: 'flex', flexDirection: 'column',
};

export const HelpModal: React.FC = () => {
  const doc = useDocumentation();
  if (!doc.isOpen) return null;

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    doc.search(e.target.value);

  const content = doc.searchQuery && doc.searchResults.length > 0
    ? <DocContentRenderer pages={doc.searchResults} isSearchResults onPageSelect={doc.goToPage} />
    : doc.searchQuery && doc.searchResults.length === 0
      ? <p style={{ color: 'var(--color-text-secondary)' }}>No results found for &ldquo;{doc.searchQuery}&rdquo;</p>
      : doc.currentPage
        ? <DocContentRenderer pages={[doc.currentPage]} onPageSelect={doc.goToPage} />
        : <p style={{ color: 'var(--color-text-secondary)' }}>Select a topic from the left to get started</p>;

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        onClick={doc.closeHelpModal} aria-hidden="true"
      />
      <div style={MODAL_STYLE} data-testid={testId.modal('help')} role="dialog" aria-labelledby="help-modal-title">
        <HelpModalHeader onClose={doc.closeHelpModal} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div role="navigation" aria-label="Documentation navigation"
            style={{ width: '250px', borderRight: '1px solid var(--color-border)', overflowY: 'auto', padding: '16px' }}>
            <DocNavigation onPageSelect={doc.goToPage} currentPageId={doc.currentPage?.id} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <HelpSearchBar query={doc.searchQuery} onChange={onSearch} onClear={doc.clearSearchResults} />
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>{content}</div>
          </div>
        </div>
        <HelpModalFooter canGoBack={doc.canGoBack} onBack={doc.goBackInHistory} onClose={doc.closeHelpModal} />
      </div>
    </>
  );
};

export default HelpModal;
