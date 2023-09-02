"use client";
import { cn } from "@/lib/utils";
import {
    Bookmark,
    Home,
    Info,
    LogIn,
    LucideIcon,
    Settings,
    User,
    UserCheck,
    Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideElement {
    name: string;
    href: string | string[];
    icon?: LucideIcon;
    active?: boolean;
}

function SideElement({ name, href, icon: Icon, active = false }: SideElement) {
    return (
        <Link
            href={typeof href === "string" ? href : href[0]}
            className={cn("text-xl text-black/30 dark:text-white/30 font-medium flex", {
                "text-black dark:text-white": active,
            })}
        >
            {Icon && <Icon className="mr-2"></Icon>}
            {name}
        </Link>
    );
}

interface SideNavProps  {
    className?: string   
}

export default function SideNav({className}: SideNavProps) {
    const session = useSession();

    enum AuthRequired {
        required,
        neutral,
        requiredNotUsername,
        requiredNot,
    }

    const sideElements: (SideElement & { auth: AuthRequired })[] = [
        {
            name: "Inicio",
            href: "/home",
            icon: Home,
            auth: AuthRequired.neutral,
        },
        {
            name: "Seguidos",
            href: "/followed",
            icon: Users,
            auth: AuthRequired.required,
        },
        {
            name: "Guardados",
            href: "/bookmarks",
            icon: Bookmark,
            auth: AuthRequired.required,
        },
        // {
        //     name: "Gustados",
        //     href: "/liked",
        //     icon: ThumbsUp,
        //     auth: AuthRequired.required,
        // },
        {
            name: "Perfil",
            href: "/profile",
            icon: User,
            auth: AuthRequired.required,
        },
        {
            name: "Configuración",
            href: "/settings",
            icon: Settings,
            auth: AuthRequired.required,
        },
        {
            name: "Iniciar Sesión",
            href: ["/login", "/verify-request"],
            icon: LogIn,
            auth: AuthRequired.requiredNot,
        },
        {
            name: "Crear usuario",
            href: "/new-user",
            icon: UserCheck,
            auth: AuthRequired.requiredNotUsername,
        },
        {
            name: "Acerca de",
            href: "/about",
            icon: Info,
            auth: AuthRequired.neutral,
        },
    ];

    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col gap-6 justify-center", className)}>
            {sideElements.map((element) => {
                if (element.auth === AuthRequired.required) {
                    if (session.data?.user?.username == null) {
                        return undefined;
                    }
                } else if (element.auth === AuthRequired.requiredNot) {
                    if (session.data?.user != null) {
                        return undefined;
                    }
                } else if (element.auth === AuthRequired.requiredNotUsername) {
                    if (
                        session.data?.user == null ||
                        session.data?.user?.username != null
                    ) {
                        return undefined;
                    }
                }

                return (
                    <SideElement
                        active={
                            typeof element.href == "string"
                                ? pathname === element.href
                                : element.href.includes(pathname)
                        }
                        name={element.name}
                        href={element.href}
                        key={element.name}
                        icon={element.icon}
                    ></SideElement>
                );
            })}
        </div>
    );
}
