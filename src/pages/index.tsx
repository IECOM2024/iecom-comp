import { UserRole } from "@prisma/client";
import styles from "./index.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { PublicLayout } from "~/components/layout/PublicLayout";
import { withSession } from "~/server/auth/withSession";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { AuthorizedRoleLayout } from "~/components/layout/AuthorizedRoleLayout";
import { Text } from "@chakra-ui/react";

export const getServerSideProps = withSession({ force: true });

export default function Home() {
  const hello = "Hello"

  const router = useRouter()
  const {data: session} = useSession()

  if (session?.user.role === UserRole.PRELIM_PARTICIPANT) {
    router.replace("/dashboard")
  }

  if (session?.user.role === UserRole.ADMIN) {
    router.replace("/admin")
  }

  return (
    <>
      <AuthorizedRoleLayout>
        <Text>
          Loading...
        </Text>
      </AuthorizedRoleLayout>
    </>
  );
}