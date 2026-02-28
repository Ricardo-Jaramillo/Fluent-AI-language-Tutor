"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { createClient } from "@/lib/supabase";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch profile from DB
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              id: session.user.id,
              email: session.user.email ?? "",
              displayName: profile?.display_name ?? null,
              currentLevel: profile?.current_level ?? "A1",
            });
          });
      } else {
        setUser(null);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              id: session.user.id,
              email: session.user.email ?? "",
              displayName: profile?.display_name ?? null,
              currentLevel: profile?.current_level ?? "A1",
            });
          });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
