import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const AccountContext = createContext<{ user: User | null; loading: boolean; signOut: () => Promise<void> }>({ user: null, loading: true, signOut: async () => {} });
export const useAccount = () => useContext(AccountContext);
export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const { data } = await supabase.auth.getUser();
      if (alive) { setUser(data.user); setLoading(false); }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "PASSWORD_RECOVERY"].includes(event)) return;
      if (event === "SIGNED_OUT") { setUser(null); queryClient.clear(); }
      else { void refresh(); void queryClient.invalidateQueries(); }
      void router.invalidate();
    });
    void refresh();
    return () => { alive = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    await navigate({ to: "/auth", replace: true });
  };
  return <AccountContext.Provider value={{ user, loading, signOut }}>{children}</AccountContext.Provider>;
}