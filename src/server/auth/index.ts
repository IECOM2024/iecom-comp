import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  DefaultUser,
} from "next-auth";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      role: UserRole;
    };
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: env.SESSION_MAXAGE,
    secret: env.JWT_SECRET,
  },

  callbacks: {
    session: async ({ session, token, trigger }) => {
      const payload = {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };

      return payload;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No credentials",
          });
        const { email, password } = credentials;
        if (!email || !password)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email or password is missing",
          });

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No user found",
          });
          console.log(user)
        if (!user.hashPassword)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No user found, please contact support",
          });

        const isAuth = await compare(password, user?.hashPassword);

        if (!isAuth)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Wrong password",
          });
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/404",
  },
  secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
