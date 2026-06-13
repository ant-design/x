// https://github.com/facebook/create-react-app/blob/f09d3d3a52c1b938cecc977c2bbc0942ea0a7e70/packages/react-scripts/lib/react-app.d.ts#L42-L49
declare module '*.svg' {
  import type * as React from 'react';

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '@rc-component/util*';

declare module 'jsonml-to-react-element';

declare module 'jsonml.js/*';

declare module '*.json' {
  const value: any;
  export const version: string;
  export default value;
}

declare module '@npmcli/run-script' {
  export default function runScript(options: {
    [key: string]: string | string[] | boolean | NodeJS.ProcessEnv;
  }): Promise<void>;
}

declare module '@microflash/rehype-figure';

declare module 'dekko';

// Dumi module declarations for .dumi directory
declare module 'dumi/theme-default/slots/SearchBar' {
  const SearchBar: any;
  export default SearchBar;
}

declare module 'dumi/dist/client/theme-api' {
  const themeApi: any;
  export default themeApi;
  export const useIntl: any;
}

declare module 'dumi' {
  const dumi: any;
  export default dumi;
  export const useIntl: any;
  export const useRouteMeta: any;
  export const useRouteData: any;
  export const useSidebarData: any;
  export const useFullSidebarData: any;
  export const useSiteData: any;
  export const useTabMeta: any;
  export const useLocation: any;
  export const useNavigate: any;
  export const FormattedMessage: any;
  export const Helmet: any;
  export const Link: any;
  // rehype/unified types
  export const HastRoot: any;
  export const UnifiedTransformer: any;
  export const unistUtilVisit: any;
}
