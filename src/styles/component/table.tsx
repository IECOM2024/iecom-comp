import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { type ComponentStyleConfig } from '@chakra-ui/react';

const blackTableStyle: SystemStyleFunction = () => {
  return {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      thead: {
        bg: 'black',
        color: 'white',
        border: '1px solid',
        borderColor: 'gray.400',
        th: {
          textAlign: 'center'
        }
      },
      tbody: {
        tr: {
          td: {
            textAlign: 'center',
            padding: '0.5rem',
            border: '1px solid',

            borderColor: 'gray.400',
            color: 'black'
          }
        }
      }
    }
  };
};

export const Table: ComponentStyleConfig = {
  variants: {
    black: blackTableStyle
  },
  defaultProps: {
    variant: 'default'
  }
};
