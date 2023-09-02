import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/utils/trpc/createContext'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (request: Request) => fetchRequestHandler({
    endpoint:"/api/trpc",
    req: request,
    router: appRouter,
    createContext: createContext,
})

export { handler as GET, handler as POST }
