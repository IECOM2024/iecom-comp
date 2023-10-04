import {
  Box,
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export const PasswordInput = (props: InputProps) => {
  const { isOpen: isVisible, onToggle: toggleVisibility } = useDisclosure();

  const { value, onChange, placeholder, ...rest } = props;

  return (
    <InputGroup {...rest}>
      <Input
        value={value}
        onChange={onChange}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
      />
      <InputRightElement>
        <Box
          onClick={toggleVisibility}
          color="black"
          _hover={{ color: "gray.600" }}
          fontSize="2xl"
          cursor="pointer"
        >
          {isVisible ? <MdVisibilityOff /> : <MdVisibility />}
        </Box>
      </InputRightElement>
    </InputGroup>
  );
};
