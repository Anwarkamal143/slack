import { accounts, user } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const RegisterUserSchema = createInsertSchema(user, {
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Provide a valid email."),
}).extend({
  name: z.string().min(1, "Name is required."),
  password: z.string().min(8, "Password must be 8 charactors long"),
});
export const LoginSchema = createInsertSchema(user, {
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Provide a valid email."),
}).extend({
  password: z.string().min(8, "Password must be 8 charactors long"),
});
export type IUser = typeof user.$inferSelect;
export type IRegisterUser = z.infer<typeof RegisterUserSchema>;
export type ILogInUser = z.infer<typeof LoginSchema>;
export type IAccount = typeof accounts.$inferSelect;
