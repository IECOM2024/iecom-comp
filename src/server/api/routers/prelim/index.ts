import { createTRPCRouter } from "../../trpc";
import { prelimAttendanceRouter } from "./attendance";
import { prelimSiteRouter } from "./site";

export const PrelimRouter = createTRPCRouter({
    attendance: prelimAttendanceRouter,
    site: prelimSiteRouter
})