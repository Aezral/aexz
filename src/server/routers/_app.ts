import { router } from "../utils/trpc";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = router({
    user: userRouter,
    post: postRouter
})

export type AppRouter = typeof appRouter
