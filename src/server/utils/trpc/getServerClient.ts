import { appRouter } from "@/server/routers/_app";
import { Session } from "next-auth";

export default function getServerClient(session: Session|null){
    return appRouter.createCaller({
        user: session?.user
    })
}