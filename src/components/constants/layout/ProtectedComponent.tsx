"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { usersService } from "@/supabase/services/userService";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useSetAtom } from "jotai";
import { currentUserAtom } from "@/jotai/store";
import { toast } from "sonner";

const ProtectedComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const setCurrentUser = useSetAtom(currentUserAtom);

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      try {
        const [session, user] = await Promise.all([
          usersService.getSession(),
          usersService.getCurrentUser(),
        ]);

        if (!session) {
          router.push("/login");
          return;
        }

        if (user) setCurrentUser(user);

        const {
          data: { subscription },
        } = usersService.onAuthStateChange((event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            toast.error("Session expired. Please login again.");
            setCurrentUser(null);
            router.push("/login");
          }
        });

        unsubscribe = () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth check failed:", err);
        toast.error("Authentication error. Please login again.");
        router.push("/login");
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router, setCurrentUser]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
};

export default ProtectedComponent;
