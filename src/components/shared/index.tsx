"use client";

import PostSortPanel from "@/components/shared/PostPanel/PostSortPanel";
import { Button } from "@/components/ui/button";
import { RouterOutput, trpc } from "@/lib/utils/trpc";
import { sortPostBySchema } from "@/validation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import AddPostDialog from "./PostPanel/AddPostDialog";
import Post from "./PostPanel/Post";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

interface PostPanelProps {
    name?: string;
    followed?: boolean;
    bookmarked?: boolean;
    showCreate?: boolean;
    isProfile?: boolean;
    username?: string;
    defaultPosts: RouterOutput["post"]["getPosts"]["posts"];
}

export default function PostPanel({
    name,
    followed,
    bookmarked,
    showCreate,
    isProfile,
    username,
    defaultPosts,
}: PostPanelProps) {
    const [sortMethod, setSortMethod] =
        useState<z.infer<typeof sortPostBySchema>>("date");

    const {
        data,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
    } = trpc.post.getPosts.useInfiniteQuery(
        {
            sortMethod,
            username,
            followed,
            bookmarked,
        },
        {
            keepPreviousData: true,
            getNextPageParam: lastPage => lastPage.nextCursor,

            initialData: {
                pageParams: [undefined],
                pages: [
                    {
                        posts: defaultPosts,
                        nextCursor: undefined,
                    },
                ],
            },
        }
    );

    useEffect(() => {
        refetch();
    }, [setSortMethod, refetch]);

    const LoadButtonComponent = useMemo(() => motion(Button), []);

    return (
        <div
            className={
                isProfile
                    ? ""
                    : "no-scrollbar mx-auto flex h-full max-w-2xl flex-col overflow-y-auto overflow-x-hidden"
            }
        >
            <div className="px-2 pb-5 pt-5">
                {name && (
                    <h1 className="mb-5 text-center text-3xl font-bold">
                        {name}
                    </h1>
                )}
                <div className="flex flex-col  items-center justify-between gap-2 md:flex-row">
                    <div className="flex items-center gap-2">
                        <PostSortPanel onChange={setSortMethod} />
                        <AnimatePresence>
                            {isRefetching && <Spinner className="ml-2" />}
                        </AnimatePresence>
                    </div>

                    {showCreate && <AddPostDialog onChange={refetch} />}
                </div>
            </div>

            <div className="flex flex-col gap-5 py-5">
                <AnimatePresence initial={false} mode="popLayout">
                    {data?.pages.map(page =>
                        page.posts.map(post => (
                            <Post
                                onChange={refetch}
                                key={post.id}
                                post={post}
                            />
                        ))
                    )}
                    {hasNextPage && (
                        <LoadButtonComponent
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            loading={isFetchingNextPage}
                            onClick={() => {
                                fetchNextPage();
                            }}
                            variant="outline"
                            className="w-[16rem] self-center justify-self-center font-medium"
                        >
                            Cargar más publicaciones
                        </LoadButtonComponent>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
