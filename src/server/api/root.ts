import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { storageRouter } from "./routers/storage";
import { profileRouter } from "./routers/profile";
import { PrelimRouter } from "./routers/prelim";
import { ExamRouter } from "./routers/exam";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  storage: storageRouter,
  profile: profileRouter,
  prelim: PrelimRouter,
  exam: ExamRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
