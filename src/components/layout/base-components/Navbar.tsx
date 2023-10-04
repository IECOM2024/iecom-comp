import { Box, Button, Flex, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface NavbarProps {
  type?: "signin" | "signup";
}

export const Navbar = ({ type }: NavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Flex
      justifyContent="space-between"
      px="2em"
      py="0.5em"
      alignItems="center"
      mb="1em"
    >
      <Text onClick={() => router.push("/")}> Hello </Text>
      {!!session ? (
        <Menu>
            <MenuButton>{session.user.name ? `Hello, ${session.user.name.split(' ')[0]}` : "Hello" }</MenuButton>
            <MenuList>
                <Button onClick={() => router.push('/profile')}>Profile</Button>
                <Button onClick={() => router.push('/api/auth/signout')}>Sign Out</Button>
            </MenuList>
        </Menu>
      ) : type !== "signin" ? (
        <Button onClick={() => signIn()}> Sign In </Button>
      ) : (
        <Box />
      )}
    </Flex>
  );
};
