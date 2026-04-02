export const THEME_LIST = [
  { id: "default", label: "Default", className: "theme-default", cssPath: "/themes/default.css" },
  { id: "academic", label: "Academic", className: "theme-academic", cssPath: "/themes/academic.css" },
  { id: "minimal", label: "Minimal", className: "theme-minimal", cssPath: "/themes/minimal.css" },
  { id: "custom", label: "Custom", className: "theme-custom", cssPath: null },
] as const;

export type ThemeId = (typeof THEME_LIST)[number]["id"];

export function getThemeClassName(id: string): string {
  return THEME_LIST.find((t) => t.id === id)?.className || "theme-default";
}
