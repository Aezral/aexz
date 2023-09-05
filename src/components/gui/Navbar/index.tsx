"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IconMenu2 } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import SideNav from "../SideNav";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {FaMoon} from '@react-icons/all-files/fa/FaMoon'
import {RiComputerFill} from '@react-icons/all-files/ri/RiComputerFill'
import {BiSun} from '@react-icons/all-files/bi/BiSun'
// import {MdPerson} from 'react-icons/md'
export default function Navbar() {
    const session = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    return (
        <div className="h-16 border-b">
            <div className="container flex h-16 items-center px-4">
                <Link
                    href="/home"
                    className="mr-6 flex h-full items-center justify-center"
                >
                    <span className="ml-2 text-xl font-extrabold">Aexz</span>
                </Link>
                <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
                    <SheetTrigger asChild>
                        <Button className="md:hidden" variant={"outline"}>
                            <IconMenu2 size="1rem" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SideNav close={()=> {setIsNavOpen(false)}} className="h-full"></SideNav>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 justify-end gap-2">
                    {mounted && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {theme === "light"
                                        ? <BiSun  />
                                        : theme === "system"
                                        ? <RiComputerFill/>
                                        : <FaMoon/>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Tema</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        setTheme("light");
                                    }}
                                >
                                    Claro
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setTheme("dark");
                                    }}
                                >
                                    Oscuro
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setTheme("system");
                                    }}
                                >
                                    Sistema
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {session.data?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {session.data.user.name ??
                                        session.data.user.username ??
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
