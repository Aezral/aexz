import { ZodSchema } from "zod";

export default async function getBody<T>(schema: ZodSchema<T>, request: Request){

    const json = await request.json().catch(() => undefined) as unknown;

    return schema.parse(json);
    


}