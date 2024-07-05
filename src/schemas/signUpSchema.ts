import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charecters")
    .max(20, "Username must be no more then 20 charecters")
    .regex(/^[0-9a-zA-Z_]+$/, "Username must not contain any special charecters");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email('Invalid Email address'),
    password: z.string().min(6, "Password must be atleast 6 charecters")
}) 
