import { Box, Flex, FlexProps, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export const TimelineCard = ({
  title,
  date,
  top,
  left,
  isLower = false,
  linkTo,
  ...props
}: FlexProps & {
  linkTo?: string;
  title: string;
  date: string;
  isLower?: boolean;
}) => {
  return (
    <Flex
      direction="column"
      {...props}
      width={{ base: "10em", md: "20em" }}
      alignItems="center"
      gap={{ base: "1rem", md: "0" }}
      fontSize={{ base: "md", lg: "lg" }}
    >
      <VStack spacing={0} align="center">
        {linkTo ? (
          <Link href={linkTo}>
            <Text
              fontSize={fontSizes.md}
              fontWeight="semibold"
              color="blue"
              fontFamily="body"
              w="100%"
              textAlign="center"
            >
              {date}
            </Text>
          </Link>
        ) : (
          <Text
            fontSize={fontSizes.md}
            fontWeight="semibold"
            color="blue"
            fontFamily="body"
            w="100%"
            textAlign="center"
          >
            {date}
          </Text>
        )}

        <Box bg="blue" h="1px" w="80%" mx="auto" mt="0.2em" mb="1em" />
        <Text
          fontSize={fontSizes.base}
          color="blue"
          fontFamily="heading"
          h="3em"
          textAlign="center"
          w="100%"
        >
          {title}
        </Text>
        <Flex
          borderRadius="50%"
          height={{ base: "2rem", md: "3.5rem" }}
          width={{ base: "2rem", md: "3.5rem" }}
          bg={"white"}
          pos="relative"
          zIndex={1}
          mt="1em"
          border="5px solid"
          borderColor="blue"
          mx="auto"
        />
      </VStack>
    </Flex>
  );
};

const fontSizes = {
  xs: {
    base: "0.75rem",
    md: "1rem",
  },
  sm: {
    base: "0.875rem",
    md: "1.25rem",
  },
  base: {
    base: "1rem",
    md: "1.5rem",
  },
  md: {
    base: "1.15rem",
    md: "2rem",
  },
  lg: {
    base: "1.25rem",
    md: "2.5rem",
  },
  xl: {
    base: "1.5rem",
    md: "3rem",
  },
  xxl: {
    base: "1.75rem",
    md: "3.5rem",
  },
  xxxl: {
    base: "2rem",
    md: "4rem",
  },
};

const paddings = {
  xs: {
    base: ".75rem",
    md: "1rem",
  },
  sm: {
    base: "1rem",
    md: "2rem",
  },
  base: {
    base: "1.25rem",
    md: "3.5rem",
  },
  md: {
    base: "1.5rem",
    md: "4rem",
  },
  lg: {
    base: "1.75rem",
    md: "5rem",
  },
  xl: {
    base: "2rem",
    md: "6rem",
  },
  xxl: {
    base: "2.25rem",
    md: "7rem",
  },
  xxxl: {
    base: "2.5rem",
    md: "9rem",
  },
};
