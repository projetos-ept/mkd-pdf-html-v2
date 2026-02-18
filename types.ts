
export type ThemeId = 'MODERN' | 'SEPIA' | 'NOTEBOOK';
export type FontId = 'sans' | 'serif' | 'mono';
export type HeaderFooterMode = 'normal' | 'fixed';

export interface Theme {
  id: ThemeId;
  name: string;
  bg: string;
  text: string;
  accent: string;
  className: string;
}

export interface DocumentState {
  markdown: string;
  header: string;
  footer: string;
  headerMode: HeaderFooterMode;
  footerMode: HeaderFooterMode;
  theme: ThemeId;
  fontFamily: FontId;
  fontSize: number;
  showTOC: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  markdown: string;
  header: string;
  footer: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
