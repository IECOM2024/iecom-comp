import { useRouter } from "next/router";
import { BaseLayout, ProtectedLayoutProps } from "./base-components/BaseLayout";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Loading } from "../common/Loading";

export const AdminRoleLayout = ({ children, type, isNoFooter }: ProtectedLayoutProps) => {
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (session?.user.role !== UserRole.ADMIN) {
    signOut()
  }

  return <BaseLayout isNoFooter={isNoFooter}>{children}</BaseLayout>;
};
