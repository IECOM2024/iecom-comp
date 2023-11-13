import { Flex, FlexProps, FlexboxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const ContentCard = ({
  children,
  ...props
}: { children: ReactNode } & FlexProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      w="min(55em,90%)"
      borderRadius="10px"
      bg="whiteCream"
      mx="auto"
      mt="1em"
      mb="80vh"
      p="1em"
      {...props}
    >
      {children}
    </Flex>
  );
};
