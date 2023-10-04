import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import type { ComponentStyleConfig } from '@chakra-ui/react';

const defaultButton: SystemStyleFunction = () => {
  return {
    color: 'white',
    borderRadius: '12',
    bg: 'black',
    _hover: {
      bg: 'rgba(47, 46, 46,1)',
      shadow: '0 0 24px rgba(255,200,4,0.6)',
      _disabled: {
        bg: 'gray.400',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'rgba(80, 80, 80,1)',
      shadow: 'none'
    },
    _disabled: {
      color: 'white',
      bg: 'gray.400'
    }
  };
};

const outlineButton: SystemStyleFunction = () => {
  return {
    color: 'black',
    borderWidth: '2px',
    borderColor: 'black',
    bg: `gray.600`,
    borderRadius: '12',
    _hover: {
      bg: 'gray.600',
      shadow: '0 0 24px rgba(255,200,4,0.6)',
      _disabled: {
        bg: 'transparent',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'rgba(47, 46, 46, 0.6)',
      shadow: 'none'
    },
    _disabled: {
      color: 'gray.500',
      bg: 'transparent',
      borderColor: 'gray.400'
    }
  };
};

const monoBlackButton: SystemStyleFunction = () => {
  return {
    color: 'white',
    bg: 'black',
    borderRadius: '12',
    _hover: {
      bg: 'yellow.5',
      _disabled: {
        bg: 'gray.400',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'yellow.4',
      shadow: 'none'
    },
    _disabled: {
      color: 'white',
      bg: 'gray.400'
    }
  };
};

const monoGrayButton: SystemStyleFunction = () => {
  return {
    color: 'white',
    bg: 'gray.600',
    borderRadius: '12',
    _hover: {
      bg: 'white',
      color: 'black',
      border: '1px solid black',
      _disabled: {
        bg: 'gray.400',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'yellow.4',
      shadow: 'none'
    },
    _disabled: {
      color: 'white',
      bg: 'gray.400'
    }
  };
};

const monoOutlineButton: SystemStyleFunction = () => {
  return {
    color: 'gray.500',
    borderWidth: '2px',
    borderColor: 'gray.500',
    bg: `transparent`,
    borderRadius: '12',
    _hover: {
      bg: 'gray.600',
      color: 'white',
      _disabled: {
        bg: 'transparent',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'rgba(47, 46, 46, 0.6)',
      shadow: 'none'
    },
    _disabled: {
      color: 'gray.500',
      bg: 'transparent',
      borderColor: 'gray.400'
    }
  };
};

export const Button: ComponentStyleConfig = {
  variants: {
    solid: defaultButton,
    outline: outlineButton,
    'mono-black': monoBlackButton,
    'mono-gray': monoGrayButton,
    'mono-outline': monoOutlineButton
  },
  defaultProps: {
    variant: 'solid'
  }
};
