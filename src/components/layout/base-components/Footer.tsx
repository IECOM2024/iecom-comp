import { Flex, Image, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Flex
      bg="cream"
      w="100%"
      h="auto"
      justifyContent="space-between"
      alignItems="center"
      fontFamily="heading"
      fontSize="xl"
      fontWeight="bold"
      color="black"
      py="3em"
      px="2em"
      zIndex="10"
    >
      <Image src="main-icon.webp" alt="IECOM 2024" w="auto" h="6em" />
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        <Text>IECOM 2024</Text>
        <Text>IECOM 2024</Text>
      </Flex>
    </Flex>
  );
};
