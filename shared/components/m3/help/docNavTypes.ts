/** A single page in the navigation. */
export interface NavPage {
  id: string;
  title: string;
  estimatedReadTime?: number;
}

/** Props for DocNavSection. */
export interface DocNavSectionProps {
  sectionId: string;
  sectionTitle: string;
  sectionIcon?: string;
  isExpanded: boolean;
  pages: NavPage[];
  currentPageId?: string | null;
  onToggle: (id: string) => void;
  onPageSelect: (id: string) => void;
}
