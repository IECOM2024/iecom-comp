/* eslint-disable @typescript-eslint/unbound-method */
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { type ComponentStyleConfig } from '@chakra-ui/react';

const defaultInput: SystemStyleFunction = () => {
  return {
    field: {
      border: '2px solid',
      borderColor: 'gray.400',
      bg: 'whiteCream',
      color: 'blue',
      _hover: {
        borderColor: 'gray.500'
      },
      _invalid: {
        borderColor: 'salmon'
      },
      _focusVisible: {
        boxShadow: '0 0 16px rgba(255,252,131,0.4)'
      }
    }
  };
};

export const Input: ComponentStyleConfig = {
  variants: {
    defaultInput: defaultInput,
  },
  defaultProps: {
    size: 'md',
    variant: 'defaultInput'
  }
};
