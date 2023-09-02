export type ServerComponentRequest = {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
};
