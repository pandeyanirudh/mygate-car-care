import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CarFront, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAccount } from "./account-context";
import { emailSchema, passwordSchema } from "@/lib/account-schema";
import heroCar from "@/assets/creta-morning.jpg";

export function AuthForm({ recovery = false }: { recovery?: boolean }) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recoveryValid, setRecoveryValid] = useState(false);
  const { user, loading } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (recovery) {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const isRecovery = hash.get("type") === "recovery";
      if (isRecovery) sessionStorage.setItem("car-care-recovery", "true");
      setRecoveryValid(isRecovery || sessionStorage.getItem("car-care-recovery") === "true");
    } else if (!loading && user) { void navigate({ to: "/", replace: true }); }
  }, [user, loading, recovery, navigate]);
  const switchMode = (next: typeof mode) => { setMode(next); setError(""); setNotice(""); setPassword(""); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const validEmail = recovery ? "" : emailSchema.parse(email);
      if (recovery || mode !== "forgot") passwordSchema.parse(password);
      if (mode === "signup" && !recovery && !name.trim()) throw new Error("Enter your name");
      if (recovery && password !== confirm) throw new Error("Passwords do not match");
      setBusy(true);
      if (recovery) {
        if (!recoveryValid || !user) throw new Error("This reset link is invalid or expired. Request a new link.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        sessionStorage.removeItem("car-care-recovery"); setNotice("Your password has been updated."); setPassword(""); setConfirm("");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(validEmail, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setNotice("If an account exists for this email, you’ll receive a password reset link.");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email: validEmail, password, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } } });
        if (error) throw error;
        setNotice("Check your email to confirm your account before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: validEmail, password });
        if (error) throw error;
        await navigate({ to: "/", replace: true });
      }
    } catch (err) { setError(err && typeof err === "object" && "issues" in err ? (err as { issues: { message: string }[] }).issues[0]?.message ?? "Check your details" : err instanceof Error ? err.message : "Something went wrong. Try again."); }
    finally { setBusy(false); }
  };
  const google = async () => {
    setBusy(true); setError("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: "/", replace: true });
    } catch (err) { setError(err instanceof Error ? err.message : "Google sign-in failed. Try again."); }
    finally { setBusy(false); }
  };
  const inputClass = "h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/50";
  const title = recovery ? "A fresh start." : mode === "signup" ? "Welcome to better care." : mode === "forgot" ? "Forgot your password?" : "Welcome back.";
  return <main className="relative isolate flex min-h-svh flex-col bg-ink text-cream">
    <img src={heroCar} alt="A Hyundai Creta receiving professional care at a residential society" className="absolute inset-0 -z-20 h-full w-full object-cover" />
    <div className="absolute inset-0 -z-10 bg-ink/85" />
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7"><Link to="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-gold font-bold text-ink">M</span><span className="text-lg font-semibold">MyGate <span className="text-gold">Car Care</span></span></Link><Button asChild variant="ghost" className="text-cream hover:bg-surface hover:text-cream"><Link to="/"><ArrowLeft />Back to home</Link></Button></header>
    <section className="mx-auto w-full max-w-md flex-1 px-6 pb-12 pt-6 sm:pt-12">
      <div className="mb-7 flex items-center gap-2 text-xs font-medium text-gold"><CarFront className="size-4" /> YOUR SOCIETY. YOUR CAR. YOUR CARE.</div>
      <h1 className="font-display text-5xl leading-tight">{title}</h1><p className="mb-8 mt-3 text-sm leading-6 text-cream/70">{recovery ? "Choose a new password for your account." : mode === "signup" ? "Your daily car care, in good hands." : mode === "forgot" ? "We’ll send a reset link to your email." : "Sign in to your MyGate Car Care account."}</p>
      {!recovery && mode !== "forgot" && <><Button disabled={busy} variant="outline" onClick={google} className="h-12 w-full rounded-lg border-line bg-paper text-ink hover:bg-cream"><span className="text-lg font-bold">G</span>Continue with Google</Button><div className="my-6 flex items-center gap-3 text-xs text-cream/50"><span className="h-px flex-1 bg-line" />or continue with email<span className="h-px flex-1 bg-line" /></div></>}
      <form onSubmit={submit} className="space-y-5">
        {mode === "signup" && !recovery && <label className="grid gap-2 text-sm">Full name<input autoComplete="name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your full name" /></label>}
        {!recovery && <label className="grid gap-2 text-sm">Email address<input type="email" autoComplete="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" /></label>}
        {(recovery || mode !== "forgot") && <label className="grid gap-2 text-sm"><span className="flex items-center justify-between">{recovery ? "New password" : "Password"}{mode === "signin" && !recovery && <Button type="button" variant="link" onClick={() => switchMode("forgot")} className="h-auto p-0 text-xs text-gold">Forgot password?</Button>}</span><span className="relative"><input type={visible ? "text" : "password"} autoComplete={mode === "signin" && !recovery ? "current-password" : "new-password"} required minLength={8} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-12`} placeholder="At least 8 characters" /><Button type="button" size="icon" variant="ghost" aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)} className="absolute right-2 top-1.5 text-muted-foreground">{visible ? <EyeOff /> : <Eye />}</Button></span></label>}
        {recovery && <label className="grid gap-2 text-sm">Confirm new password<input type="password" required autoComplete="new-password" maxLength={128} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} /></label>}
        {error && <p role="alert" className="rounded-lg border border-destructive bg-paper p-3 text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="flex gap-2 rounded-lg border border-gold/40 bg-surface p-4 text-sm text-cream"><Check className="size-5 shrink-0 text-gold" />{notice}</p>}
        <Button disabled={busy || (recovery && (!recoveryValid || !user))} type="submit" className="h-12 w-full rounded-lg bg-gold text-sm font-semibold text-ink hover:bg-gold-soft">{busy ? <LoaderCircle className="animate-spin" /> : <>{recovery ? "Update password" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}<ArrowRight /></>}</Button>
      </form>
      {recovery ? <Button asChild variant="link" className="mt-5 w-full text-gold"><Link to="/auth">Back to sign in</Link></Button> : <p className="mt-6 text-center text-sm text-cream/70">{mode === "forgot" ? "Remember your password?" : mode === "signup" ? "Already have an account?" : "New to MyGate Car Care?"} <Button variant="link" onClick={() => switchMode(mode === "signin" ? "signup" : "signin")} className="h-auto px-1 text-gold">{mode === "signin" ? "Create account" : "Sign in"}</Button></p>}
      <div className="mt-10 flex items-center justify-center gap-2 border-t border-line pt-6 text-xs text-cream/60"><LockKeyhole className="size-3.5" />Secure sign-in<ShieldCheck className="ml-3 size-3.5" />Trusted society care</div>
    </section>
  </main>;
}