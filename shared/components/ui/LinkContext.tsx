'use client';

import React, {
  createContext,
  useContext,
} from 'react';

type LinkComponent = React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  target?: string;
  rel?: string;
  role?: string;
  'data-testid'?: string;
}>;

/** Default link — plain <a> tag. */
const DefaultLink: LinkComponent = ({
  href,
  children,
  ...props
}) => (
  <a href={href} {...props}>
    {children}
  </a>
);

const Ctx = createContext<LinkComponent>(
  DefaultLink,
);

/** Provider to inject a custom Link. */
export const LinkProvider: React.FC<{
  component: LinkComponent;
  children: React.ReactNode;
}> = ({ component, children }) => (
  <Ctx.Provider value={component}>
    {children}
  </Ctx.Provider>
);

/** Hook to get the app-level Link. */
export const useLink = () => useContext(Ctx);

export type { LinkComponent };
