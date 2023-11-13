import { Flex, Icon, Image, Text } from "@chakra-ui/react";
import { mdiInstagram } from "@mdi/js";
import { useRouter } from "next/router";
import { MdCamera, MdCameraFront, MdPhotoCamera } from "react-icons/md";
import { AiOutlineInstagram } from "react-icons/ai";
import { LuAtSign } from "react-icons/lu";

export const Footer = () => {
  const router = useRouter();

  return (
    <Flex
      bg="cream"
      w="100%"
      h="auto"
      justifyContent="space-between"
      alignItems="center"
      fontFamily="heading"
      fontSize={{ base: "md", md: "xl" }}
      fontWeight="bold"
      color="black"
      py="3em"
      px="2em"
      zIndex="10"
    >
      <Image src="/main-icon.webp" alt="IECOM 2024" w="auto" h="6em" />
      <Flex
        flexDir="column"
        w="15em"
        fontFamily="heading"
      >
        <Text fontWeight="bold" textAlign="left" w="100%" h="3rem">
          {" "}
          Contact us:{" "}
        </Text>

        <Flex
          w="10rem"
          onClick={() => router.push("https://www.instagram.com/iecom2024")}
          alignItems="center"
        >
          <AiOutlineInstagram size="2rem" />
          <Text> iecom2024</Text>
        </Flex>
        <Flex w="10rem" h="2rem">
          <LuAtSign size="2rem" />
          <Text>support@iecom11th.com</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
