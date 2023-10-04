import { Flex } from "@chakra-ui/react";
import { Navbar } from "./Navbar";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export interface LayoutProps {
  children: React.ReactNode;
  type?: "signin" | "signup";
}

export interface ProtectedLayoutProps extends LayoutProps {
  session: Session | null;
}

export function BaseLayout({ children, type }: LayoutProps) {
  return (
    <Flex flexDir="column" w="100vw" overflowX="hidden">
      <Navbar type={type} />
      {children}
    </Flex>
  );
}



