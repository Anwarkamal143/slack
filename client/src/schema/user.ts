import { accounts, user } from "@/lib/drizzle/schema/schema";
import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  id: z.string().optional(),
  email: z.string().min(1, "Email is required").email({
    message: "Provide a valid email",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export type IUser = typeof user.$inferSelect;

export type IAccount = typeof accounts.$inferInsert;

export type IAppUser = IUser & {
  accounts: IAccount[];
};

export type IInsertUser = z.infer<typeof RegisterSchema>;
