import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Enter your name").max(100),
  society: z.string().trim().max(120),
  phone: z.string().trim().max(20).regex(/^[+\d\s()-]*$/, "Enter a valid phone number"),
});
export const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
export const passwordSchema = z.string().min(8, "Use at least 8 characters").max(128);