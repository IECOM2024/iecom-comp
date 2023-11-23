import { useRouter } from "next/router";
import { BaseLayout, ProtectedLayoutProps } from "./base-components/BaseLayout";
import { useEffect, useState } from "react";
import { CheckAuth } from "./CheckAuth";

export const AuthorizedRoleLayout = ({
  children,
  type,
  session,
  isNoFooter,
  title
}: ProtectedLayoutProps) => {
  return (
    <CheckAuth>
      <BaseLayout type={type} isNoFooter={isNoFooter} title={title}>{children}</BaseLayout>
    </CheckAuth>
  );
};
