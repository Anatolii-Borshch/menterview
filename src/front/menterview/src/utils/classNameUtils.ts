export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const buildGridClasses = (
  baseColsClass: string,
  responsiveOverrides?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }
): string => {
  const classes = [baseColsClass];

  if (responsiveOverrides) {
    if (responsiveOverrides.sm) classes.push(`sm:${responsiveOverrides.sm}`);
    if (responsiveOverrides.md) classes.push(`md:${responsiveOverrides.md}`);
    if (responsiveOverrides.lg) classes.push(`lg:${responsiveOverrides.lg}`);
    if (responsiveOverrides.xl) classes.push(`xl:${responsiveOverrides.xl}`);
  }

  return classes.join(' ');
};

export const buildButtonClasses = (
  size: 'sm' | 'md' | 'lg' = 'md',
  variant: 'primary' | 'secondary' | 'outline' = 'primary'
): string => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-navy text-white hover:bg-cornflower',
    secondary: 'bg-white text-navy border border-periwinkle hover:border-cornflower',
    outline: 'border border-periwinkle text-navy hover:border-cornflower',
  };

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};

export const buildCardClasses = (
  withHover: boolean = true,
  className?: string
): string => {
  const baseClasses = 'bg-white border border-periwinkle rounded-xl p-4';
  const hoverClasses = withHover ? 'hover:border-cornflower/40 transition-colors' : '';
  return `${baseClasses} ${hoverClasses} ${className || ''}`.trim();
};

export const buildContainerClasses = (maxWidth: 'sm' | 'md' | 'lg' | 'xl' = 'lg'): string => {
  const maxWidths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
  };

  return `${maxWidths[maxWidth]} mx-auto px-6`;
};
