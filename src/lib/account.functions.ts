import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { profileSchema } from "./account-schema";

export const readProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("profiles").select("display_name,society,phone").eq("id", context.userId).single();
  if (error) throw new Error("Your profile could not be loaded. Please try again.");
  return data;
});
export const saveProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data: unknown) => profileSchema.parse(data)).handler(async ({ context, data }) => {
  const result = await context.supabase.from("profiles").update(data).eq("id", context.userId).select("display_name,society,phone").single();
  if (result.error) throw new Error("Your profile could not be saved. Please try again.");
  return result.data;
});