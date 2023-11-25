import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;

    if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

    const user = await ctx.prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const profile = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      image: user ? user.image: ""
    };

    return profile;
  }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: input.name ?? user.name,
          email: input.email ?? user.email,
          image: input.image ?? user.image,
        },
      });

      return updatedUser;
    }),
});
