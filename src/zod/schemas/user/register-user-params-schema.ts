import { z } from "zod";

export const registerUserSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
});

export type RegisterUserRequestParams = z.infer<typeof registerUserSchema>;