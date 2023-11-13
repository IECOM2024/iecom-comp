import { Flex, Spinner, Text } from "@chakra-ui/react";
import { PublicLayout } from "../layout/PublicLayout";

export const Loading = () => {
  return (
    <PublicLayout>
      <Flex
        bg="whiteCream"
        w="min(40em,90%)"
        mx="auto"
        mt="1em"
        fontSize="3xl"
        color="blue"
        flexDir="column"
        borderRadius="20px"
        py="5em"
        mb="70vh"
      >
        <Spinner color="blue" mx="auto" size="2em" thickness="3px" />
        <Text textAlign="center" mx="auto" mt="1em" fontSize={{base: "xl",md: "3xl"}} fontWeight="bold">
          Loading...
        </Text>
      </Flex>
    </PublicLayout>
  );
};
