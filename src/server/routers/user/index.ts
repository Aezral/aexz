
import { db } from "@/server/utils/db";
import {
    loggedProcedure,
    loggedProcedureNoUsername,
    publicProcedure,
    router,
} from "@/server/utils/trpc";
import {
    userAvatarURLSchema,
    userDescriptionSchema,
    userNameSchema,
} from "@/server/validation";
import { userUsernameSchema } from "@/server/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import removeQueryParams from "@/server/utils/removeQueryParams";
import validateImageURL from "@/server/utils/validateImageURL";
import {sanitize} from 'dompurify'

export const userRouter = router({
    setUsername: loggedProcedureNoUsername
        .input(
            z.object({
                username: userUsernameSchema,
            })
        )
        .mutation(async ({ ctx: { user }, input: { username } }) => {
            if (user.username != null) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Ya tienes un nombre de usuario",
                });
            }

            const userWithUsername = await db.user.findFirst({
                where: {
                    username,
                },
                select: {
                    id: true,
                },
            });

            if (userWithUsername != null) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Nombre de usuario en uso",
                });
            }

            await db.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    username,
                    isUsernameSet: true,
                },
            });

            return "Cambios realizados";
        }),
    get: publicProcedure
        .input(
            z.object({
                username: z.string().optional(),
            })
        )
        .query(async ({ input: { username }, ctx: { user } }) => {
            const response = await userUsernameSchema
                .optional()
                .safeParseAsync(username);

            if (!response.success) {
                return null;
            }

            if (!username && !user) {
                return null;
            }

            const where = username ? { username } : { id: user!.id };

            const [foundUser, followers, following] = await db.$transaction([
                db.user.findUnique({
                    where,
                    select: {
                        username: true,
                        description: true,
                        isPrivateAccount: true,
                        joinedAt: true,
                        name: true,
                        image:true
                    },
                }),
                db.user.count({
                    where: {
                        following: {
                            some: {
                                ...where,
                            },
                        },
                    },
                }),
                db.user.count({
                    where: {
                        followers: {
                            some: {
                                ...where,
                            },
                        },
                    },
                }),
            ]);

            if (!foundUser) {
                return null;
            }

            const isFollowing =
                !user || user.username === username
                    ? null
                    : await db.user.findFirst({
                          where: {
                              id: user.id,
                              following: {
                                  some: {
                                      username,
                                  },
                              },
                          },
                          select: {
                              id: true,
                          },
                      });

            const isFollower =
                !user || foundUser.username === username
                    ? null
                    : await db.user.findFirst({
                          where: {
                              id: user.id,
                              followers: {
                                  some: {
                                      username,
                                  },
                              },
                          },
                          select: {
                              id: true,
                          },
                      });

            const hasFollowRequest =
                !user || foundUser.username === username
                    ? null
                    : await db.followRequest.findFirst({
                          where: {
                              to: {
                                  username: foundUser.username,
                              },
                              fromUserId: user.id,
                          },
                          select: {
                              id: true,
                          },
                      });

            return {
                ...foundUser,
                following,
                followers,
                isFollowing: isFollowing != null,
                isFollower: isFollower != null,
                hasFollowRequest: hasFollowRequest != null,
            };
        }),
    // setFollowRequestState: loggedpro
    setFollowState: loggedProcedure
        .input(
            z.object({
                username: z.string(),
                followState: z.boolean(),
            })
        )
        .mutation(
            async ({ input: { username, followState }, ctx: { user } }) => {
                try {
                    userUsernameSchema.parse(username);
                } catch {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "El usuario no existe",
                    });
                }

                const foundUser = await db.user.findFirst({
                    where: {
                        username,
                    },
                    select: {
                        id: true,
                        isPrivateAccount: true,
                    },
                });

                if (!foundUser) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "El usuario no existe",
                    });
                }

                const isUserFollower = await db.user.findFirst({
                    where: {
                        id: user.id,
                        following: {
                            some: {
                                username,
                            },
                        },
                    },
                    select: {
                        id: true,
                    },
                });

                if (!followState) {
                    if (isUserFollower) {
                        await db.user.update({
                            where: {
                                username,
                            },
                            data: {
                                followers: {
                                    disconnect: {
                                        id: user.id,
                                    },
                                },
                            },
                        });

                        return "Se dejó de seguir al usuario";
                    } else {
                        if (foundUser.isPrivateAccount) {
                            const followRequest =
                                await db.followRequest.findFirst({
                                    where: {
                                        fromUserId: user.id,
                                        toUserId: foundUser.id,
                                    },
                                    select: {
                                        id: true,
                                    },
                                });

                            if (followRequest) {
                                await db.followRequest.delete({
                                    where: {
                                        id: followRequest.id,
                                    },
                                });
                            }

                            return "Solicitud de seguimiento eliminada";
                        }

                        return "No se hizo nada";
                    }
                } else {
                    if (isUserFollower) {
                        return "No se hizo nada";
                    } else {
                        if (foundUser.isPrivateAccount) {
                            await db.followRequest.create({
                                data: {
                                    fromUserId: user.id,
                                    toUserId: foundUser.id,
                                },
                            });

                            return "Se envió la solicitud de seguimiento";
                        } else {
                            await db.user.update({
                                where: {
                                    username,
                                },
                                data: {
                                    followers: {
                                        connect: {
                                            id: user.id,
                                        },
                                    },
                                },
                            });

                            return "Se siguió al usuario";
                        }
                    }
                }
            }
        ),
    getConfigurationData: router({
        user: loggedProcedure.query(async ({ ctx: { user } }) => {
            const data = await db.user.findUnique({
                where: {
                    id: user.id,
                },
                select: {
                    name: true,
                    description: true,
                    isPrivateAccount: true,
                    image: true,
                    username:true
                },
            });

            return data!;
        }),
    }),
    setConfigurationData: loggedProcedure
        .input(
            z.object({
                name: userNameSchema.optional(),
                description: userDescriptionSchema.optional(),
                isPrivateAccount: z.boolean().optional(),
                avatarURL: userAvatarURLSchema.optional(),
            })
        )
        .mutation(
            async ({
                ctx: { user },
                input: { name, description, isPrivateAccount, avatarURL },
            }) => {
                let data: Parameters<typeof db.user.update>[0]["data"] = {};
                // TODO: terminar procedimiento

                if (name != null) {
                    data.name = name.length === 0 ? null : name;
                }

                if (description != null) {
                    data.description =
                        description.length === 0 ? null : description;
                }

                if (isPrivateAccount != null) {
                    data.isPrivateAccount = isPrivateAccount;
                }
                console.log(avatarURL)
                if (avatarURL != null) {
                  
                    if(avatarURL.length !== 0){
                        if(!validateImageURL(avatarURL)) throw new TRPCError({
                            message:"URL de imagen inválida",
                            code:"BAD_REQUEST"
                        })
                        data.image = sanitize(avatarURL)
                    } else{
                        data.image = null
                    }

                    
                }

                await db.user.update({
                    where: {
                        id: user.id,
                    },
                    data,
                });
            }
        ),
});
