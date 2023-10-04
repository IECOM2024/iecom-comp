/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from ".";
import { UserRole } from "@prisma/client";

type WithSessionParams<T extends boolean> = {
  force?: T;
  handler?: (
    ctx: GetServerSidePropsContext,
    session: T extends true ? Session : Session | null
  ) => Promise<GetServerSidePropsResult<any>>;
};

export function withSession<T extends boolean>({
  force = false as T,
  handler,
}: WithSessionParams<T> = {}): GetServerSideProps {
  const fn = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
      if (force) {
        return {
          redirect: {
            destination: `/signin${
              ctx.req.url ? "?callbackUrl=" + ctx.req.url : ""
            }`,
            permanent: false,
          },
        };
      }

      return { props: { session: {
        user: {
          name: null,
          email: null,
          image: null,
          role: null,
        },
        expires: null,
      } } };
    }

    if (handler) {
      const result = await handler(ctx, session!);
      if ("props" in result) {
        const props = await result.props;
        return {
          ...result,
          props: {
            session,
            ...props,
          },
        };
      } else return result;
    }

    session.user.role = session.user.role || null
    session.user.image = session.user.image || null

    return { props: { session } };
  };
  return fn;
}
