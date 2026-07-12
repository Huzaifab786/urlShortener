import { z } from "zod";

export const createLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Please enter a URL")
    .url("Please enter a valid URL")
    .refine(
      (value) => /^https?:\/\//i.test(value),
      "URL must start with http:// or https://"
    ),
  customAlias: z
    .string()
    .trim()
    .max(64, "Custom short link is too long")
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      "Only letters, numbers, hyphens, and underscores are allowed"
    )
    .optional(),
  title: z.string().trim().max(120, "Title is too long").optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
