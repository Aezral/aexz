import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";

import Navbar from "@/components/gui/Navbar";
import SideNav from "@/components/gui/SideNav";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TrpcProvider from "@/providers/TrpcProvider";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { authOptions } from "./api/auth/[...nextauth]/route";
const inter = Inter({ subsets: ["cyrillic"] });


export const metadata: Metadata = {
  title: "Aexz",
  description: "Red social",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html className="overflow-hidden" lang="es">
      <body className={inter.className + " "}>
        <NextAuthProvider session={session}>
          <TrpcProvider>
            <div className="h-complete">
              <Navbar />
              <div className="container flex h-[calc(100%-4rem)]">
                <SideNav className="hidden md:flex" />
                <div className="flex-grow h-full overflow-hidden">
                  {children}
                </div>
              </div>
            </div>

            <ToastContainer></ToastContainer>
          </TrpcProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
