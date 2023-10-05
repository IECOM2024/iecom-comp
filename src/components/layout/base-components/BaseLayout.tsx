import { Box, Flex, Image } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Footer } from "./Footer";

export interface LayoutProps {
  children: React.ReactNode;
  type?: "signin" | "signup";
  title?: string;
}

export interface ProtectedLayoutProps extends LayoutProps {
  session: Session | null;
}

export function BaseLayout({ children, type, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ?? "IECOM 2024"}</title>
      </Head>
      <Flex flexDir="column" bgImage="texture.webp">
        <Navbar type={type} />
        <Box pos="relative" zIndex="1" mt="4em">
          {children}
        </Box>

        <Footer />
      </Flex>
    </>
  );
}
