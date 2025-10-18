export const colors = {
  // Primary colors matching the design
  primary: '#6B46C1', // Purple
  primaryLight: '#8B5CF6',
  primaryDark: '#553C9A',
  
  // Secondary colors
  secondary: '#3B82F6', // Blue
  secondaryLight: '#60A5FA',
  secondaryDark: '#1D4ED8',
  
  // Background colors
  background: '#F8FAFC',
  backgroundGradient: ['#6B46C1', '#3B82F6'], // Purple to blue gradient
  
  // Card and surface colors
  white: '#FFFFFF',
  cardBackground: '#FFFFFF',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  // Status colors
  success: '#10B981', // Green for present
  error: '#EF4444', // Red for absent
  warning: '#F59E0B', // Orange for leave
  info: '#3B82F6', // Blue for info
  
  // Neutral colors
  gray: '#6B7280',
  lightGray: '#E5E7EB',
  border: '#D1D5DB',
  
  // Gender colors (from design)
  male: '#3B82F6', // Blue
  female: '#EC4899', // Pink
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  
  // Font weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  
  // Line heights
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12, // Reduced from 16
  lg: 16, // Reduced from 24
  xl: 20, // Reduced from 32
  '2xl': 24, // Reduced from 48
  '3xl': 32, // Reduced from 64
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
