"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/lib/utils/trpc";
import { userUsernameSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface NewUserFormProps {
    callbackUrl: string | undefined;
}

const inputSchema = z.object({
    username: userUsernameSchema,
});

export default function NewUserForm({ callbackUrl }: NewUserFormProps) {
    const {
        mutateAsync: setUsername,
        isLoading,
        error,
    } = trpc.user.setUsername.useMutation();

    const router = useRouter();

    const { update: updateSession } = useSession();

    const form = useForm<z.infer<typeof inputSchema>>({
        resolver: zodResolver(inputSchema),
        defaultValues: {
            username: "",
        },
    });

    const onSubmit = async ({ username }: z.infer<typeof inputSchema>) => {
        try {
            await setUsername({
                username,
            });

            window.location.reload();
        } catch (err) {
            if (err instanceof TRPCClientError) {
                form.setError("username", {
                    message: err.message,
                });
            }
        }
    };

    // function handleSubmit(e: React.FormEvent){

    //     e.preventDefault();

    // }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Usuario</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                No podrás cambiar esto después
                            </FormDescription>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />

                <Button
                    style={{ width: "18ch" }}
                    loading={isLoading}
                    className="mt-5"
                    type="submit"
                >
                    Crear usuario
                </Button>
            </form>
        </Form>
    );
}
