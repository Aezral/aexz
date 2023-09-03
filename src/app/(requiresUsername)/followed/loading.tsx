import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function FollowedLoading() {
    return (
        <div className="no-scrollbar mx-auto flex h-full max-w-2xl flex-col overflow-y-auto overflow-x-hidden">
            <div className="px-2 pb-5 pt-5">
                <h1 className="mb-5 text-center text-3xl font-bold">Seguidos</h1>
                <div className="flex flex-col  items-center justify-between gap-2 md:flex-row">
                    <div className="flex items-center gap-2">
                        <Select disabled defaultValue="date">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="date">
                                        Ordenar por fecha
                                    </SelectItem>
                                    <SelectItem value="likes">
                                        Ordenar por likes
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-5 py-5">
                <Skeleton className="h-[10em] w-full"></Skeleton>
                <Skeleton className="h-[10em] w-full"></Skeleton>
                <Skeleton className="h-[10em] w-full"></Skeleton>
                <Skeleton className="h-[10em] w-full"></Skeleton>

                {/* TODO: Loaders para los botones de post y demás loadings */}
            </div>
        </div>
    );
}
