"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { trpc } from "@/lib/utils/trpc";
import z from "zod";
import React, { useCallback, useEffect, useState } from "react";
import {
    userAvatarURLSchema,
    userDescriptionSchema,
    userNameSchema,
} from "@/validation";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormGeneralMessage,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import validateImageURL from "@/lib/utils/validateImageURL";
const schema = z.object({
    name: userNameSchema,
    description: userDescriptionSchema,
    isPrivateAccount: z.boolean(),
    image: userAvatarURLSchema,
});

export default function UserSettings() {
    const { data, isLoading, refetch } = trpc.user.getConfigurationData.user.useQuery(
        undefined,
        {
            keepPreviousData: true,
        }
    );

    const { mutateAsync: setConfigurationData, isLoading: isSetting } =
        trpc.user.setConfigurationData.useMutation();

    const [isEditing, setIsEditing] = useState(false);

    const [isUpdated, setIsUpdated] = useState(true);

    const form = useForm<z.infer<typeof schema>>({
        defaultValues: {
            description: data?.description ?? "",
            name: data?.name ?? "",
            isPrivateAccount: data?.isPrivateAccount ?? false,
            image: data?.image ??""
        },

        resolver: zodResolver(schema),
    });

    const verifyUpdated = useCallback(
        function () {
            
            if (!data) return false;

            if ((data.name ?? "") !== form.getValues("name")) return false;
            if ((data.description ?? "") !== form.getValues("description"))
                return false;
            if ((data.isPrivateAccount ?? "") !== form.getValues("isPrivateAccount"))
                return false;

            if (data.image !== form.getValues("image")) return false;

            return true;
        },
        [data, form]
    );

    const updateForm = useCallback(()=> {
        if(!data) return;
        form.setValue("name", data.name ?? "");
        form.setValue("description", data.description ?? "");
        form.setValue("isPrivateAccount", data.isPrivateAccount ?? false);
        form.setValue("image", data.image ?? "");
    }, [data, form])

    useEffect(() => {

        updateForm()

        if (isEditing) {
            setIsUpdated(verifyUpdated());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) {
            updateForm()
        } else {
            setIsUpdated(verifyUpdated());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    async function onSubmit(data: z.infer<typeof schema>) {
       
        if (data.image.length !== 0) {
            if (!validateImageURL(data.image))
                return form.setError("image", {
                    message: "La URL de la imagen no es válida",
                });
        } console.log(data)

        await setConfigurationData({...data, avatarURL: data.image});
     
        setIsEditing(false);
        refetch();

     
    }
    useEffect(() => {
        const subscription = form.watch(() => {
            setIsUpdated(verifyUpdated());
        });
        return () => subscription.unsubscribe();
    }, [form, verifyUpdated]);

    return (
        <TabsContent className="max-w-full" value="user">
            <Card className="mx-auto w-[400px] max-w-full">
                <CardHeader>
                    <CardTitle>Usuario</CardTitle>
                    <CardDescription>Personaliza tu perfil</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={!isEditing}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={!isEditing}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL de imagen</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={!isEditing}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                            <div>
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Vista previa</label>
                                <Avatar className={cn("mt-2 ml-2", {
                                    "opacity-70": !isEditing
                                })}>
                                    {(isEditing || data) && (
                                        <AvatarImage
                                            src={
                                                (isEditing
                                                    ? form.getValues("image")
                                                    : data?.image) ?? undefined
                                            }
                                            alt="Vista previa"
                                        ></AvatarImage>
                                    )}
                                    <AvatarFallback>
                                        {data?.name
                                            ? data.name[0].toUpperCase()
                                            : data?.username
                                            ? data.username[0].toUpperCase()
                                            : ""}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <FormField
                                control={form.control}
                                name="isPrivateAccount"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-5 space-y-0">
                                        <FormLabel>Cuenta Privada</FormLabel>
                                        <FormControl>
                                            <Switch
                                                // disabled={!isEditing}
                                                disabled={true}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>

                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormGeneralMessage
                                error={form.formState.errors.root?.message}
                            ></FormGeneralMessage>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="mt-4 space-x-2">
                    {isEditing ? (
                        <>
                            <Button
                                className="w-[18ch]"
                                loading={isSetting}
                                disabled={isSetting || isUpdated}
                                onClick={form.handleSubmit(onSubmit)}
                            >
                                Guardar cambios
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                }}
                            >
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <Button
                            disabled={isLoading}
                            onClick={() => {
                                setIsEditing(true);
                            }}
                        >
                            Editar
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </TabsContent>
    );
}
