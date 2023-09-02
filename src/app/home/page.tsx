import { Metadata } from "next";
import PostPanel from "../../components/shared/PostPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getServerClient from "@/server/utils/trpc/getServerClient";



export const metadata: Metadata = {
    title: "Inicio",
    
  
};

export default async function Home() {
    const session = await getServerSession(authOptions);
    const {posts} = await getServerClient(session).post.getPosts({});

    return (
        <>
            <PostPanel showCreate name="Inicio" defaultPosts={posts} />
         </>
    );

    // const { data: session } = useSession();

    // if (session) {
    //     return (
    //         <>
    //             Signed in as {session.user?.name ?? session.user?.email} <br />
    //             <button onClick={() => signOut()}>Sign out</button>
    //         </>
    //     );
    // }
    // return (
    //     <>
    //         Not signed in <br />
    //         <button onClick={() => signIn()}>Sign in</button>
    //     </>
    // );
}
