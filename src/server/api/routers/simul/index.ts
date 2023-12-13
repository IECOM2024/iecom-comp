import { createTRPCRouter } from "../../trpc";
import { simulSiteRouter } from "./site";

export const simulRouter = createTRPCRouter({
    site: simulSiteRouter,
})