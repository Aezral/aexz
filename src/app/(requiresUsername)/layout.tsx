import SideNav from "@/components/gui/SideNav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function RequiresUsernameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return redirect("/login");
    } else if (session.user.username == null) {
        return redirect("/new-user");
    } else {
        return <>{children}</>;
        
        
    }
}
