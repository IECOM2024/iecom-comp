import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure.input(z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })).mutation(async ({input}) => {
    
    // TODO: Kasih reCHAPTCHA
    const {email, password} = input;
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const hashPassword = await bcrypt.hash(password,8) 

    await prisma.user.create({
        data: {
            email,
            hashPassword,
        }
    })
  })
});
