import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const deleteAccountSchema = z.object({
  confirmation: z
    .string()
    .min(1, "Type DELETE to confirm")
    .refine((value) => value === "DELETE", {
      message: "Type DELETE to confirm",
    }),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = {
  confirmation: string;
};
