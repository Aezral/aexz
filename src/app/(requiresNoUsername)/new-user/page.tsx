import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ServerComponentRequest } from "@/server/types";
import NewUserForm from "./NewUserForm";

export default async function NewUser({
    searchParams,
}: ServerComponentRequest) {
    const session = await getServerSession(authOptions);


    return (
        <div className="h-full flex items-center justify-center">
            <Card className="max-w-md">
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
                    <CardTitle>Nuevo usuario</CardTitle>
                    <CardDescription>
                        Para poder ingresar necesitas crear un usuario
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <NewUserForm callbackUrl={"/"}></NewUserForm>
                </CardContent>
            </Card>
        </div>
    );
}
