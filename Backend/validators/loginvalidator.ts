import { z } from "zod"

const loginSchema = z.object({
    username: z.string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must be at most 30 characters long." })
    .regex(/^[a-zA-Z0-9_.]+$/, {message:  "Username can only contain letters, numbers, underscores, and dots."}),
    email: z.email(),
    password: z.string().min(8, {message: "Password must have at least 8 characters"}),
});

export {loginSchema}