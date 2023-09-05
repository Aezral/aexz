import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { redirect } from "next/navigation";
import UserSettings from "./components/UserSettings";

import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import { MdNotifications } from "@react-icons/all-files/md/MdNotifications";

export default function Settings() {
    return (
        <div className="no-scrollbar h-full w-full overflow-y-auto">
            <h1 className="mt-[5%] font-bold text-2xl mb-5 text-center">Configuración</h1>
              <Tabs defaultValue="user" className="mb-10 flex flex-col justify-center items-center">
                        <TabsList className="mb-5 grid grid-cols-2 [&>*]:px-6">
                            <TabsTrigger value="user">
                                <span className="hidden md:block">Usuario</span>
                                <BsPersonFill className="md:hidden"></BsPersonFill>
                            </TabsTrigger>
                            <TabsTrigger value="notifications">
                            <span className="hidden md:block">Notificaciones</span>
                                <MdNotifications className="md:hidden"></MdNotifications>
                            </TabsTrigger>
                        </TabsList>
                        <UserSettings></UserSettings>
                        <TabsContent value="notifications">
                            Sin implementar
                        </TabsContent>
                    </Tabs>
        </div>
    );
}
