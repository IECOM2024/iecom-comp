/* eslint-disable @typescript-eslint/unbound-method */
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { type ComponentStyleConfig } from '@chakra-ui/react';

const variantDark: SystemStyleFunction = () => {
  return {
    field: {
      border: '2px solid',
      borderColor: 'gray.400',
      bg: 'gray.600',
      color: 'white',
      _hover: {
        borderColor: 'gray.500'
      },
      _invalid: {
        borderColor: 'oranye'
      },
      _focusVisible: {
        boxShadow: '0 0 16px rgba(255,252,131,0.4)'
      }
    }
  };
};

const variantLight: SystemStyleFunction = () => {
  return {
    field: {
      bg: 'rgba(74, 88, 246, 0.5)',
      _hover: {
        bg: 'rgba(74, 88, 246, 0.75)'
      },
      _invalid: {
        borderColor: 'oranye'
      },
      _focusVisible: {
        boxShadow: '0 0 16px rgba(255,252,131,0.4)'
      }
    }
  };
};

const variantSolidLight: SystemStyleFunction = () => {
  return {
    field: {
      px: '0.5rem',
      py: '0.25rem',
      width: '100%',
      bgColor: 'white',
      focusBorderColor: 'none',
      borderRadius: '8px',
      border: '1px solid black',
      _invalid: {
        borderColor: 'oranye'
      }
    }
  };
};

const variantUnstyled: SystemStyleFunction = () => {
  return {
    field: {
      bg: 'transparent',
      px: '0',
      height: 'auto'
    }
  };
};

export const Input: ComponentStyleConfig = {
  variants: {
    filledDark: variantDark,
    filledLight: variantLight,
    solidLight: variantSolidLight,
    unstyled: variantUnstyled
  },
  defaultProps: {
    size: 'md',
    variant: 'filledDark'
  }
};
