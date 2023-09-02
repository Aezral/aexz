import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postTagSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TagFormProps {
    onChange: (tags: string[]) => void | Promise<void>;
}

const inputSchema = z.object({
    tag: postTagSchema,
});

export default function TagForm({ onChange }: TagFormProps) {
    const [tags, setTags] = useState<string[]>([]);

    const form = useForm<z.infer<typeof inputSchema>>({
        resolver: zodResolver(inputSchema),
        defaultValues: {
            tag: "",
        },
    });

    function onSubmit(data: z.infer<typeof inputSchema>) {
        const { tag } = data;

        if(tags.length === 6){
            return form.setError("tag",{
                message:  "No puedes agregar más de 6 tags"
            })
        }

        setTags((prev) => (!prev.includes(tag) ? [...prev, tag] : prev));

        form.reset()
    }

    function deleteTag(tag: string) {
        setTags((prev) => {
            if (prev.includes(tag)) {
                
                return prev.filter(e => e !== tag);
            } else return prev;
        });
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex items-center gap-2"
                >
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage>
                                    <span className="text-transparent">
                                        aaa
                                    </span>
                                </FormMessage>{" "}
                            </FormItem>
                        )}
                    />

                    <Button>Agregar</Button>
                </form>
            </Form>
            <div className="flex flex-row gap-2 flex-wrap mt-3 items-start min-h-[6rem]">
                {tags.map((tag) => (
                    <div
                        className="inline-flex border-primary text-primary items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors "
                        key={tag}
                    >
                        {tag}{" "}
                        <button
                            onClick={() => {
                                deleteTag(tag);
                            }}
                            className=""
                        >
                            <X className="ml-2" size="1rem"></X>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
