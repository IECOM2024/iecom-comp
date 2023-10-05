import { useRouter } from "next/router";
import { BaseLayout, ProtectedLayoutProps } from "./base-components/BaseLayout";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";

export const AdminRoleLayout = ({
  children,
  type,
  session,
}: ProtectedLayoutProps) => {
  const router = useRouter();
  
  

  return <BaseLayout>{ children }</BaseLayout>;
};
