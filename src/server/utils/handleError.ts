import { ZodError } from "zod";

export default function handleError(error: unknown): Response {
    if (error instanceof ZodError) {
        return new Response(
            JSON.stringify(error.issues.map((issue) => issue.message)),
            {
                status: 400,
            }
        );
    }

    // Default Error (Unknown Internal Server Error);

    

    return new Response("Error desconocido", {
        status: 500,
    });
}
