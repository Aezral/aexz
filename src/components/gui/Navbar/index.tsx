"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { IconMenu2 } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import SideNav from "../SideNav";
// import {MdPerson} from 'react-icons/md'
export default function Navbar() {
    const session = useSession();

    return (
        <div className="border-b h-16">
            <div className="flex h-16 items-center px-4 container">
                <Link
                    href="/home"
                    className="h-full mr-6 flex justify-center items-center"
                >
                    <span className="text-xl font-extrabold ml-2">Aexz</span>
                </Link>
                <Sheet >
                    <SheetTrigger asChild>
                        <Button className="md:hidden" variant={"outline"}>
                            <IconMenu2 size="1rem" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                       <SideNav className="h-full"></SideNav>
                    </SheetContent>
                </Sheet>

                <div className="justify-end flex flex-1">
                    {session.data?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {session.data?.user?.username ??
                                        session.data.user.name ??
                                        session.data.user.email}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Perfil </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">
                                            Configuración
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <button
                                        onClick={() => {
                                            signOut();
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild>
                            <Link href="/login">Iniciar sesión</Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
