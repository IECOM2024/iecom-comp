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

interface NavbarProps {
  type?: "signin" | "signup";
}

export const Navbar = ({ type }: NavbarProps) => {
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
      justifyContent="space-between"
      px={{ base: "0.5em", md: "2em" }}
      py="2em"
      alignItems="center"
      fontFamily="heading"
      position="fixed"
      top="0"
      zIndex="1000"
      h={{ base: "5em", md: "4em" }}
      w="100%"
      bg={isMobile ? "white" : "rgba(255, 255, 255, 0.7)"}
    >
      <Flex
        onClick={() => router.push("/")}
        cursor="pointer"
        w="10em"
        justifyContent="space-between"
        alignItems="center"
      >
        <Image
          src="/main-icon.webp"
          alt=""
          w="3.5em"
          ml={{ base: "0.5em", md: "5.5em" }}
        />
      </Flex>
      <Flex
        w="min(35em,60%)"
        justifyContent={{ base: "right", md: "space-around" }}
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
  const eventHoverMenu = useHoverMenu();
  const compeHoverMenu = useHoverMenu();

  return (
    <>
      <Menu isOpen={eventHoverMenu.isOpen}>
        <MenuButton
          as={Button}
          variant="no-border"
          color="blue"
          fontWeight="bold"
          {...eventHoverMenu.mouseProps}
        >
          EVENT
        </MenuButton>
        <MenuList
          bg="white"
          flexDir="column"
          display="flex"
          mt="0.5em"
          {...eventHoverMenu.menuListProps}
        >
          <Button
            variant="no-border"
            onClick={() => router.push("/pre-event")}
            color="blue"
            fontWeight="bold"
          >
            Pre-Event
          </Button>
          <Button
            variant="no-border"
            onClick={() => router.push("/student-summit")}
            color="blue"
            fontWeight="bold"
          >
            Student Summit
          </Button>
        </MenuList>
      </Menu>
      <Menu isOpen={compeHoverMenu.isOpen}>
        <MenuButton
          as={Button}
          variant="no-border"
          color="blue"
          fontWeight="bold"
          {...compeHoverMenu.mouseProps}
        >
          COMPETITION
        </MenuButton>
        <MenuList
          flexDir="column"
          display="flex"
          mt="0.5em"
          {...compeHoverMenu.menuListProps}
        >
          <Button
            variant="no-border"
            onClick={() => router.push("/essay-competition")}
            color="blue"
            fontWeight="bold"
          >
            Essay Competition
          </Button>
          <Button
            variant="no-border"
            onClick={() => router.push("/case-competition")}
            color="blue"
            fontWeight="bold"
          >
            Case Competition
          </Button>
        </MenuList>
      </Menu>
      {!!session ? (
        <Menu>
          <MenuButton>
            {session.user.name
              ? `Hello, ${session.user.name.split(" ")[0]}`
              : "Hello"}
          </MenuButton>
          <MenuList border="1px solid gray">
            <Flex
              flexDirection="column"
              alignItems="center"
              px="0.7em"
              py="0.5em"
            >
              {session.user.role === "ADMIN" && (
                <>
                  <Button
                    variant="no-border"
                    onClick={() => router.push("/admin/color-run")}
                  >
                    Color Run Admin
                  </Button>
                  <Button
                    variant="no-border"
                    onClick={() => router.push("/admin/essay-competition")}
                  >
                    Essay Competition Admin
                  </Button><Button
                    variant="no-border"
                    onClick={() => router.push("/admin/case-competition")}
                  >
                    Case Competition Admin
                  </Button>
                  <Box bg="black" w="80%" m="auto" h="1px" my="1em" />
                </>
              )}

              <Button onClick={() => router.push("/profile")}>Profile</Button>
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
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Text>Event</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Flex flexDir="column">
                  <Button
                    variant="no-border"
                    onClick={() => router.push("/pre-event")}
                  >
                    Pre-Event
                  </Button>
                  <Button
                    variant="no-border"
                    onClick={() => router.push("/student-summit")}
                  >
                    Student Summit
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Text>Competition</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Flex flexDir="column">
                  <Button
                    variant="no-border"
                    onClick={() => router.push("/essay-competition")}
                  >
                    Essay Competition
                  </Button>
                  <Button
                    variant="no-border"
                    onClick={() => router.push("/case-competition")}
                  >
                    Case Competition
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Box h="1px" w="90%" m="auto" my="1em" bg="black" />

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
