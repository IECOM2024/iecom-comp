/* eslint-disable @typescript-eslint/unbound-method */
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { type ComponentStyleConfig } from '@chakra-ui/react';

const variantDark: SystemStyleFunction = () => {
  return {
    border: '2px solid',
    borderColor: 'gray.400',
    bg: 'gray.600',
    _hover: {
      borderColor: 'gray.500'
    },
    _invalid: {
      borderColor: 'oranye'
    },
    _focusVisible: {
      boxShadow: '0 0 16px rgba(255,252,131,0.4)'
    }
  };
};

export const Textarea: ComponentStyleConfig = {
  variants: {
    filledDark: variantDark
  },
  defaultProps: {
    size: 'md',
    variant: 'filledDark'
  }
};
