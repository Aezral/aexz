"use client"
import { trpc } from '@/lib/utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import superjson from 'superjson'
export default function TrpcProvider({children}: {children:React.ReactNode}) {

    const [queryClient] = useState(()=> new QueryClient({}))
    const [trpcClient] = useState(()=> trpc.createClient    ({
        links: [
            httpBatchLink({
                url: "/api/trpc"
            })
        ],transformer: superjson
    }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </trpc.Provider>
  )
}
