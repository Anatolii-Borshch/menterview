export const COLORS = {
  NAVY: 'navy',
  CORNFLOWER: 'cornflower',
  PERIWINKLE: 'periwinkle',
  SNOW: 'snow',

  TEXT_PRIMARY: 'text-navy',
  TEXT_SECONDARY: 'text-navy/60',
  TEXT_TERTIARY: 'text-navy/50',
  TEXT_LIGHT: 'text-navy/40',
  TEXT_LIGHTER: 'text-navy/30',
  TEXT_LIGHTEST: 'text-navy/20',

  BG_PRIMARY: 'bg-navy',
  BG_SECONDARY: 'bg-white',
  BG_TERTIARY: 'bg-periwinkle',
  BG_PAGE: 'bg-snow',

  BORDER_PRIMARY: 'border-periwinkle',
  BORDER_HOVER: 'hover:border-cornflower',

  WHITE_10: 'bg-white/10',
  WHITE_60: 'text-white/60',
  CORNFLOWER_10: 'bg-cornflower/10',
} as const;

export const FONTS = {
  SERIF_DISPLAY: { fontFamily: 'DM Serif Display, serif' },
  SANS: { fontFamily: 'system-ui, -apple-system, sans-serif' },
} as const;

export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  XXL: '2.5rem',
  XXXL: '3rem',

  CONTAINER_PADDING: '1.5rem',
  CONTAINER_MAX_WIDTH: '5xl',
  CONTAINER_MAX_WIDTH_LG: '7xl',

  SECTION_PADDING_Y: '2rem',
  SECTION_PADDING_Y_LG: '6rem',
} as const;

export const SIZING = {
  NAVBAR_HEIGHT: '4rem',
  NAVBAR_HEIGHT_REDUCED: '64px',

  ICON_SM: '1.25rem',
  ICON_MD: '2.5rem',
  ICON_LG: '3rem',

  ROUNDED_SM: '0.5rem',
  ROUNDED_MD: '0.75rem',
  ROUNDED_LG: '1rem',
  ROUNDED_XL: '1.5rem',
  ROUNDED_FULL: '9999px',
} as const;

export const GRID = {
  COLS_2: 'grid-cols-2',
  COLS_3: 'grid-cols-3',
  COLS_4: 'grid-cols-4',
  GAP_SM: 'gap-2',
  GAP_MD: 'gap-4',
  GAP_LG: 'gap-8',
} as const;

export const TRANSITIONS = {
  COLORS: 'transition-colors',
  ALL: 'transition-all',
  DURATION_FAST: 'duration-200',
  DURATION_NORMAL: 'duration-300',
} as const;

export const BREAKPOINTS = {
  SM: 'sm:',
  MD: 'md:',
  LG: 'lg:',
  XL: 'xl:',
  XXL: '2xl:',
} as const;
