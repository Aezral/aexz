import { db } from "@/server/utils/db";
import { loggedProcedure, publicProcedure, router } from "@/server/utils/trpc";
import {
    postContentSchema,
    postTagSchema,
    postTitleSchema,
    sortPostBySchema,
} from "@/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const postRouter = router({
    create: loggedProcedure
        .input(
            z.object({
                title: postTitleSchema.optional(),
                content: postContentSchema,
                tags: postTagSchema
                    .array()
                    .max(6, "Solo puedes usar 6 tags como máximo"),
            })
        )
        .mutation(
            async ({ ctx: { user }, input: { title, content, tags } }) => {
                await db.post.create({
                    data: {
                        content,
                        title,
                        tags: {
                            createMany: {
                                data: tags.map(tag => ({ name: tag })),
                            },
                        },
                        authorId: user.id,
                    },
                });

                return "Publicación creada";
            }
        ),
    getPosts: publicProcedure
        .input(
            z.object({
                cursor: z.string().nullish(),
                liked: z.boolean().optional(),
                bookmarked: z.boolean().optional(),
                followed: z.boolean().optional(),
                toFetch: z.number().positive().int().optional(),
                sortMethod: sortPostBySchema.optional(),
                username: z.string().optional(),
            })
        )
        .query(
            async ({
                input: {
                    cursor,
                    liked = false,
                    followed = false,
                    sortMethod = "date",
                    bookmarked = false,
                    username,
                },
                ctx: { user },
            }) => {
                let where: Prisma.PostWhereInput = {
                    author: {},
                };

                if (liked && user) {
                    where.likes = {
                        some: {
                            userId: user.id,
                        },
                    };
                }

                if (bookmarked && user) {
                    where.bookmarks = {
                        some: {
                            userId: user.id,
                        },
                    };
                }

                if (followed && user) {
                    where.author!.followers = {
                        some: {
                            id: user.id,
                        },
                    };
                }

                if (user) {
                    where.author!.OR = [
                        {
                            followers: {
                                some: {
                                    id: user.id,
                                },
                            },
                        },
                        {
                            isPrivateAccount: false,
                        },
                    ];
                } else {
                    where.author! = {
                        isPrivateAccount: false
                    }
                }

          

             
                const posts = await db.post.findMany({
                    where,

                    cursor: cursor
                        ? {
                              id: cursor,
                          }
                        : undefined,
                    take: 11,
                    select: {
                        id: true,
                        author: {
                            select: {
                                username: true,
                            },
                        },
                        content: true,
                        title: true,
                        likes: {
                            select: {
                                userId: true,
                            },
                        },
                        creationDate: true,
                    },
                    orderBy:
                        sortMethod === "date"
                            ? {
                                  creationDate: "desc",
                              }
                            : {
                                  likes: {
                                      _count: "desc",
                                  },
                              },
                });

                const userLikes = user
                    ? (
                          await db.like.findMany({
                              where: {
                                  userId: user.id,
                              },
                          })
                      ).map(e => e.postId)
                    : null;

                const userBookmarks = user
                    ? (
                          await db.bookmark.findMany({
                              where: {
                                  userId: user.id,
                              },
                          })
                      ).map(e => e.postId)
                    : null;

                let nextCursor: typeof cursor | undefined = undefined;

                if (posts.length > 10) {
                    const nextItem = posts.pop();
                    nextCursor = nextItem!.id;
                }

                const newPosts = posts.map((e, index) => {
                    if (posts[index - 1]) delete posts[index - 1];

                    let isLiked: boolean | null = null;
                    let isBookmarked: boolean | null = null;

                    if (Array.isArray(userLikes)) {
                        isLiked = userLikes.includes(e.id);
                    }

                    if (Array.isArray(userBookmarks)) {
                        isBookmarked = userBookmarks.includes(e.id);
                    }

                    return {
                        ...e,
                        likes: e.likes.length,
                        isLiked,
                        isBookmarked,
                    };
                });

                return {
                    posts: newPosts,
                    nextCursor,
                };
            }
        ),
    setLikeState: loggedProcedure
        .input(
            z.object({
                postId: z.string().uuid(),
                likeState: z.boolean(),
            })
        )
        .mutation(async ({ ctx: { user }, input: { postId, likeState } }) => {
            const post = await db.post.findFirst({
                where: {
                    id: postId,
                    OR: [
                        {
                            author: {
                                isPrivateAccount: false,
                            },
                        },
                        {
                            author: {
                                followers: {
                                    some: {
                                        id: user.id,
                                    },
                                },
                            },
                        },
                    ],
                },
            });

            if (!post) {
                throw new TRPCError({
                    message: "La publicación no existe",
                    code: "NOT_FOUND",
                });
            }

            if (likeState) {
                await db.like.create({
                    data: {
                        postId,
                        userId: user.id,
                    },
                });
            } else {
                await db.like.deleteMany({
                    where: {
                        postId,
                        userId: user.id,
                    },
                });
            }

            return "Acción realizada";
        }),
    setBookmarkState: loggedProcedure
        .input(
            z.object({
                postId: z.string().uuid(),
                bookmarkState: z.boolean(),
            })
        )
        .mutation(
            async ({ ctx: { user }, input: { postId, bookmarkState } }) => {
                const post = await db.post.findFirst({
                    where: {
                        id: postId,
                        OR: [
                            {
                                author: {
                                    isPrivateAccount: false,
                                },
                            },
                            {
                                author: {
                                    followers: {
                                        some: {
                                            id: user.id,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                });

                if (!post) {
                    throw new TRPCError({
                        message: "La publicación no existe",
                        code: "NOT_FOUND",
                    });
                }

                if (bookmarkState) {
                    await db.bookmark.create({
                        data: {
                            postId,
                            userId: user.id,
                        },
                    });
                } else {
                    await db.bookmark.deleteMany({
                        where: {
                            postId,
                            userId: user.id,
                        },
                    });
                }

                return "Acción realizada";
            }
        ),

    delete: loggedProcedure
        .input(
            z.object({ postId: z.string().uuid("La publicación no existe") })
        )
        .mutation(
            async ({
                ctx: {
                    user: { id: userId },
                },
                input: { postId },
            }) => {
                const post = await db.post.findFirst({
                    where: {
                        id: postId,
                    },
                    select: {
                        authorId: true,
                    },
                });

                const user = await db.user.findFirst({
                    where: {
                        id: userId,
                    },
                    select: {
                        isModerator: true,
                        isAdmin: true,
                        id: true,
                    },
                });

                if (!user) {
                    throw new TRPCError({
                        message:
                            "Necesitas iniciar sesión para realizar esta acción",
                        code: "UNAUTHORIZED",
                    });
                }

                if (!post) {
                    throw new TRPCError({
                        message: "La publicación no existe",
                        code: "NOT_FOUND",
                    });
                }

                if (
                    post.authorId !== user.id &&
                    !user.isAdmin &&
                    !user.isModerator
                ) {
                    throw new TRPCError({
                        message:
                            "No tienes permiso para eliminar esta publicación",
                        code: "FORBIDDEN",
                    });
                }

                await db.post.delete({
                    where: {
                        id: postId,
                    },
                });

                return "Publicación eliminada";
            }
        ),
});
