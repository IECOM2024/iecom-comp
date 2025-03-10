import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MdArrowDropDown, MdReorder } from "react-icons/md";
import { useEffect, useState } from "react";
import { useHoverMenu } from "~/utils/hooks/useHoverMenu";
import { SignOutBtn } from "./SignOutBtn";
import { Heading } from "@chakra-ui/react";

interface NavbarProps {
  type?: "signin" | "signup";
  title?: string;
}

export const Navbar = ({ type, title }: NavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const isMobile = useMediaQuery("(max-width: 600px)")[0];

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY / 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Flex
      px={{ base: "0.5em", md: "2em" }}
      py="2em"
      alignItems="center"
      fontFamily="heading"
      position="fixed"
      top="0"
      zIndex="1000"
      h={{ base: "5em", md: "4em" }}
      w="100%"
      bg={isMobile ? "white" : "rgba(255, 255, 255, 1)"}
      justifyContent="space-between"
    >
      <Box/>
      <Heading fontSize="2rem" color="blue" fontFamily="Arial" textAlign="left">
        {title ? title : " "}
      </Heading>
      <Flex
        w="min(35em,60%)"
        justifyContent={{ base: "right" }}
        alignItems="center"
      >
        {!isMobile ? (
          <ButtonGroupDesktop session={session} router={router} type={type} />
        ) : (
          <ButtonGroupMobile session={session} router={router} type={type} />
        )}
      </Flex>
    </Flex>
  );
};

interface ButtonGroupProps {
  session: ReturnType<typeof useSession>["data"];
  router: ReturnType<typeof useRouter>;
  type?: "signin" | "signup";
}

const ButtonGroupDesktop = ({ session, router, type }: ButtonGroupProps) => {
  return (
    <>
      {!!session ? (
        <Menu>
          <MenuButton>
            {session.user.name
              ? `Logged in as ${session.user.name}`
              : "Not logged in"}
          </MenuButton>
          <MenuList border="1px solid gray">
            <Flex
              flexDirection="column"
              alignItems="center"
              px="0.7em"
              py="0.5em"
            >
              {session.user.role === "ADMIN" && <></>}
              <SignOutBtn />
            </Flex>
          </MenuList>
        </Menu>
      ) : type !== "signin" ? (
        <Button onClick={() => signIn(undefined, { callbackUrl: "/" })}>
          {" "}
          Sign In{" "}
        </Button>
      ) : (
        <Box />
      )}
    </>
  );
};

const ButtonGroupMobile = ({ session, router, type }: ButtonGroupProps) => {
  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          variant="no-border"
          display="flex"
          justifyContent="right"
        >
          <MdReorder size="2.5em" />
        </MenuButton>
        <MenuList display="flex" flexDir="column" w="100vw">
          {!!session ? (
            <>
              <Button onClick={() => router.push("/profile")}>Profile</Button>
              <SignOutBtn />
            </>
          ) : (
            <Button onClick={() => signIn(undefined, { callbackUrl: "/" })}>
              Sign In
            </Button>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
