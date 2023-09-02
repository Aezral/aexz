import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ServerComponentRequest } from "@/server/types";
import { getProviders } from "next-auth/react";
import LoginMenu from "./LoginMenu";

export default async function Login({ searchParams }: ServerComponentRequest) {
    const providers = await getProviders();

    const callbackUrl =
        searchParams && typeof searchParams["callbackUrl"] === "string"
            ? searchParams["callbackUrl"]
            : undefined;

    return (
        <div className="h-full flex items-center justify-center">
            <Card>
                {/* <div className="w-32 mx-auto mt-5 mb-5">
                    <Image
                        src="/logo2.svg"
                        className="w-full"
                        width={400}
                        height={400}
                        alt="Logo"
                    />
                </div> */}
                <CardHeader>
                    <CardTitle>Inicio de sesión</CardTitle>
                    <CardDescription>
                        Elige una manera para ingresar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {providers && (
                        <LoginMenu
                            callbackUrl={callbackUrl}
                            providers={providers}
                        ></LoginMenu>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
