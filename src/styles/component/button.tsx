import type { SystemStyleFunction } from "@chakra-ui/theme-tools";
import type { ComponentStyleConfig } from "@chakra-ui/react";

const defaultButton: SystemStyleFunction = () => {
  return {
    color: "black",
    borderRadius: "20",
    bg: "white",
    border: "1px solid black",
    my: "10px",
    _hover: {
      shadow: "0 0 10px rgba(40,40,200,0.6)",
      _disabled: {
        color: "white",
        bg: "gray.400",
      },
    },
    _active: {
      shadow: "none",
    },
    _disabled: {
      color: "white",
      bg: "gray.400",
      _hover: {},
    },
  };
};

const outlineButton: SystemStyleFunction = () => {
  return {
    color: "black",
    borderWidth: "2px",
    borderColor: "black",
    bg: `gray.600`,
    borderRadius: "12",
    _hover: {
      bg: "gray.600",
      shadow: "0 0 24px rgba(255,200,4,0.6)",
      _disabled: {
        bg: "transparent",
        shadow: "none",
      },
    },
    _active: {
      bg: "rgba(47, 46, 46, 0.6)",
      shadow: "none",
    },
    _disabled: {
      color: "gray.500",
      bg: "transparent",
      borderColor: "gray.400",
    },
  };
};

const monoBlackButton: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "black",
    borderRadius: "12",
    _hover: {
      bg: "yellow.5",
      _disabled: {
        bg: "gray.400",
        shadow: "none",
      },
    },
    _active: {
      bg: "yellow.4",
      shadow: "none",
    },
    _disabled: {
      color: "white",
      bg: "gray.400",
    },
  };
};

const blueButton: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "blue",
    borderRadius: "12",
    _hover: {
      bg: "white",
      color: "blue",
      border: "1px solid",
      borderColor: "blue",
      _disabled: {
        bg: "gray.400",
        shadow: "none",
      },
    },
  };
};

const salmonOutlineButton: SystemStyleFunction = () => {
  return {
    color: "salmon",
    bg: "white",
    borderRadius: "12",
    border: "1px solid",
    borderColor: "salmon",
    _hover: {
      bg: "salmon",
      color: "white",
      _disabled: {
        bg: "gray.400",
        shadow: "none",
      },
    },
  };
};

const monoGrayButton: SystemStyleFunction = () => {
  return {
    color: "white",
    bg: "gray.600",
    borderRadius: "12",
    _hover: {
      bg: "white",
      color: "black",
      border: "1px solid black",
      _disabled: {
        bg: "gray.400",
        shadow: "none",
      },
    },
    _active: {
      bg: "yellow.4",
      shadow: "none",
    },
    _disabled: {
      color: "white",
      bg: "gray.400",
    },
  };
};

const monoOutlineButton: SystemStyleFunction = () => {
  return {
    color: "gray.500",
    borderWidth: "2px",
    borderColor: "gray.500",
    bg: `transparent`,
    borderRadius: "12",
    _hover: {
      bg: "gray.600",
      color: "white",
      _disabled: {
        bg: "transparent",
        shadow: "none",
      },
    },
    _active: {
      bg: "rgba(47, 46, 46, 0.6)",
      shadow: "none",
    },
    _disabled: {
      color: "gray.500",
      bg: "transparent",
      borderColor: "gray.400",
    },
  };
};

const noBorderButton: SystemStyleFunction = () => {
  return {
    color: "black",
    bg: `transparent`,
    borderRadius: "12",
    _hover: {
      color: "gray.600",
    },
    _active: {
      shadow: "none",
      border: "none",
    },
    _disabled: {
      color: "gray.500",
      bg: "transparent",
      borderColor: "gray.400",
    },
  };
};

export const Button: ComponentStyleConfig = {
  variants: {
    solid: defaultButton,
    outline: outlineButton,
    "mono-black": monoBlackButton,
    "mono-gray": monoGrayButton,
    "mono-outline": monoOutlineButton,
    "no-border": noBorderButton,
    blue: blueButton,
    "salmon-outline": salmonOutlineButton,
  },
  defaultProps: {
    variant: "solid",
  },
};
