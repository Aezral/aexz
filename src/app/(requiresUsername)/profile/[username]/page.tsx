import getServerClient from "@/server/utils/trpc/getServerClient";
import { getServerSession } from "next-auth";

import { Metadata } from "next";

import ProfilePanel from "../components/ProfilePanel";

import UserNotFound from "../components/UserNotFound";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
    title: "Perfil",
};

export default async function Profile({
    params: { username },
}: {
    params: {
        username: string;
    };
}) {
    const session = await getServerSession(authOptions);

    const serverClient = getServerClient(session);

    if (session?.user?.username === username) {
        return redirect("/profile");
    }

    const user = await serverClient.user.get({
        username,
    });

    const { posts } = await serverClient.post.getPosts({
        username: user!.username!,
    });

    return user != null ? (
        <ProfilePanel
            defaultPosts={posts}
            defaultUser={user}
            username={username}
        />
    ) : (
        <UserNotFound />
    );
}
