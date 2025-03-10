import { Box, Flex, Image } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";

export interface LayoutProps {
  children: React.ReactNode;
  type?: "signin" | "signup";
  title?: string;
  isNoFooter?: boolean;
}

export interface ProtectedLayoutProps extends LayoutProps {
  session?: Session | null;
}

export function BaseLayout({ children, type, title, isNoFooter }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ?? "IECOM 2024"}</title>
      </Head>
      <Flex flexDir="column" bg="cream" bgSize="100vw auto" minH="100vh">
        
        <Navbar type={type} title={title} />
        <Box pos="relative" zIndex="1" mt="4em">
          {children}
        </Box>
        <Box h="100vh" pos="absolute" w="100%" top="0" />
        {/*!isNoFooter && <Footer /> */}
      </Flex>
    </>
  );
}
