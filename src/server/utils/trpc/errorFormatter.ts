import { DefaultErrorShape, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

export default function errorFormatter(
    shape: DefaultErrorShape,
    error: TRPCError
) {
    if (error.cause instanceof ZodError) {
        return {
            ...shape,
            message: error.cause.issues[0]?.message ?? "Error de validación",
        };
    }

    if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(error.cause);

        return {
            ...shape,
            data: {},
            message: "Error interno del servidor",
        };
    }

    return {
        ...shape,
    };
}
