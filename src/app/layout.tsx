import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from "@/components/gui/Navbar";
import SideNav from "@/components/gui/SideNav";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TrpcProvider from "@/providers/TrpcProvider";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { authOptions } from "./api/auth/[...nextauth]/route";
import CustomThemeProvider from "@/providers/CustomThemeProvider";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
    title: "Aexz",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html suppressHydrationWarning className="overflow-hidden" lang="es">
            <body className={inter.className + " "}>
                <NextAuthProvider session={session}>
                    <TrpcProvider>
                    
                      <CustomThemeProvider>
                      <div className="h-complete">
                            <Navbar />
                            <div className="container flex h-[calc(100%-4rem)]">
                                <SideNav className="hidden md:flex" />
                                <div className="h-full flex-grow overflow-hidden">
                                    {children}
                                </div>
                            </div>
                        </div>

                        <ToastContainer></ToastContainer>
                      </CustomThemeProvider>
                   
                    </TrpcProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
