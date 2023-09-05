import { z } from "zod";

const lettersNumbersUnderscoresRegex = /^[a-zA-Z0-9_]+$/;

export const userNameSchema = z
    .string()
    .trim()
    .max(64, "El nombre debe tener 64 carácteres o menos");

export const userDescriptionSchema = z
    .string()
    .trim()
    .max(600, "La descripción no puede tener más de 600 carácteres");

export const userUsernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "el usuario debe tener 3 carácteres o más")
    .max(16, "el usuario debe tener 16 carácteres o menos")
    .regex(lettersNumbersUnderscoresRegex);

    export const userAvatarURLSchema = z.union([
        z.string().url("La URL de la imagen no es válida"),
        z.literal(""),
    ]);

export const tokenSchema = z.string();

export const postContentSchema = z
    .string({
        required_error: "La publicación no puede estar vacía",
    })
    .nonempty("La publicación no puede estar vacía")
    .trim()
    .max(4000, "La publicación no puede tener más de 4000 carácteres");

export const postTitleSchema = z
    .string({})
    .max(255, "El título no puede tener más de 255 carácteres");

export const postTagSchema = z
    .string()
    .trim()
    .nonempty("Un tag no puede estar vacío")
    .max(32, "Un tag no puede tener más de 32 carácteres");
export const sortPostBySchema = z.enum(["date", "likes"], {
    errorMap: (issue, ctx) => ({
        message: "Solo puedes ordenar por fecha y likes",
    }),
});
