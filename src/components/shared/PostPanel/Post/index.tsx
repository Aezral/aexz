"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import formatDate from "@/lib/utils/formatDate";
import { RouterOutput, trpc } from "@/lib/utils/trpc";
import {
    IconBookmark,
    IconBookmarkFilled,
    IconThumbUp,
    IconThumbUpFilled,
    IconX,
} from "@tabler/icons-react";
import { TRPCError } from "@trpc/server";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormGeneralMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../../Spinner";

interface PostProps {
    post: RouterOutput["post"]["getPosts"]["posts"][number];
    onChange: () => unknown | Promise<unknown>;
    loading?:boolean
}

const Post = React.forwardRef<HTMLDivElement, PostProps>(
    ({ post, onChange, loading}, ref) => {
        const session = useSession();

        const router = useRouter();

        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

        const { mutateAsync: changeLikeState, isLoading: isLikeLoading } =
            trpc.post.setLikeState.useMutation();

        const {
            mutateAsync: changeBookmarkState,
            isLoading: isBookmarkLoading,
        } = trpc.post.setBookmarkState.useMutation();

        const {
            mutateAsync: deletePost,
            isLoading: isDeleting,
            error: deleteError,
        } = trpc.post.delete.useMutation();

        const Component = useMemo(() => motion(Card), []);

        return (
            <Component
                ref={ref}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={post.id}
            >
                <div className="mb-5 ml-5 mt-5 flex items-center">
                    <Avatar className="mr-2">
                        <AvatarFallback>
                            {post.author.username![0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    @
                    <Link
                        href={`/profile/${post.author.username}`}
                        className="mr-2 hover:underline"
                    >
                        {post.author.username}
                    </Link>
                    • {formatDate(post.creationDate)}
                </div>
                {post.title && (
                    <CardHeader className="-mt-5">
                        <CardTitle>{post.title}</CardTitle>
                    </CardHeader>
                )}
                <CardContent>
                    <p className="truncate">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                        <Button
                            className="mr-0"
                            variant="ghost"
                            onClick={async () => {
                                try {
                                    if (!session.data?.user) {
                                        return router.push("/login");
                                    }
                                    await changeLikeState({
                                        postId: post.id,
                                        likeState: !post.isLiked,
                                    });

                                    onChange();
                                } catch (err) {
                                    if (err instanceof TRPCError) {
                                        toast.error(err.message);
                                    }
                                }
                            }}
                        >
                            {isLikeLoading ? (
                                <Spinner />
                            ) : post.isLiked ? (
                                <IconThumbUpFilled className="text-primary" />
                            ) : (
                                <IconThumbUp></IconThumbUp>
                            )}
                            <span className="ml-3">{post.likes}</span>
                        </Button>

                        {session.data?.user && (
                            <Button
                                variant="ghost"
                                onClick={async () => {
                                    if (!session.data?.user) {
                                        return router.push("/login");
                                    }

                                    try {
                                        await changeBookmarkState({
                                            postId: post.id,
                                            bookmarkState: !post.isBookmarked,
                                        });

                                        onChange();
                                    } catch (err) {
                                        if (err instanceof TRPCError) {
                                            toast.error(err.message);
                                        }
                                    }
                                }}
                            >
                                {isBookmarkLoading ? (
                                    <Spinner />
                                ) : !post.isBookmarked ? (
                                    <IconBookmark />
                                ) : (
                                    <IconBookmarkFilled className="text-primary" />
                                )}
                            </Button>
                        )}
                        {/* {!loading && <Spinner className="inline" />} */}
                        
                    </div>
                    
                    {session.data?.user?.username != null &&
                        session.data?.user?.username ===
                            post.author.username && (
                            <Dialog
                                open={deleteDialogOpen}
                                onOpenChange={setDeleteDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="ghost">
                                        <IconX></IconX>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Eliminar publicación
                                        </DialogTitle>
                                        <DialogDescription>
                                            ¿Estás seguro de querer eliminar
                                            esta publicación? Esta acción es
                                            irreversible.
                                        </DialogDescription>
                                        <FormGeneralMessage
                                            error={deleteError?.message}
                                        ></FormGeneralMessage>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            onClick={() => {
                                                setDeleteDialogOpen(false);
                                            }}
                                            variant="outline"
                                            type="submit"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                await deletePost({
                                                    postId: post.id,
                                                });
                                                setDeleteDialogOpen(false);
                                                setTimeout(() => {
                                                    onChange();
                                                }, 110);
                                            }}
                                            loading={isDeleting}
                                            variant="destructive"
                                            type="submit"
                                        >
                                            Eliminar
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                </CardFooter>
            </Component>
        );
    }
);

Post.displayName = "Post";

export default Post;
