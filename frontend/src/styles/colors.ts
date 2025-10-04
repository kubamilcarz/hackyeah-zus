/**
 * ZUS Brand Colors - Based on ZUS Brand Guidelines
 * These colors can be used in JavaScript/TypeScript for charts, dynamic styling, etc.
 */

export const zusColors = {
  // Core brand colors
  yellow: 'rgb(255, 179, 79)',   // R: 255, G: 179, B: 79
  green: 'rgb(0, 153, 63)',      // R: 0, G: 153, B: 63
  gray: 'rgb(190, 195, 206)',    // R: 190, G: 195, B: 206
  blue: 'rgb(63, 132, 210)',     // R: 63, G: 132, B: 210
  navy: 'rgb(0, 65, 110)',       // R: 0, G: 65, B: 110
  red: 'rgb(240, 94, 94)',       // R: 240, G: 94, B: 94
  black: 'rgb(0, 0, 0)',         // R: 0, G: 0, B: 0
} as const;

export const zusColorsHex = {
  // Core brand colors in hex format
  yellow: '#FFB34F',
  green: '#00993F',
  gray: '#BEC3CE',
  blue: '#3F84D2',
  navy: '#00416E',
  red: '#F05E5E',
  black: '#000000',
} as const;

export const zusColorsRgb = {
  // Core brand colors as RGB objects
  yellow: { r: 255, g: 179, b: 79 },
  green: { r: 0, g: 153, b: 63 },
  gray: { r: 190, g: 195, b: 206 },
  blue: { r: 63, g: 132, b: 210 },
  navy: { r: 0, g: 65, b: 110 },
  red: { r: 240, g: 94, b: 94 },
  black: { r: 0, g: 0, b: 0 },
} as const;

export const semanticColors = {
  // Semantic color mappings
  primary: zusColors.navy,
  secondary: zusColors.yellow,
  accent: zusColors.blue,
  success: zusColors.green,
  warning: zusColors.yellow,
  error: zusColors.red,
  neutral: zusColors.gray,
  text: zusColors.black,
  textSecondary: zusColors.gray,
} as const;

export const semanticColorsHex = {
  // Semantic color mappings in hex
  primary: zusColorsHex.navy,
  secondary: zusColorsHex.yellow,
  accent: zusColorsHex.blue,
  success: zusColorsHex.green,
  warning: zusColorsHex.yellow,
  error: zusColorsHex.red,
  neutral: zusColorsHex.gray,
  text: zusColorsHex.black,
  textSecondary: zusColorsHex.gray,
} as const;

/**
 * Utility function to create color with opacity
 * @param color - RGB color string
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export const withOpacity = (color: string, opacity: number): string => {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

/**
 * Chart.js compatible color palette
 */
export const chartColors = [
  zusColors.navy,
  zusColors.yellow,
  zusColors.blue,
  zusColors.green,
  zusColors.red,
  zusColors.gray,
] as const;

export const chartColorsHex = [
  zusColorsHex.navy,
  zusColorsHex.yellow,
  zusColorsHex.blue,
  zusColorsHex.green,
  zusColorsHex.red,
  zusColorsHex.gray,
] as const;

/**
 * Color scheme for different UI states
 */
export const stateColors = {
  default: zusColors.gray,
  active: zusColors.navy,
  hover: withOpacity(zusColors.navy, 0.8),
  disabled: withOpacity(zusColors.gray, 0.5),
  focus: zusColors.blue,
} as const;

export type ZusColorKey = keyof typeof zusColors;
export type SemanticColorKey = keyof typeof semanticColors;
