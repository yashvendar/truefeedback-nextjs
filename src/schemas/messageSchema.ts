import { z } from "zod";

export const messageSchema = z.object({
    content: z.string()
        .min(2,'Message content must be atleast 2 chareacters')
        .max(300, "Message content must not be more then 300 chareacters")
})