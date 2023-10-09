import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const prelimAttendanceRouter = createTRPCRouter({
  admin: createTRPCRouter({
    getAllPrelimAttendance: adminProcedure.query(async ({ ctx }) => {
      const session = ctx.session;

      if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

      const prelimAttendance = await ctx.prisma.prelimAttendance.findMany();

      return prelimAttendance;
    }),

    pauseAttendance: adminProcedure
      .input(
        z.object({
          prelimAttendanceId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = ctx.session;

        if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

        const prelimAttendance = await ctx.prisma.prelimAttendance.findUnique({
          where: { id: input.prelimAttendanceId },
        });

        if (!prelimAttendance) throw new TRPCError({ code: "UNAUTHORIZED" });

        const updatedprelimAttendance = await ctx.prisma.prelimAttendance.update({
          where: { id: input.prelimAttendanceId },
          data: {
            status: "PAUSED",
          },
        });

        return updatedprelimAttendance;
      }),

    continueAttendance: adminProcedure
      .input(
        z.object({
          prelimAttendanceId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = ctx.session;

        if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

        const prelimAttendance = await ctx.prisma.prelimAttendance.findUnique({
          where: { id: input.prelimAttendanceId },
        });

        if (!prelimAttendance) throw new TRPCError({ code: "UNAUTHORIZED" });

        const updatedprelimAttendance = await ctx.prisma.prelimAttendance.update({
          where: { id: input.prelimAttendanceId },
          data: {
            status: "TAKEN",
          },
        });

        return updatedprelimAttendance;
      }),
  })
});
