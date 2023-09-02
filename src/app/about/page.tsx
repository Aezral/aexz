import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IconBrandTypescript } from "@tabler/icons-react";
import Link from "next/link";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SiNextDotJs } from "@react-icons/all-files/si/SiNextDotJs";
import { SiTailwindcss } from "@react-icons/all-files/si/SiTailwindcss";

interface TechProps {
    name: string;
    href: string;
    icon: React.ReactElement;
    color: string;
}

function Tech({ name, href, icon, color }: TechProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    <Link
                        target="_blank"
                        href={href}
                        className={cn(
                            "text-4xl transition-opacity hover:opacity-80",
                            color
                        )}
                    >
                        {icon}
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function About() {
    const techUsed: TechProps[] = [
        {
            name: "Typescript",
            href: "https://www.typescriptlang.org/",
            icon: <SiTypescript />,
            color: "text-indigo-500",
        },
        {
            name: "Next.js",
            href: "https://nextjs.org/",
            icon: <SiNextDotJs />,
            color: "te",
        },
        {
            name: "Tailwind",
            href: "https://tailwindcss.com/",
            icon: <SiTailwindcss />,
            color: "text-blue-300",
        },
        {
            name: "Next Auth",
            href: "https://next-auth.js.org/",
            color: "text-cyan-800 dark:text-cyan-600",
            icon: (
                <svg
                className="h-[1em]"
                    viewBox="0 0 327 361"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g>
                        <path
                            fill="currentColor"
                            opacity="1.00"
                            d=" M 156.65 0.00 L 169.30 0.00 C 177.22 2.89 185.37 5.08 193.44 7.54 C 235.25 20.05 277.03 32.67 318.83 45.20 C 321.60 46.16 325.56 47.33 325.35 50.99 C 325.56 63.66 325.88 76.40 324.52 89.03 C 319.92 139.01 311.18 189.17 291.75 235.72 C 280.28 263.52 264.64 289.95 243.65 311.64 C 225.93 330.43 204.40 345.64 180.57 355.63 C 172.83 359.26 163.96 362.33 155.46 359.47 C 123.64 347.85 95.32 327.33 73.64 301.38 C 51.13 274.65 34.89 243.02 24.19 209.85 C 11.35 172.49 4.95 133.26 1.29 94.03 C 0.98 91.07 0.47 88.14 0.00 85.20 L 0.00 49.98 C 3.51 45.25 9.64 44.49 14.87 42.84 C 52.81 31.51 90.71 20.06 128.64 8.70 C 137.97 5.79 147.45 3.32 156.65 0.00 M 167.52 103.65 C 163.33 104.12 159.11 104.13 154.91 104.22 C 142.25 105.31 129.89 110.00 119.88 117.86 C 114.85 122.52 110.72 128.05 105.95 132.96 C 98.75 140.33 95.01 150.21 91.79 159.80 C 88.53 169.55 89.36 179.91 89.21 190.01 C 89.20 193.46 89.17 197.08 90.75 200.25 C 95.03 209.28 100.52 217.67 105.97 226.02 C 108.89 230.83 114.49 232.78 118.15 236.86 C 120.76 239.55 123.24 242.56 126.73 244.17 C 131.46 246.33 136.79 246.49 141.65 248.28 C 147.26 250.35 152.92 252.61 158.95 253.03 C 166.66 253.53 174.39 252.89 182.04 251.98 C 192.78 250.72 203.16 246.37 211.48 239.46 C 221.33 231.95 230.42 222.87 235.39 211.35 C 236.96 207.39 236.90 203.07 237.26 198.90 C 237.50 195.16 239.76 191.85 239.70 188.06 C 239.75 184.36 239.88 180.67 239.94 176.97 C 240.05 172.26 238.66 167.68 238.51 162.99 C 238.71 156.26 235.30 150.22 232.65 144.25 C 226.39 135.66 219.47 127.56 212.60 119.43 C 209.45 115.45 204.19 114.53 200.01 112.02 C 194.44 108.86 188.21 107.21 181.99 105.90 C 177.21 104.94 172.49 102.75 167.52 103.65 Z"
                        />
                        <path
                            fill="currentCOlor"
                            opacity="1.00"
                            d=" M 137.24 129.29 C 146.74 126.40 157.58 128.45 165.43 134.57 C 167.42 136.60 169.06 138.94 170.88 141.13 C 174.07 144.78 175.24 149.59 176.94 154.02 C 179.40 160.85 176.59 168.01 176.76 174.98 C 177.70 180.76 182.68 184.53 186.24 188.78 C 190.44 192.93 193.22 198.42 198.10 201.88 C 201.42 204.47 205.60 206.44 207.49 210.42 C 207.81 214.38 207.63 218.47 206.41 222.28 C 203.77 223.32 200.78 222.59 198.01 222.79 C 193.86 222.57 189.58 222.96 185.56 221.74 C 184.95 218.49 185.64 214.51 182.90 212.08 C 180.33 209.82 176.57 210.50 173.47 209.61 C 173.12 206.69 173.97 202.83 170.93 201.07 C 167.81 199.72 163.75 200.46 161.45 197.52 C 158.65 194.11 154.28 192.61 149.95 193.39 C 141.91 194.42 133.18 192.52 127.12 186.93 C 124.52 184.25 121.33 182.05 119.23 178.94 C 117.83 174.62 117.07 170.10 115.35 165.87 C 111.82 157.49 114.99 147.99 119.93 140.89 C 124.01 134.92 131.14 132.57 137.24 129.29 M 134.23 141.05 C 131.32 142.00 129.22 144.91 129.37 148.00 C 128.97 154.30 137.28 159.29 142.50 155.50 C 146.70 152.66 146.22 146.31 143.20 142.79 C 140.91 140.53 137.21 140.12 134.23 141.05 Z"
                        />
                    </g>
                </svg>
            ),
        },
        {
            name: "Prisma",
            href: "https://www.prisma.io/",
            color: "",
            icon: (
                <svg
                    className="h-[1em]"
                    fill="currentColor"
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Prisma</title>
                    <path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z" />
                </svg>
            ),
        },
        {
            name: "Trpc",
            href: "https://trpc.io/",
            color: "text-sky-600",
            icon: (
                <svg
                    className="h-[1em]"
                    fill="currentColor"
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>tRPC</title>
                    <path d="M24 12c0 6.62-5.38 12-12 12S0 18.62 0 12 5.38 0 12 0s12 5.38 12 12ZM1.21 12A10.78 10.78 0 0 0 12 22.79 10.78 10.78 0 0 0 22.79 12 10.78 10.78 0 0 0 12 1.21 10.78 10.78 0 0 0 1.21 12Zm10.915-6.086 2.162 1.248a.25.25 0 0 1 .125.217v1.103l2.473 1.428a.25.25 0 0 1 .125.217v2.355l.955.551a.25.25 0 0 1 .125.217v2.496a.25.25 0 0 1-.125.217l-2.162 1.248a.25.25 0 0 1-.25 0l-.956-.552-2.472 1.427a.25.25 0 0 1-.25 0l-2.472-1.427-.956.552a.25.25 0 0 1-.25 0l-2.162-1.248a.25.25 0 0 1-.125-.217V13.25a.25.25 0 0 1 .125-.217l.955-.551v-2.355a.25.25 0 0 1 .125-.217l2.473-1.428V7.38a.25.25 0 0 1 .125-.217l2.162-1.248a.25.25 0 0 1 .25 0Zm1.268 10.049a.25.25 0 0 1-.125-.217V13.25a.25.25 0 0 1 .125-.217l2.16-1.248a.25.25 0 0 1 .25 0l.707.408v-1.922l-2.098-1.21v.814a.25.25 0 0 1-.125.217l-2.162 1.248a.25.25 0 0 1-.25 0l-2.162-1.248a.25.25 0 0 1-.125-.217V9.06L7.49 10.271v1.922l.707-.408a.25.25 0 0 1 .25 0l2.16 1.248a.25.25 0 0 1 .125.217v2.496a.25.25 0 0 1-.125.217l-.705.408L12 17.582l2.098-1.211ZM10.088 9.73l1.662.96V8.766l-1.662-.955Zm3.824 0V7.811l-1.662.955v1.924ZM12 6.418l-1.66.96 1.66.954 1.66-.954Zm-5.59 9.184 1.66.958v-1.921l-1.66-.956Zm3.822 0v-1.92l-1.662.957v1.923Zm-1.91-3.311-1.662.96 1.661.955 1.66-.956Zm5.446 3.31 1.66.96v-1.922l-1.66-.956Zm3.822 0v-1.918l-1.662.956v1.922Zm-1.912-3.31-1.66.96 1.66.955 1.66-.956Z" />
                </svg>
            ),
        },

    ];

    return (
        <div className="flex h-full flex-col items-center justify-center text-center tracking-tighter">
            <h1 className="text-3xl">
                <span className="mb-2 font-bold text-primary">Aexz</span> es un
                proyecto de{" "}
                <Link
                    target="_blank"
                    href="https://aezral.vercel.app"
                    className="font-bold text-orange-400 underline transition-colors hover:opacity-70"
                >
                    aezral
                </Link>
            </h1>

            <div className="mt-10 flex flex-wrap gap-4">
                {techUsed.map(tech => (
                    <Tech {...tech} key={tech.href} />
                ))}
            </div>
        </div>
    );
}
