import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        username?: string | null;
    }

    interface Session extends DefaultSession {
        user?: {
            id: string
            name?: string | null;
            email?: string | null;
            image?: string | null;
            username?: string | null;

        };
    }
}
