import { Metadata } from "next";
import PostPanel from "../../../components/shared";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import getServerClient from "@/server/utils/trpc/getServerClient";
export const metadata: Metadata = {
    title: "Guardados",
};

export default async function Home() {
    const session = await getServerSession(authOptions);
    const { posts } = await getServerClient(session).post.getPosts({
        followed: true,
    });

    return (
        <>
            <PostPanel followed defaultPosts={posts} name="Seguidos" />
        </>
    );
}
