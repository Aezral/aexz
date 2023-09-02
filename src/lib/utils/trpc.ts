import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@/server/routers/_app';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>({
    
})

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;