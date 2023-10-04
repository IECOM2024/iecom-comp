import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react";
import { SignUp } from "~/components/SignUp";
import { PublicLayout } from "~/components/layout/PublicLayout";

export default function Signup({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <PublicLayout>
      <SignUp csrfToken={csrfToken || ""} />
    </PublicLayout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken: csrfToken ?? null },
  };
};
