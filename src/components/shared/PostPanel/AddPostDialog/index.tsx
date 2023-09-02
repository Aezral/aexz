"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormGeneralMessage,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/utils/trpc";
import { postContentSchema, postTitleSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TagForm from "./TagForm";

const inputSchema = z.object({
    title: postTitleSchema,
    content: postContentSchema,
});

interface AddPostDialogProps {
    onChange: () => unknown;
}

export default function AddPostDialog({ onChange }: AddPostDialogProps) {
    const session = useSession();

    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof inputSchema>>({
        resolver: zodResolver(inputSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const [tags, setTags] = useState<string[]>([]);

    const { mutateAsync, isLoading } = trpc.post.create.useMutation();

    async function onSubmit({ content, title }: z.infer<typeof inputSchema>) {
        try {
            await mutateAsync({
                content,
                tags,
                title: title.length > 0 ? title : undefined,
            });
            onChange();
            setOpen(false);
            form.reset();
        } catch (err) {
            if (err instanceof TRPCClientError) {
                form.setError("root", {
                    message: err.message,
                });
            }
        }
    }

    if (session.data?.user)
        return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button>Crear publicación </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Nueva publicación </AlertDialogTitle>
                        <FormGeneralMessage
                            error={form.formState.errors.root?.message}
                        />
                        {/* <AlertDialogDescription>
                    This action cannot be undone. This will permanently
                    delete your account and remove your data from our
                    servers.
                </AlertDialogDescription> */}
                    </AlertDialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título (opcional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contenido</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-[6rem] resize-none"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <TagForm onChange={setTags} />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <Button
                            className="w-[8rem]"
                            loading={isLoading}
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            Publicar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
}
