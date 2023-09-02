import { db } from "@/server/utils/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
const scopes = ["identify"].join(" ");

export const authOptions: AuthOptions = {
    
    secret: process.env.JWT_SECRET,

    callbacks: {
        session({ session, user }) { 

            // console.log('user', user)
            if(session.user) {
                session.user.username = user.username;
                session.user.id = user.id
            }
            
           return session;
        },
    },

    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: { params: { scope: scopes } },
        }),
        EmailProvider({
            from: process.env.EMAIL_SERVER_USER,
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
        }),

        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            
        }),
    ],
    adapter: PrismaAdapter(db),
    pages: {
        signIn: "/login",
        verifyRequest: "/verify-request",
    },
    logger: {
        error: ()=>{},
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

