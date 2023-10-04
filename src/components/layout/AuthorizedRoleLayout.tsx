import { useRouter } from "next/router";
import { BaseLayout, ProtectedLayoutProps } from "./base-components/BaseLayout";
import { useEffect, useState } from "react";

export const AuthorizedRoleLayout = ({
  children,
  type,
  session,
}: ProtectedLayoutProps) => {
  const router = useRouter();

  useEffect(() => {
    authCheck();
  }, []);

  const authCheck = () => {
    if (!session) {
      void router.push("/");
    }
  };

  return <BaseLayout>{ children }</BaseLayout>;
};
