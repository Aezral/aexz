import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function RequiresNoUsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  if (session.user.username != null) {
    return redirect("/");
  }

  return <>{children}</>;
}
