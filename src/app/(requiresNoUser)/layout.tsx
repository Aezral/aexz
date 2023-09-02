import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function RequiresNoUserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (session != null) {
        return redirect("/");
    } else {
        return <>
        
        {children}
        
        
        </>;
    }
}
