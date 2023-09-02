import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';

export const createContext = async ({req}: FetchCreateContextFnOptions) => {
    
    const session = await getServerSession(authOptions);

    return {
        user: session?.user
    }

}

