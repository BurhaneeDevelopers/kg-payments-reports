"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { usersService } from "@/supabase/services/userService";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/jotai/store";
import { toast } from "sonner";

const ProtectedComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  // const pathname = usePathname();
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const init = async () => {
      setLoading(true);
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

        // if (user && pathname === "/") {
        //   if (user.role === "agency") {
        //     router.replace("/active-requests");
        //   } else if (user.role === "admin") {
        //     router.replace("/admin-dashboard");
        //   }
        // }

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
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
      setLoading(false);
    };
  }, [router, setCurrentUser]);

  if (loading) return "loading...";

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
