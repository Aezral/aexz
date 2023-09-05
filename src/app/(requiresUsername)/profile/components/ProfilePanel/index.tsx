"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RouterOutput, trpc } from "@/lib/utils/trpc";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import PostPanel from "@/components/shared";

interface ProfilePanelProps {
    asOwn?: boolean;
    defaultUser: NonNullable<RouterOutput["user"]["get"]>;
    username?: string;

    defaultPosts: RouterOutput["post"]["getPosts"]["posts"];
}

export default function ProfilePanel({
    asOwn,
    defaultUser,
    username,
    defaultPosts,
}: ProfilePanelProps) {
    const session = useSession();

    const [isSameUser, setIsSameUser] = useState(
        session.data?.user?.username === defaultUser.username
    );

    const { data, refetch } = trpc.user.get.useQuery(
        {
            username,
        },
        {
            initialData: defaultUser,
            keepPreviousData: true,
        }
    );

    const { mutateAsync: setFollowState, isLoading } =
        trpc.user.setFollowState.useMutation();

    useEffect(() => {
        if (!data || !session.data?.user) return;

        if (data.username === session.data.user.username) {
            setIsSameUser(true);
        } else {
            setIsSameUser(false);
        }
    }, [data, session]);

    return (
        <div className="no-scrollbar mx-auto h-full max-w-2xl overflow-y-auto pt-16 md:pt-36">
            {data && (
                <>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={data?.image ?? undefined}
                                alt="Vista previa"
                            ></AvatarImage>
                            <AvatarFallback>
                                {data?.name
                                    ? data.name[0].toUpperCase()
                                    : data?.username
                                    ? data.username[0].toUpperCase()
                                    : ""}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-bold">
                                {data.name ?? data.username}
                            </h1>
                            <h2 className="font- text-lg">@{data.username}</h2>
                        </div>
                        {!isSameUser &&
                            (data.isFollowing ? (
                                <Button
                                    key="dejar de seguir"
                                    onClick={async () => {
                                        await setFollowState({
                                            username:
                                                defaultUser.username as string,
                                            followState: false,
                                        });
                                        refetch();
                                    }}
                                    variant="outline"
                                    className="ml-5 w-[9rem]"
                                >
                                    Dejar de seguir
                                </Button>
                            ) : data.hasFollowRequest ? (
                                <Button
                                    key="cancelar"
                                    onClick={async () => {
                                        await setFollowState({
                                            username:
                                                defaultUser.username as string,
                                            followState: false,
                                        });
                                        refetch();
                                    }}
                                    variant="outline"
                                    className="ml-5 w-[18rem]"
                                >
                                    Cancelar solicitud
                                </Button>
                            ) : (
                                <Button
                                    key="seguir"
                                    onClick={async () => {
                                        await setFollowState({
                                            username:
                                                defaultUser.username as string,
                                            followState: true,
                                        });
                                        refetch();
                                    }}
                                    className="ml-5 w-[6rem]"
                                >
                                    Seguir
                                </Button>
                            ))}
                    </div>
                    <p className="mb-3 ml-12 mt-7">
                        {data.description ?? "Sin descripción"}
                    </p>
                    <div className="mb-3 ml-12 mt-6 flex gap-6">
                        <div>
                            <span className="font-bold">{data.following}</span>{" "}
                            seguidos
                        </div>
                        <div>
                            <span className="font-bold">{data.followers}</span>{" "}
                            seguidores
                        </div>
                    </div>
                    <Separator className="my-6"></Separator>
                    <PostPanel
                        defaultPosts={defaultPosts}
                        username={data.username!}
                        isProfile
                    ></PostPanel>
                </>
            )}
        </div>
    );
}
