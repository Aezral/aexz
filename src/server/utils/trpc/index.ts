import { TRPCError, initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { createContext } from "./createContext";
import errorFormatter from "./errorFormatter";

const t = initTRPC.context<typeof createContext>().create({
    errorFormatter(opts) {
        const { shape, error } = opts;
        return errorFormatter(shape, error);
    },
    transformer: SuperJSON
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export const loggedProcedureNoUsername = publicProcedure.use(
    middleware(async ({ ctx, next }) => {
        if (ctx.user == null) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Necesitas iniciar sesión para realizar esta acción",
            });
        }

        return next({
            ctx: {
                user: ctx.user,
            },
        });
    })
);
export const loggedProcedure = publicProcedure.use(
    middleware(async ({ ctx: { user }, next }) => {
        if (user == null) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Necesitas iniciar sesión para realizar esta acción",
            });
        }

        if (user.username == null) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message:
                    "Necesitas tener un nombre de usuario para realizar esta acción",
            });
        }

        return next({
            ctx: {
                username: user.username,
                user,
            },
        });
    })
);
