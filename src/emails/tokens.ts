import { useMemo } from 'react';

/**
 * Design tokens for React Email templates
 * Provides consistent colors, fonts, spacing, and other design values
 */

// Color tokens
export const colors = {
  // Primary brand colors
  primary: '#2754C5',
  secondary: '#656ee8',
  accent: '#556cd6',
  
  // Background colors
  background: '#f6f9fc',
  white: '#ffffff',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#525f7f',
  textMuted: '#898989',
  textLight: '#8898aa',
  
  // Border and neutral colors
  border: '#e6ebf1',
  borderLight: '#eeeeee',
  neutralLight: '#f4f4f4',
  neutralDark: '#898989',
  
  // State colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
} as const;

// Typography tokens
export const fonts = {
  // Font family
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  
  // Font sizes
  size: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  // Line heights
  lineHeight: {
    tight: '16px',
    base: '20px',
    normal: '22px',
    relaxed: '24px',
    loose: '28px',
  },
  
  // Font weights
  weight: {
    normal: 'normal',
    medium: '500',
    semibold: '600',
    bold: 'bold',
  },
} as const;

// Spacing tokens
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
} as const;

// Border tokens
export const borders = {
  radius: {
    none: '0px',
    sm: '3px',
    base: '5px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  width: {
    none: '0px',
    thin: '1px',
    base: '2px',
    thick: '4px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
} as const;

// Shadow tokens for depth
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Combined design tokens object
export const designTokens = {
  colors,
  fonts,
  spacing,
  borders,
  shadows,
} as const;

// Legacy typography export for backward compatibility
export const typography = fonts;

// Hook to access design tokens in React components
export const useTokens = () => {
  return useMemo(() => designTokens, []);
};

// Utility functions for common email styling patterns
export const createEmailStyles = () => {
  return {
    // Main email container
    main: {
      backgroundColor: colors.background,
      fontFamily: fonts.family,
    },
    
    // Content container
    container: {
      backgroundColor: colors.white,
      margin: '0 auto',
      padding: `${spacing.lg} 0 ${spacing.xxl}`,
      marginBottom: spacing.xxxl,
    },
    
    // Section/Box container
    box: {
      padding: `0 ${spacing.xxl}`,
    },
    
    // Headings
    h1: {
      color: colors.textPrimary,
      fontFamily: fonts.family,
      fontSize: fonts.size.xxl,
      fontWeight: fonts.weight.bold,
      margin: `${spacing.xl} 0`,
      padding: '0',
    },
    
    h2: {
      color: colors.textPrimary,
      fontFamily: fonts.family,
      fontSize: fonts.size.xl,
      fontWeight: fonts.weight.semibold,
      margin: `${spacing.lg} 0`,
    },
    
    // Paragraph text
    paragraph: {
      color: colors.textSecondary,
      fontFamily: fonts.family,
      fontSize: fonts.size.lg,
      lineHeight: fonts.lineHeight.relaxed,
      textAlign: 'left' as const,
    },
    
    // Small text
    small: {
      color: colors.textMuted,
      fontFamily: fonts.family,
      fontSize: fonts.size.sm,
      lineHeight: fonts.lineHeight.normal,
    },
    
    // Links
    link: {
      color: colors.primary,
      fontFamily: fonts.family,
      fontSize: fonts.size.base,
      textDecoration: 'underline',
    },
    
    // Buttons
    button: {
      backgroundColor: colors.secondary,
      borderRadius: borders.radius.base,
      color: colors.white,
      fontSize: fonts.size.lg,
      fontWeight: fonts.weight.bold,
      textDecoration: 'none',
      textAlign: 'center' as const,
      display: 'block',
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
    },
    
    // Primary button variant
    buttonPrimary: {
      backgroundColor: colors.primary,
      borderRadius: borders.radius.base,
      color: colors.white,
      fontSize: fonts.size.lg,
      fontWeight: fonts.weight.bold,
      textDecoration: 'none',
      textAlign: 'center' as const,
      display: 'block',
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
    },
    
    // Horizontal rule
    hr: {
      borderColor: colors.border,
      margin: `${spacing.lg} 0`,
    },
    
    // Code blocks
    code: {
      display: 'inline-block',
      padding: `${spacing.md} 4.5%`,
      width: '90.5%',
      backgroundColor: colors.neutralLight,
      borderRadius: borders.radius.base,
      border: `${borders.width.thin} ${borders.style.solid} ${colors.borderLight}`,
      color: colors.textPrimary,
      fontFamily: 'monospace',
      fontSize: fonts.size.base,
    },
    
    // Footer text
    footer: {
      color: colors.textLight,
      fontFamily: fonts.family,
      fontSize: fonts.size.sm,
      lineHeight: fonts.lineHeight.normal,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
  };
};

// Type definitions for better TypeScript support
export type EmailColors = typeof colors;
export type EmailFonts = typeof fonts;
export type EmailSpacing = typeof spacing;
export type EmailBorders = typeof borders;
export type EmailShadows = typeof shadows;
export type EmailTokens = typeof designTokens;

// Default export for convenience
export default designTokens;

