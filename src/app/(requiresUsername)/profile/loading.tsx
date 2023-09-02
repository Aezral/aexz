import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
export default function ProfileLoading() {
    return (
        <div>
            <div className="no-scrollbar mx-auto h-full max-w-2xl overflow-y-auto pt-16 md:pt-36">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full"></Skeleton>
                    <div>
                        <Skeleton className="h-[1em] w-[5rem] text-xl font-bold"></Skeleton>
                        <Skeleton className="mt-2 h-[1em] w-[5rem] text-lg" />
                    </div>
                </div>
                <Skeleton className="mb-3 ml-12 mt-9 h-[1em] w-[10rem]" />

                <div className="mb-3 ml-12 mt-8 flex gap-6">
                    <Skeleton className="h-[1em] w-[6em]"></Skeleton>
                    <Skeleton className="h-[1em] w-[6em]"></Skeleton>
                </div>
                <Skeleton className="mt-10 h-[2px] w-full"></Skeleton>
                <div
                    className="no-scrollbar mx-auto flex h-full max-w-2xl flex-col overflow-y-auto overflow-x-hidden"
                >
                    <div className="px-2 pb-5 pt-5 mt-7">
                        <div className="flex flex-col  items-center justify-between gap-2 md:flex-row">
                            <Skeleton className="h-[2em] w-[6em]" />

                           
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 py-5">
                        <Skeleton className="h-[10em] w-full"></Skeleton>
                        <Skeleton className="h-[10em] w-full"></Skeleton>
                        <Skeleton className="h-[10em] w-full"></Skeleton>
                        <Skeleton className="h-[10em] w-full"></Skeleton>

                        {/* TODO: Loaders para los botones de post y demás loadings */}
                    </div>
                </div>
            </div>
        </div>
    );
}
