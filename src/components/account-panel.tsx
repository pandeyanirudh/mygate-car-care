import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Pencil, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "./account-context";
import { readProfile, saveProfile } from "@/lib/account.functions";
import { profileSchema } from "@/lib/account-schema";

export function AccountPanel() {
  const { user, signOut } = useAccount();
  const getProfile = useServerFn(readProfile);
  const updateProfile = useServerFn(saveProfile);
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["profile", user?.id], queryFn: () => getProfile(), enabled: Boolean(user) });
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!user) return <section className="space-y-3"><h1 className="font-display text-3xl">Your account</h1><Button asChild className="bg-ink text-cream hover:bg-ink-soft"><Link to="/auth">Sign in / Create account</Link></Button></section>;
  return <section className="space-y-4">
    <div className="flex items-center gap-3"><div className="grid size-12 shrink-0 place-items-center rounded-lg bg-ink text-lg font-semibold text-gold">{(profile.data?.display_name || user.email || "U").slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><h1 className="break-words font-display text-2xl">{profile.data?.display_name || "Your account"}</h1><p className="break-all text-sm text-muted-foreground">{user.email}</p>{profile.data?.society && <p className="text-sm text-muted-foreground">{profile.data.society}</p>}</div><Button variant="outline" size="icon" title="Edit profile" aria-label="Edit profile" disabled={!profile.data} onClick={() => { setEditing(!editing); setError(""); }}><Pencil /></Button></div>
    {profile.isLoading && <p role="status" className="text-sm text-muted-foreground">Loading your profile…</p>}
    {profile.isError && <div role="alert"><p className="text-sm text-destructive">Unable to load your profile.</p><Button variant="link" onClick={() => profile.refetch()}>Try again</Button></div>}
    {editing && profile.data && <form className="grid gap-3" onSubmit={async (event) => {
      event.preventDefault(); setError("");
      const form = new FormData(event.currentTarget);
      const values = profileSchema.safeParse({ display_name: form.get("display_name"), society: form.get("society"), phone: form.get("phone") });
      if (!values.success) { setError(values.error.issues[0]?.message ?? "Check your details"); return; }
      setBusy(true);
      try { const saved = await updateProfile({ data: values.data }); queryClient.setQueryData(["profile", user.id], saved); setEditing(false); }
      catch (err) { setError(err instanceof Error ? err.message : "Could not save your profile"); }
      finally { setBusy(false); }
    }}>{[{ name: "display_name", label: "Full name", max: 100 }, { name: "society", label: "Society", max: 120 }, { name: "phone", label: "Phone number", max: 20 }].map((field) => <label key={field.name} className="grid gap-1 text-sm">{field.label}<input name={field.name} required={field.name === "display_name"} maxLength={field.max} defaultValue={profile.data?.[field.name as "display_name" | "society" | "phone"]} className="h-11 rounded-lg border border-input bg-background px-3" /></label>)}<div className="flex gap-2"><Button disabled={busy} type="submit">{busy && <LoaderCircle className="animate-spin" />}Save profile</Button><Button variant="outline" type="button" onClick={() => setEditing(false)}>Cancel</Button></div></form>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button variant="outline" disabled={busy} className="text-destructive" onClick={async () => { setBusy(true); try { await signOut(); } catch { setError("Sign-out failed. Try again."); setBusy(false); } }}>Log out</Button>
  </section>;
}