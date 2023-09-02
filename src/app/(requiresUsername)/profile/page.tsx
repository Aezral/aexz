import getServerClient from "@/server/utils/trpc/getServerClient";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import ProfilePanel from "./components/ProfilePanel";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
    title: "Perfil",
};

export default async function Profile() {
    const session = await getServerSession(authOptions);

    const serverClient = getServerClient(session);

    const user = await serverClient.user.get({});

    const { posts } = await serverClient.post.getPosts({
        username: user!.username!,
    });

    return user != null ? (
        <ProfilePanel defaultPosts={posts} defaultUser={user} />
    ) : (
        redirect("/login")
    );
}
