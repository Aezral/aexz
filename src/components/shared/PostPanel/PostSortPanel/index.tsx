import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { sortPostBySchema } from "@/validation";
import { z } from "zod";
interface PostSortPanel {
    onChange: (mode: z.infer<typeof sortPostBySchema>) => unknown;
}

export default function PostSortPanel({ onChange }: PostSortPanel) {
    return (
        <Select defaultValue="date" onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="date">Ordenar por fecha</SelectItem>
                    <SelectItem value="likes">Ordenar por likes</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
